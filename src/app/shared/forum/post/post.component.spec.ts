import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ForumPostComponent } from './post.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ForumPost, PostComment } from '../../../models/forum-post.model';

describe('ForumPostComponent', () => {
  let component: ForumPostComponent;
  let fixture: ComponentFixture<ForumPostComponent>;
  let httpMock: HttpTestingController;

  const mockLocation = {
    getState: () => ({
      post: {
        docId: 'post123',
        title: 'Título Teste',
        content: 'Conteúdo Teste',
        userId: 'user123',
        userName: 'Usuário Teste',
        likes: 0,
        comments: [],
        createdAt: new Date(),
        courseId: 'curso1'
      } as ForumPost,
      isLiked: true
    })
  };

  const mockAuthService = {
    getUserId: () => Promise.resolve('user123'),
    getUserName: () => Promise.resolve('Usuário Teste'),
    getUserRole: () => Promise.resolve('student')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForumPostComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [
        { provide: Location, useValue: mockLocation },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumPostComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // ngOnInit executa aqui
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar post e isLiked com dados da localização', () => {
    expect(component.post.title).toBe('Título Teste');
    expect(component.isLiked).toBeTrue();
  });

  it('deve carregar comentários no ngOnInit', fakeAsync(() => {
    const req = httpMock.expectOne('http://localhost:3000/getComments');
    expect(req.request.method).toBe('POST');
    req.flush(JSON.stringify([
      { content: 'Comentário 1', createdAt: new Date().toISOString(), userId: '1', postId: 'post123', userName: 'Aluno', userRole: 'student' }
    ]));
    tick();

    expect(component.comments?.length).toBe(1);
  }));

  it('deve enviar um comentário com sucesso', fakeAsync(async () => {
    component.enteredComment = 'Comentário Teste';

    await component.onAddComment();

    const req = httpMock.expectOne('http://localhost:3000/createComment');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });
    tick();

    expect(component.comments?.length).toBe(1);
    expect(component.enteredComment).toBe('');
    expect(component.isCreatingPost).toBeFalse();
  }));

  it('deve curtir e descurtir o post corretamente', fakeAsync(() => {
    component.isLiked = false;
    component.post.likes = 0;

    component.likePost(component.post.docId);

    const req = httpMock.expectOne('http://localhost:3000/likePost');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ postId: 'post123', like: true });
    req.flush({ success: true });
    tick();

    expect(component.isLiked).toBeTrue();
    expect(component.post.likes).toBe(1);

    component.likePost(component.post.docId);

    const req2 = httpMock.expectOne('http://localhost:3000/likePost');
    expect(req2.request.body).toEqual({ postId: 'post123', like: false });
    req2.flush({ success: true });
    tick();

    expect(component.isLiked).toBeFalse();
    expect(component.post.likes).toBe(0);
  }));

  it('deve lidar com erro ao carregar comentários', () => {
    const req = httpMock.expectOne('http://localhost:3000/getComments');
    req.error(new ErrorEvent('Network error'));
    expect(component.comments).toBeUndefined();
  });
});

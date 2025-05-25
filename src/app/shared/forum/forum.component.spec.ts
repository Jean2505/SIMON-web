import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SubjectForumComponent } from './forum.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { CardComponent } from './card/card.component';
import { NewPostComponent } from './new-post/new-post.component';

describe('SubjectForumComponent', () => {
  let component: SubjectForumComponent;
  let fixture: ComponentFixture<SubjectForumComponent>;
  let httpMock: HttpTestingController;

  const mockActivatedRoute = {
    parent: {
      paramMap: of({
        get: (key: string) => (key === 'id' ? '123' : null)
      })
    }
  };

  const mockUser = {
    uid: 'user123',
    email: 'test@example.com'
  } as any;

  const mockAuth = {
    currentUser: mockUser
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SubjectForumComponent, CardComponent, NewPostComponent],
      providers: [
        { provide: Auth, useValue: mockAuth },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectForumComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // dispara ngOnInit()
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar subjectId e carregar posts', fakeAsync(() => {
    const req = httpMock.expectOne('http://localhost:3000/getForumPosts');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.courseId).toBe('123');

    const mockResponse = JSON.stringify([
      {
        docId: 'abc',
        data: {
          content: 'Post de teste',
          title: 'Título',
          userId: 'user123',
          userName: 'Fulano',
          likes: 0,
          createdAt: new Date().toISOString(),
          courseId: '123',
          comments: []
        }
      }
    ]);

    req.flush(mockResponse);
    tick();

    expect(component.posts.length).toBe(1);
    expect(component.posts[0].title).toBe('Título');
    expect(component.subjectId).toBe('123');
  }));

  it('deve alternar o estado de isCreatingPost com createPost()', () => {
    expect(component.isCreatingPost).toBeFalse();
    component.createPost();
    expect(component.isCreatingPost).toBeTrue();
    component.createPost();
    expect(component.isCreatingPost).toBeFalse();
  });

  it('deve fechar modal ao chamar closePost()', () => {
    component.isCreatingPost = true;
    component.closePost();
    expect(component.isCreatingPost).toBeFalse();
  });

  it('deve atribuir o usuário atual ao carregar o componente', () => {
    expect(component.user).toBeDefined();
    expect(component.user.uid).toBe('user123');
  });
});

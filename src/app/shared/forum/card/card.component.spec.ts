import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ForumPost } from '../../../models/forum-post.model';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockPost: ForumPost = {
    courseId: 'c01',
    userId: 'u01',
    docId: 'abc123',
    title: 'Título do Post',
    content: 'Conteúdo do Post',
    createdAt: new Date(),
    userName: 'Usuário Teste',
    likes: 0,
    comments: []
  };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CardComponent],
      providers: [
        DatePipe,
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: {} } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    component.post = { ...mockPost };
    component.userId = 'user123';
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // garante que não há requisições pendentes
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir os dados do post no ngOnInit', () => {
    spyOn(console, 'log');
    component.ngOnInit();
    expect(console.log).toHaveBeenCalledWith(mockPost);
    expect(console.log).toHaveBeenCalledWith('user123');
  });

  it('deve curtir o post e atualizar os likes corretamente', fakeAsync(() => {
    component.isLiked = false;
    component.likePost(mockPost.docId);

    const req = httpMock.expectOne('http://localhost:3000/likePost');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ postId: mockPost.docId, like: true });

    req.flush({ success: true });

    tick();
    expect(component.isLiked).toBeTrue();
    expect(component.post.likes).toBe(1);
  }));

  it('deve descurtir o post e atualizar os likes corretamente', fakeAsync(() => {
    component.isLiked = true;
    component.post.likes = 3;

    component.likePost(mockPost.docId);

    const req = httpMock.expectOne('http://localhost:3000/likePost');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ postId: mockPost.docId, like: false });

    req.flush({ success: true });

    tick();
    expect(component.isLiked).toBeFalse();
    expect(component.post.likes).toBe(2);
  }));

  it('deve navegar para o post ao clicar', () => {
    const mockEvent = new MouseEvent('click');
    spyOn(console, 'log');
    component.goPost(mockEvent);

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      [mockPost.docId],
      jasmine.objectContaining({
        relativeTo: TestBed.inject(ActivatedRoute),
        state: {
          post: component.post,
          isLiked: component.isLiked
        }
      })
    );
  });
});

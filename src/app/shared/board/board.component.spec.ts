import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { SubjectBoardComponent } from './board.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Auth, User } from '@angular/fire/auth';
import { NewPostComponent } from './new-post/new-post.component';
import { CardComponent } from './card/card.component';

describe('SubjectBoardComponent', () => {
  let component: SubjectBoardComponent;
  let fixture: ComponentFixture<SubjectBoardComponent>;
  let httpMock: HttpTestingController;

  const mockUser: Partial<User> = {
    getIdTokenResult: () => Promise.resolve({
      claims: { role: 'PROFESSOR' }
    } as any)
  };

  const mockActivatedRoute = {
    parent: {
      paramMap: of({
        get: (key: string) => '123'
      })
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SubjectBoardComponent, NewPostComponent, CardComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Auth, useValue: { currentUser: mockUser } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectBoardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica se não há requisições pendentes
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar e carregar posts', fakeAsync(async () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:3000/getMuralPosts');
    expect(req.request.method).toBe('POST');
    req.flush({
      payload: JSON.stringify([
        {
          title: 'Título',
          content: 'Conteúdo',
          userName: 'Usuário',
          createdAt: { _seconds: 1716480000, _nanoseconds: 0 },
          disciplinaId: '123',
          files: [],
          images: [],
          videos: []
        }
      ])
    });

    tick(); // resolve o Promise do getIdTokenResult

    expect(component.posts.length).toBe(1);
    expect(component.isLoading).toBeFalse();
  }));

  it('deve definir isProfessor como true se a role for PROFESSOR', fakeAsync(async () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:3000/getMuralPosts');
    req.flush({
      payload: JSON.stringify([])
    });

    tick();

    expect(component.isProfessor).toBeTrue();
  }));

  it('deve abrir e fechar o componente de criação de post', () => {
    expect(component.isCreatingPost).toBeFalse();
    component.onStartCreatePost();
    expect(component.isCreatingPost).toBeTrue();
    component.onCloseCreatePost();
    expect(component.isCreatingPost).toBeFalse();
  });

  it('deve retornar 0 se lista de posts for null', () => {
    expect(component.trackPosts(null)).toBe(0);
  });

  it('deve retornar a quantidade de posts no trackPosts', () => {
    expect(component.trackPosts([{} as any, {} as any])).toBe(2);
  });
});


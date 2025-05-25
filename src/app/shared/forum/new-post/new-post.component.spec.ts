import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NewPostComponent } from './new-post.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { of, throwError } from 'rxjs';
import { ForumPost } from '../../../models/forum-post.model';

describe('NewPostComponent', () => {
  let component: NewPostComponent;
  let fixture: ComponentFixture<NewPostComponent>;
  let httpMock: HttpTestingController;

  const mockAuth: Partial<Auth> = {
    currentUser: {
      uid: 'user123',
      displayName: 'Usuário Teste'
    } as any
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, NewPostComponent],
      providers: [
        { provide: Auth, useValue: mockAuth }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPostComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    component.subjectId = 'abc123';
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar corretamente no ngOnInit', () => {
    spyOn(console, 'log');
    localStorage.setItem('studentData', '{"name":"Aluno"}');
    component.ngOnInit();
    expect(console.log).toHaveBeenCalledWith('{"name":"Aluno"}');
    expect(console.log).toHaveBeenCalledWith('ID da matéria:', 'abc123');
    expect(console.log).toHaveBeenCalledWith('Novo post iniciado');
  });

  it('deve enviar o post corretamente', fakeAsync(() => {
    spyOn(console, 'log');
    spyOn(window.location, 'reload');

    component.enteredTitle = 'Teste Título';
    component.enteredContent = 'Conteúdo de teste';

    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:3000/createForumPost');
    expect(req.request.method).toBe('POST');

    const postBody = req.request.body as ForumPost;
    expect(postBody.title).toBe('Teste Título');
    expect(postBody.content).toBe('Conteúdo de teste');
    expect(postBody.userId).toBe('user123');
    expect(postBody.userName).toBe('Usuário Teste');

    req.flush({ success: true });
    tick();

    expect(console.log).toHaveBeenCalledWith('Post criado com sucesso:', { success: true });
    expect(window.location.reload).toHaveBeenCalled();
    expect(component.isSending).toBeFalse();
  }));

  it('deve lidar com erro ao enviar post', fakeAsync(() => {
    spyOn(console, 'error');

    component.enteredTitle = 'Erro Teste';
    component.enteredContent = 'Teste de erro';

    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:3000/createForumPost');
    req.flush({ message: 'Erro' }, { status: 500, statusText: 'Erro Interno' });
    tick();

    expect(console.error).toHaveBeenCalled();
    expect(component.isSending).toBeFalse();
  }));

  it('deve abrir e fechar o modal corretamente', () => {
    component.openModal();
    expect(component.showModal).toBeTrue();

    component.closeModal();
    expect(component.showModal).toBeFalse();
  });
});

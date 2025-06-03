import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import * as authModule from '@angular/fire/auth'; // <— importe o módulo inteiro
import { Auth, UserCredential } from '@angular/fire/auth';

import { AuthService } from '../../core/services/auth.service';
import { SessionStorageService } from '../../core/services/session-storage.service';

// Mocks manuais
const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

const mockSessionStorage = {
  setData: jasmine.createSpy('setData')
};

const mockAuthService = {
  updateDisplayName: jasmine.createSpy('updateDisplayName').and.returnValue(Promise.resolve())
};

const mockUser = {
  uid: 'mockUid',
  getIdTokenResult: async () => ({
    claims: { role: 'ALUNO' }
  }),
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let mockAuth: Partial<Auth>;

  beforeEach(async () => {
    mockAuth = {
      currentUser: mockUser as any
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule],
      declarations: [LoginComponent],
      providers: [
        { provide: Auth, useValue: mockAuth },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: SessionStorageService, useValue: mockSessionStorage }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve fazer login como ALUNO e redirecionar para /student', fakeAsync(async () => {
    component.enteredEmail = 'aluno@email.com';
    component.enteredPassword = '123456';

    // Espiona o método correto no módulo authModule
    spyOn(authModule, 'signInWithEmailAndPassword').and.callFake(() =>
      Promise.resolve({ user: mockUser } as unknown as UserCredential)
    );

    await component.onSubmit();
    tick();

    const req = httpMock.expectOne('http://localhost:3000/getStudent');
    expect(req.request.method).toBe('POST');
    req.flush({
      payload: JSON.stringify({ nome: 'João', id: 'aluno123' })
    });

    tick(); // aguarda Promises internas

    expect(mockSessionStorage.setData).toHaveBeenCalledWith('role', { role: 'ALUNO' });
    expect(mockSessionStorage.setData).toHaveBeenCalledWith('user', {
      nome: 'João',
      id: 'aluno123'
    });

    expect(mockAuthService.updateDisplayName).toHaveBeenCalledWith('João');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/student']);
  }));

  it('deve mostrar alerta e logar erro em caso de falha no login', fakeAsync(() => {
    spyOn(window, 'alert');

    // Agora espionamos signInWithEmailAndPassword corretamente
    spyOn(authModule, 'signInWithEmailAndPassword').and.callFake(() =>
      Promise.reject(new Error('Credenciais inválidas'))
    );

    component.enteredEmail = 'errado@email.com';
    component.enteredPassword = 'senhaerrada';

    component.onSubmit();
    tick();

    expect(window.alert).toHaveBeenCalledWith(
      'Erro ao fazer login. Verifique suas credenciais!'
    );
  }));
});

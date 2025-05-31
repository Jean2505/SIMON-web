import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TutorProfileComponent } from './tutor-profile.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { SessionStorageService } from '../../core/services/session-storage.service';
import { of } from 'rxjs';

describe('TutorProfileComponent', () => {
  let component: TutorProfileComponent;
  let fixture: ComponentFixture<TutorProfileComponent>;
  let httpMock: HttpTestingController;
  let sessionSpy: jasmine.SpyObj<SessionStorageService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('SessionStorageService', [
      'getData',
      'setData',
      'getAllData'
    ]);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TutorProfileComponent],
      providers: [
        { provide: SessionStorageService, useValue: spy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              url: [{ path: 'tutor-profile' }],       // simula rota /tutor-profile
              params: { id: 'aluno-999' }            // para viewingProfile
            }
          }
        }
      ]
    }).compileComponents();

    sessionSpy = TestBed.inject(SessionStorageService) as any;
    // mock dos dados gravados
    sessionSpy.getData.and.callFake((_key, field: keyof any) => {
      const u = { uid: 'U1', nome: 'João', email: 'joao@x.com', foto: '/joao.png' };
      return (u as any)[field];
    });
    sessionSpy.getAllDataFromKey.and.returnValue({
      uid: 'U1', nome: 'João', email: 'joao@x.com', foto: '/joao.png'
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorProfileComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // dispara ngOnInit()
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve criar o componente e inicializar selection', () => {
    expect(component).toBeTruthy();
    // após ngOnInit, selection deve ter entrada para cada dia e hora = false
    expect(component.selection[0]['08:00']).toBeFalse();
    expect(component.selection[component.days.length - 1]['22:00']).toBeFalse();
  });

  it('deve rodar managingProfile quando for tutor-profile', () => {
    // pela rota simulada, isTutor = true e managed via sessionStorage
    expect(component.isTutor).toBeTrue();
    expect(component.userName).toBe('João');
    expect(component.userEmail).toBe('joao@x.com');
    expect(component.userPhoto).toBe('/joao.png');
  });

  it('deve carregar subjects via HTTP', fakeAsync(() => {
    const fakeSubjects = JSON.stringify([{ disciplinaId: 'D1', disciplina: 'X' }]);
    const req = httpMock.expectOne('http://localhost:3000/getTutorCourses');
    expect(req.request.method).toBe('POST');
    req.flush(fakeSubjects);
    tick();
    expect(component.subjects.length).toBe(1);
    expect(component.subjects[0].disciplinaId).toBe('D1');
  }));

  it('deve alternar slot, getSelected e hasCheckedSlot', () => {
    // inicialmente nenhum marcado
    expect(component.getSelected()).toEqual([]);
    expect(component.hasCheckedSlot(2)).toBeFalse();

    // marca um slot
    component.toggleSlot(2, '10:00');
    expect(component.selection[2]['10:00']).toBeTrue();
    expect(component.getSelected()).toContain({ day: 'Qua', time: '10:00' });
    expect(component.hasCheckedSlot(2)).toBeTrue();
  });

  it('deve alternar isTutoring e editar perfil', () => {
    expect(component.isTutoring).toBeFalse();
    component.onToggle(true);
    expect(component.isTutoring).toBeTrue();

    expect(component.isEditingProfile).toBeFalse();
    component.onEditProfile();
    expect(component.isEditingProfile).toBeTrue();
  });

  it('deve salvar perfil e chamar HTTP + sessionStorage.setData + reload', fakeAsync(() => {
    spyOn(window.location, 'reload');
    component.uid = 'U1';
    component.userName = 'Novo';
    component.userEmail = 'novo@x.com';
    component.userPhoto = '/novo.png';

    component.onSaveProfile();

    // HTTP de updateUser
    const req = httpMock.expectOne('http://localhost:3000/updateUser');
    expect(req.request.body).toEqual({
      uid: 'U1',
      update: { nome: 'Novo', email: 'novo@x.com', foto: '/novo.png' }
    });
    req.flush({ success: true });
    tick();

    // sessionStorage e reload
    expect(sessionSpy.setData).toHaveBeenCalledWith('user', jasmine.objectContaining({
      uid: 'U1', nome: 'Novo', email: 'novo@x.com', foto: '/novo.png'
    }));
    expect(window.location.reload).toHaveBeenCalled();
  }));
});
  
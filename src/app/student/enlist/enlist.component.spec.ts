import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { StudentEnlistComponent } from './enlist.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Auth } from '@angular/fire/auth';
import { of } from 'rxjs';

describe('StudentEnlistComponent', () => {
  let component: StudentEnlistComponent;
  let fixture: ComponentFixture<StudentEnlistComponent>;
  let httpMock: HttpTestingController;
  let authMock: Partial<Auth>;
  let routerSpy: any;

  const fakeUser = { uid: 'test-uid' } as any;

  beforeEach(waitForAsync(() => {
    // Mock simples do Auth
    authMock = {
      currentUser: fakeUser
    };

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatFormFieldModule
      ],
      declarations: [StudentEnlistComponent],
      providers: [
        { provide: Auth, useValue: authMock },
        { provide: 'Router', useValue: routerSpy }
      ]
    })
    .overrideComponent(StudentEnlistComponent, {
      set: {
        providers: [
          { provide: Auth, useValue: authMock },
          { provide: 'Router', useValue: routerSpy }
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentEnlistComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load student data on init and call loadSubjects', fakeAsync(() => {
    // Espiando loadSubjects
    spyOn(component, 'loadSubjects').and.callThrough();

    component.ngOnInit();

    // Espera requisição POST para getStudent
    const req = httpMock.expectOne('http://localhost:3000/getStudent');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.uid).toBe('test-uid');

    // Simula resposta
    req.flush({ payload: JSON.stringify({
      nome: 'Aluno Teste',
      uid: 'test-uid',
      ra: '123456',
      curso: 'Engenharia',
      photo: 'url-foto',
      term: 4
    }) });

    tick();

    expect(component.student.nome).toBe('Aluno Teste');
    expect(component.loadSubjects).toHaveBeenCalled();

    // Espera requisição POST para getExternalCourses
    const reqSubjects = httpMock.expectOne('http://localhost:3000/getExternalCourses');
    expect(reqSubjects.request.body.course).toBe('Engenharia');

    // Simula resposta das matérias
    const subjectsMock = [
      { id: 1, name: 'Matemática' },
      { id: 2, name: 'Física' }
    ];
    reqSubjects.flush(JSON.stringify(subjectsMock));

    tick();

    expect(component.subjectsOptions.length).toBe(2);
    expect(component.subjectsOptions[0].name).toBe('Matemática');
  }));

  it('should send candidature successfully on enlist()', fakeAsync(() => {
    // Configura dados obrigatórios
    component.message = 'Quero muito essa monitoria';
    component.selectedSubject = { id: '1', name: 'Matemática', course: 'Curso X', professor: 'Professor A', term: 1 };
    component.selectedHours = 12;
    component.student = {
      nome: 'Aluno Teste',
      uid: 'uid123',
      ra: '123456',
      curso: 'Engenharia',
      term: 4,
      foto: 'foto-url'
    };
    component.isSwitchOn = true;

    spyOn(window, 'alert');
    
    component.enlist();

    const req = httpMock.expectOne('http://localhost:3000/enlist');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.nome).toBe('Aluno Teste');
    expect(req.request.body.mensagem).toBe('Quero muito essa monitoria');

    req.flush({ success: true });

    tick();

    expect(window.alert).toHaveBeenCalledWith('Candidatura enviada com sucesso!');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/student/home']);
  }));

  it('should not send candidature if message is empty', () => {
    component.message = '';
    spyOn(console, 'error');
    component.enlist();
    expect(console.error).toHaveBeenCalledWith('Mensagem não pode ser vazia');
  });

  it('should handle error on enlist()', fakeAsync(() => {
    component.message = 'Teste de erro';
    component.selectedSubject = { id: '1', name: 'Matemática', course: 'Curso X', professor: 'Professor Y', term: 1 };
    component.selectedHours = 6;
    component.student = {
      nome: 'Aluno Teste',
      uid: 'uid123',
      ra: '123456',
      curso: 'Engenharia',
      term: 4,
      foto: 'foto-url'
    };

    spyOn(window, 'alert');
    spyOn(console, 'error');

    component.enlist();

    const req = httpMock.expectOne('http://localhost:3000/enlist');
    req.error(new ErrorEvent('Network error'));

    tick();

    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Erro ao enviar candidatura. Tente novamente mais tarde.');
  }));
});

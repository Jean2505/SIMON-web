import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ListSubjectsComponent } from './list-subjects.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { of } from 'rxjs';
import { DisciplineComponent } from './discipline/discipline.component';

describe('ListSubjectsComponent', () => {
  let component: ListSubjectsComponent;
  let fixture: ComponentFixture<ListSubjectsComponent>;
  let httpMock: HttpTestingController;

  const mockUser = {
    uid: 'user123',
    getIdTokenResult: async () => ({
      claims: { role: 'STUDENT' }
    })
  } as any;

  const mockAuth = {
    currentUser: mockUser
  };

  const mockActivatedRoute = {
    paramMap: of({ get: () => 'curso123' })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ListSubjectsComponent, DisciplineComponent],
      providers: [
        { provide: Auth, useValue: mockAuth },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSubjectsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // dispara ngOnInit
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve obter a role do usuário e carregar disciplinas do estudante', fakeAsync(async () => {
    await component.ngOnInit();
    expect(component.role).toBe('STUDENT');

    const reqUser = httpMock.expectOne('http://localhost:300/getUser');
    expect(reqUser.request.method).toBe('POST');
    reqUser.flush({
      payload: JSON.stringify({ curso: 'cursoXYZ' })
    });

    const reqSubjects = httpMock.expectOne('http://localhost:3000/getDisciplinas');
    expect(reqSubjects.request.method).toBe('POST');
    reqSubjects.flush({
      payload: JSON.stringify([
        {
          id: 'subj1',
          cursoId: 'cursoXYZ',
          name: 'Matemática',
          professor: 'Prof. João',
          term: '1º',
          monitorAmnt: 2
        }
      ])
    });

    tick(); // aguarda as promessas

    expect(component.courseId).toBe('cursoXYZ');
    expect(component.subjects.length).toBe(1);
    expect(component.subjects[0].name).toBe('Matemática');
    expect(component.loadingDisciplinas).toBeFalse();
    expect(component.loadingSync).toBeFalse();
  }));

  it('deve carregar disciplinas do professor se role for PROFESSOR', fakeAsync(async () => {
    // força o papel como professor
    component.role = 'PROFESSOR';
    component.user = mockUser;
    component.getProfessorSubjects();

    const req = httpMock.expectOne('http://localhost:3000/getProfessorDisciplines');
    expect(req.request.method).toBe('POST');
    req.flush(JSON.stringify([
      {
        id: 'subj1',
        cursoId: 'cursoP',
        name: 'Física',
        professor: 'Prof. Maria',
        term: '2º',
        monitorAmnt: 3
      }
    ]));

    tick();

    expect(component.subjects.length).toBe(1);
    expect(component.subjects[0].name).toBe('Física');
  }));

  it('deve retornar o id no método trackBySubject', () => {
    const subject = { id: 'abc123' } as any;
    expect(component.trackBySubject(0, subject)).toBe('abc123');
  });
});

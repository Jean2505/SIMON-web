import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { InstitutionManageSubjectsComponent } from './manage-subjects.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('InstitutionManageSubjectsComponent', () => {
  let component: InstitutionManageSubjectsComponent;
  let fixture: ComponentFixture<InstitutionManageSubjectsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, InstitutionManageSubjectsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // ignora componentes como <app-discipline>
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionManageSubjectsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // verifica se não há requisições pendentes
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar escolas no ngOnInit', fakeAsync(() => {
    const mockSchools = [{ escolaId: '1', name: 'Escola A' }];
    component.ngOnInit();

    const req = httpMock.expectOne('http://localhost:3000/schools');
    expect(req.request.method).toBe('GET');
    req.flush(mockSchools);

    tick(); // simula passagem de tempo
    expect(component.schools).toEqual(mockSchools);
    expect(component.loadingSchools).toBeFalse();
  }));

  it('deve carregar cursos ao selecionar uma escola', fakeAsync(() => {
    const mockCourses = [{ school: '1', name: 'Curso X' }];
    component.onSelectSchool('1');

    const req = httpMock.expectOne('http://localhost:3000/courses?school=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockCourses);

    tick();
    expect(component.selectedSchoolId).toBe('1');
    expect(component.majors).toEqual(mockCourses);
    expect(component.loadingCourses).toBeFalse();
  }));

  it('deve carregar disciplinas ao selecionar um curso', fakeAsync(() => {
    const mockSubjects = [
      {
        id: 'subj1',
        course: 'Curso X',
        name: 'Matemática',
        professor: 'Prof. Fulano',
        term: '1',
        monitors: [],
        school: '1',
      },
    ] as any;
    const mockCourse = { school: '1', name: 'Curso X' };

    component.majors = [mockCourse];
    component.onSelectCourse('101');

    const req = httpMock.expectOne('http://localhost:3000/getExternalCourses');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ course: 'Curso X' });

    req.flush({ payload: mockSubjects });

    tick();
    expect(component.subjects).toEqual(mockSubjects);
    expect(component.loadingSubjects).toBeFalse();
  }));

  it('deve exibir erro se curso não for encontrado ao selecionar', () => {
    spyOn(console, 'error');
    component.majors = [];
    component.onSelectCourse('inexistente');
    expect(console.error).toHaveBeenCalledWith('Curso não encontrado');
  });
});

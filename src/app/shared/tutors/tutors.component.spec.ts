import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SubjectTutorsComponent } from './tutors.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TutorComponent } from './tutor/tutor.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SubjectTutorsComponent', () => {
  let component: SubjectTutorsComponent;
  let fixture: ComponentFixture<SubjectTutorsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SubjectTutorsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              paramMap: of({
                get: (key: string) => '123', // mock do ID da disciplina
              }),
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // para ignorar elementos desconhecidos, como app-tutor
    }).compileComponents();

    fixture = TestBed.createComponent(SubjectTutorsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // chama ngOnInit
  });

  afterEach(() => {
    httpMock.verify(); // garante que não há requisições pendentes
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve buscar disciplina e monitores no ngOnInit', fakeAsync(() => {
    // Simula resposta da API de disciplina
    const disciplinaResponse = [{ nome_Disciplina: 'Matemática' }];
    const monitoresResponse = {
      payload: JSON.stringify([
        {
          aprovacao: true,
          disciplina: 'Matemática',
          disciplinaId: '123',
          foto: '/img.jpg',
          horarioDisponivel: [],
          local: 'Bloco A',
          nome: 'João',
          ra: '111111',
          sala: '101',
          status: 'ativo',
        },
      ]),
    };

    // Espera chamadas HTTP
    const reqDisciplina = httpMock.expectOne((req) =>
      req.method === 'GET' && req.url.includes('/discipline')
    );
    expect(reqDisciplina.request.params.get('disciplineId')).toBe('123');
    reqDisciplina.flush(disciplinaResponse);

    const reqMonitores = httpMock.expectOne((req) =>
      req.method === 'POST' && req.url.includes('/getTutor')
    );
    expect(reqMonitores.request.body.courseId).toBe('123');
    reqMonitores.flush(monitoresResponse);

    tick(); // resolve observables

    expect(component.discipline).toBe('Matemática');
    expect(component.tutors.length).toBe(1);
    expect(component.tutors[0].nome).toBe('João');
    expect(component.loadingTutors).toBeFalse();
  }));

  it('deve lidar com erro ao buscar disciplina', fakeAsync(() => {
    const consoleSpy = spyOn(console, 'error');

    // Simula erro na requisição de disciplina
    const reqDisciplina = httpMock.expectOne((req) =>
      req.method === 'GET' && req.url.includes('/discipline')
    );
    reqDisciplina.flush('Erro', { status: 500, statusText: 'Erro servidor' });

    const reqMonitores = httpMock.expectOne((req) =>
      req.method === 'POST' && req.url.includes('/getTutor')
    );
    reqMonitores.flush({ payload: '[]' });

    tick();
    expect(consoleSpy).toHaveBeenCalledWith('Erro ao buscar disciplina:', jasmine.anything());
    expect(component.tutors.length).toBe(0);
  }));

  it('deve lidar com erro ao buscar monitores', fakeAsync(() => {
    const consoleSpy = spyOn(console, 'error');

    const reqDisciplina = httpMock.expectOne((req) =>
      req.method === 'GET' && req.url.includes('/discipline')
    );
    reqDisciplina.flush([{ nome_Disciplina: 'Matemática' }]);

    const reqMonitores = httpMock.expectOne((req) =>
      req.method === 'POST' && req.url.includes('/getTutor')
    );
    reqMonitores.flush('Erro', { status: 500, statusText: 'Erro' });

    tick();
    expect(consoleSpy).toHaveBeenCalledWith('Erro ao buscar monitores:', jasmine.anything());
  }));
});

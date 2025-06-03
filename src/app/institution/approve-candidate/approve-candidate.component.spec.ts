import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ApproveCandidateComponent } from './approve-candidate.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ApproveCandidateComponent', () => {
  let component: ApproveCandidateComponent;
  let fixture: ComponentFixture<ApproveCandidateComponent>;
  let httpMock: HttpTestingController;

  const mockTutors = [
    {
      nome: 'João Silva',
      ra: '123456',
      disciplina: 'Matemática',
      cargaHoraria: 20,
      mensagem: 'Gosto de ensinar.',
      remuneracao: true,
      uid: 'abc123'
    },
    {
      nome: 'Maria Oliveira',
      ra: '654321',
      disciplina: 'Física',
      cargaHoraria: 15,
      mensagem: 'Tenho experiência.',
      remuneracao: false,
      uid: 'def456'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatExpansionModule
      ],
      declarations: [ApproveCandidateComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveCandidateComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch tutors on init', fakeAsync(() => {
    fixture.detectChanges(); // triggers ngOnInit

    const req = httpMock.expectOne('http://localhost:3000/getRequisitions');
    expect(req.request.method).toBe('GET');

    req.flush(JSON.stringify(mockTutors)); // simulate JSON as string from backend

    tick();
    expect(component.tutors.length).toBe(2);
    expect(component.tutors[0].nome).toBe('João Silva');
  }));

  it('should send approval result', fakeAsync(() => {
    const uid = 'abc123';
    const result = 1;

    component.sendResult(result, uid);

    const req = httpMock.expectOne('http://localhost:3000/updateRequisition');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ uid: uid, aprovacao: result });

    req.flush({ success: true });

    tick();
  }));

  afterEach(() => {
    httpMock.verify();
  });
});


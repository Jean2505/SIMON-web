import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Component, Input } from '@angular/core';

import { StudentSubjectsComponent } from './subjects.component';
import { Discipline } from '../../models/discipline.model';

// Stub para o component filho <app-discipline>
@Component({ selector: 'app-discipline', template: '' })
class StubDisciplineComponent {
  @Input() cursoId!: string;
  @Input() discipline!: Discipline;
}

describe('StudentSubjectsComponent', () => {
  let component: StudentSubjectsComponent;
  let fixture: ComponentFixture<StudentSubjectsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatSelectModule,
        HttpClientTestingModule
      ],
      declarations: [
        StudentSubjectsComponent,
        StubDisciplineComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentSubjectsComponent);
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

  it('should initialize with loading flags true', () => {
    expect(component.loadingDisciplinas).toBeTrue();
    expect(component.loadingSync).toBeTrue();
  });

  it('should load subjects and update state on success', fakeAsync(() => {
    const mockSubjects: Discipline[] = [
      { id: '1', name: 'Matemática', course: 'Curso X', professor: 'Professor A', term: 2 },
      { id: '2', name: 'Física',  course: 'Curso Y', professor: 'Professor B', term: 1 }
    ];

    // Chama manualmente loadSubjects
    component.loadSubjects('Engenharia');

    const req = httpMock.expectOne('http://localhost:3000/getExternalCourses');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ course: 'Engenharia' });

    // Simula resposta do backend
    req.flush(JSON.stringify(mockSubjects));
    tick();

    expect(component.subjects.length).toBe(2);
    expect(component.subjects[0].name).toBe('Matemática');
    expect(component.loadingDisciplinas).toBeFalse();
    expect(component.loadingSync).toBeFalse();
  }));

  it('should handle error in loadSubjects without throwing', fakeAsync(() => {
    spyOn(console, 'error');

    component.loadSubjects('Engenharia');

    const req = httpMock.expectOne('http://localhost:3000/getExternalCourses');
    req.error(new ErrorEvent('Network error'));
    tick();

    expect(component.subjects.length).toBe(0);
    expect(component.loadingDisciplinas).toBeFalse();
    expect(component.loadingSync).toBeFalse();
    expect(console.error).toHaveBeenCalled();
  }));

  it('trackBySubject should return discipline id', () => {
    const disc: Discipline = { id: 'abc', name: 'Teste' } as Discipline;
    const result = component.trackBySubject(0, disc);
    expect(result).toBe('abc');
  });
});

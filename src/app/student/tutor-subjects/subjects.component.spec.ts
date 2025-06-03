import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Discipline } from '../../models/discipline.model';
import { TutorSubjectsComponent } from './subjects.component';
import { Auth } from '@angular/fire/auth';
import { Component, Input } from '@angular/core';

// Stub para componente filho <app-discipline>
@Component({ selector: 'app-discipline', template: '' })
class StubDisciplineComponent {
  @Input() cursoId!: string;
  @Input() discipline!: Discipline;
}

describe('TutorSubjectsComponent', () => {
  let component: TutorSubjectsComponent;
  let fixture: ComponentFixture<TutorSubjectsComponent>;
  let httpMock: HttpTestingController;
  let authStub: Partial<Auth>;

  beforeEach(waitForAsync(() => {
    // Mock Auth com usuário logado
    authStub = {
      currentUser: { uid: 'user-123' } as any
    };

    TestBed.configureTestingModule({
      declarations: [TutorSubjectsComponent, StubDisciplineComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Auth, useValue: authStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorSubjectsComponent);
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

  it('should use auth currentUser uid in payload for getTutorCourses', fakeAsync(() => {
    component.ngOnInit();
    const req = httpMock.expectOne('http://localhost:3000/getTutorCourses');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ uid: 'user-123' });
    // Respond with empty array JSON (string)
    req.flush(JSON.stringify([]));
    tick();
    // When no approved courses, list stays empty and no second request
    expect(component.list.length).toBe(0);
    expect(component.loadingDisciplinas).toBeFalse();
    expect(component.loadingSync).toBeFalse();
  }));

  it('should load course list when approved courses exist', fakeAsync(() => {
    component.ngOnInit();
    // Mock tutor courses response with mixed aprovacao
    const tutorCourses = [
      { disciplinaId: 'd1', aprovacao: 1 },
      { disciplinaId: 'd2', aprovacao: 0 },
      { disciplinaId: 'd3', aprovacao: 1 }
    ];
    const req1 = httpMock.expectOne('http://localhost:3000/getTutorCourses');
    req1.flush(JSON.stringify(tutorCourses));
    tick();
    // list should include only approved ids
    expect(component.list).toEqual(['d1', 'd3']);

    // Expect second request to getCourseList
    const req2 = httpMock.expectOne('http://localhost:3000/getCourseList');
    expect(req2.request.method).toBe('POST');
    expect(req2.request.body).toEqual({ courses: ['d1', 'd3'] });

    // Mock course list response
    const courseList: Discipline[] = [
      { id: 'd1', course: 'c1', name: 'Disc1', professor: 'Prof1', term: 1 },
      { id: 'd3', course: 'c1', name: 'Disc3', professor: 'Prof3', term: 3 }
    ];
    req2.flush(JSON.stringify(courseList));
    tick();
    expect(component.subjects.length).toBe(2);
    expect(component.subjects[0].name).toBe('Disc1');
  }));

  it('should handle errors in getTutorCourses gracefully', fakeAsync(() => {
    spyOn(console, 'error');
    component.ngOnInit();
    const req = httpMock.expectOne('http://localhost:3000/getTutorCourses');
    req.error(new ErrorEvent('Network error'));
    tick();
    expect(console.error).toHaveBeenCalled();
    // After error, loading flags should be false and no list
    expect(component.loadingDisciplinas).toBeFalse();
    expect(component.loadingSync).toBeFalse();
    expect(component.list.length).toBe(0);
  }));

  it('should return subject.id in trackBySubject', () => {
    const sample: Discipline = { id: 'x1', course: 'c1', name: 'N', professor: 'P', term: 1, monitorAmnt: 1 } as Discipline;
    const key = component.trackBySubject(0, sample);
    expect(key).toBe('x1');
  });
});

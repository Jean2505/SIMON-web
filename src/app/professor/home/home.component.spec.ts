import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ProfessorHomeComponent } from './home.component';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummySubjectsComponent {}

@Component({ template: '' })
class DummyTutorsComponent {}

@Component({ template: '' })
class DummyEnlistComponent {}

describe('ProfessorHomeComponent', () => {
  let component: ProfessorHomeComponent;
  let fixture: ComponentFixture<ProfessorHomeComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'professor/subjects', component: DummySubjectsComponent },
          { path: 'professor/tutors', component: DummyTutorsComponent },
          { path: 'professor/enlist', component: DummyEnlistComponent }
        ])
      ],
      declarations: [ProfessorHomeComponent, DummySubjectsComponent, DummyTutorsComponent, DummyEnlistComponent]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(ProfessorHomeComponent);
    component = fixture.componentInstance;

    router.initialNavigation(); // Necessário para simular navegação
  });

  it('deve navegar para /professor/subjects ao chamar goSubjects()', fakeAsync(() => {
    component.goSubjects();
    tick();
    expect(location.path()).toBe('/professor/subjects');
  }));

  it('deve navegar para /professor/tutors ao chamar goTutors()', fakeAsync(() => {
    component.goTutors();
    tick();
    expect(location.path()).toBe('/professor/tutors');
  }));

  it('deve navegar para /professor/enlist ao chamar goEnlist()', fakeAsync(() => {
    component.goEnlist();
    tick();
    expect(location.path()).toBe('/professor/enlist');
  }));
});


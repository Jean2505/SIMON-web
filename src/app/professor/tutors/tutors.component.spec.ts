import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorTutorsComponent } from './tutors.component';

describe('TutorsComponent', () => {
  let component: ProfessorTutorsComponent;
  let fixture: ComponentFixture<ProfessorTutorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorTutorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessorTutorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

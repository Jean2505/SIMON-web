import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectTutorsComponent } from './tutors.component';

describe('TutorsComponent', () => {
  let component: SubjectTutorsComponent;
  let fixture: ComponentFixture<SubjectTutorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectTutorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectTutorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

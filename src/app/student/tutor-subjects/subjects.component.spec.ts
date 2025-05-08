import { ComponentFixture, TestBed } from '@angular/core/testing';

import {StudentSubjectsComponent } from './subjects.component';

describe('SubjectsComponent', () => {
  let component: StudentSubjectsComponent;
  let fixture: ComponentFixture<StudentSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentSubjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

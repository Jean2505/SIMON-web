import { ComponentFixture, TestBed } from '@angular/core/testing';

import {TutorSubjectsComponent } from './subjects.component';

describe('SubjectsComponent', () => {
  let component: TutorSubjectsComponent;
  let fixture: ComponentFixture<TutorSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorSubjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

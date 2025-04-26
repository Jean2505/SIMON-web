import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorMonitorsComponent } from './monitors.component';

describe('MonitorsComponent', () => {
  let component: ProfessorMonitorsComponent;
  let fixture: ComponentFixture<ProfessorMonitorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorMonitorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessorMonitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

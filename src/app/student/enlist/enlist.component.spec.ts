import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEnlistComponent } from './enlist.component';

describe('StudentEnlistComponent', () => {
  let component: StudentEnlistComponent;
  let fixture: ComponentFixture<StudentEnlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentEnlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentEnlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

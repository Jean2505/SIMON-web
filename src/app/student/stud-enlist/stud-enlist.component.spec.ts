import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudEnlistComponent } from './stud-enlist.component';

describe('StudEnlistComponent', () => {
  let component: StudEnlistComponent;
  let fixture: ComponentFixture<StudEnlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudEnlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudEnlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

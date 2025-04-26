import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorsComponent } from './monitors.component';

describe('MonitorsComponent', () => {
  let component: MonitorsComponent;
  let fixture: ComponentFixture<MonitorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

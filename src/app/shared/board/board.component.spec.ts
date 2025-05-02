import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectBoardComponent } from './board.component';

describe('BoardComponent', () => {
  let component: SubjectBoardComponent;
  let fixture: ComponentFixture<SubjectBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectBoardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SubjectBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

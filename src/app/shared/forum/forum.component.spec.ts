import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectForumComponent } from './forum.component';

describe('ForumComponent', () => {
  let component: SubjectForumComponent;
  let fixture: ComponentFixture<SubjectForumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectForumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

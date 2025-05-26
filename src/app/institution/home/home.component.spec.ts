import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstitutionHomeComponent } from './home.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

describe('InstitutionHomeComponent', () => {
  let component: InstitutionHomeComponent;
  let fixture: ComponentFixture<InstitutionHomeComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [InstitutionHomeComponent],
      providers: [
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionHomeComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to manage subjects when goManageSubjects is called', () => {
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    component.goManageSubjects();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/institution/manage-subjects']);
  });

  it('should navigate to manage tutors when goManageTutors is called', () => {
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    component.goManageTutors();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/institution/manage-tutors']);
  });
});

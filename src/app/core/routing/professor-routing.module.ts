import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HeaderComponent } from '../../shared/header/header.component';
import { ProfessorHomeComponent } from '../../professor/home/home.component';
import { ListSubjectsComponent } from '../../shared/list-subjects/list-subjects.component';
import { ProfessorTutorsComponent } from '../../professor/tutors/tutors.component';
import { TutorProfileComponent } from '../../shared/tutor-profile/tutor-profile.component';
import { RequestTutoringComponent } from '../../professor/request-tutoring/request-tutoring.component';
import { ViewReportsComponent } from '../../professor/view-reports/view-reports.component';
import { ReportsListComponent } from '../../professor/view-reports/reports-list/reports-list.component';

/* Importação de telas do professor */

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: ProfessorHomeComponent },
      { path: 'subjects', component: ListSubjectsComponent },
      { path: 'tutors', component: ProfessorTutorsComponent },
            { path: 'tutor/:id', component: TutorProfileComponent },
      {
        path: 'subject/:id',
        loadChildren: () => import('./shared.module').then(m => m.SharedModule),
      },
      { path: 'request', component: RequestTutoringComponent },
      { path: 'reports', component: ViewReportsComponent },
      { path: 'reports/:id', component: ReportsListComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessorRoutingModule { }

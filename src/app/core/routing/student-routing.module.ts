import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Importação de telas do aluno */
import { StudentHomeComponent } from '../../student/home/home.component';
import { StudentSubjectsComponent } from '../../student/subjects/subjects.component';
import { StudentEnlistComponent } from '../../student/enlist/enlist.component';
import { TutorSubjectsComponent } from '../../student/tutor-subjects/subjects.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { TutorProfileComponent } from '../../shared/tutor-profile/tutor-profile.component';

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: StudentHomeComponent },
      { path: 'subjects', component: StudentSubjectsComponent },
      { path: 'enlist', component: StudentEnlistComponent },
      { path: 'tutor-subjects', component: TutorSubjectsComponent },
      { path: 'tutor-profile', component: TutorProfileComponent },
      { path: 'tutor/:id', component: TutorProfileComponent },
      {
        path: 'subject/:id',
        loadChildren: () => import('./shared.module').then(m => m.SharedModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Importação de telas do professor */
import { ProfessorHomeComponent } from './home/home.component';
import { ProfessorTutorsComponent } from './tutors/tutors.component';
import { ListSubjectsComponent } from '../shared/list-subjects/list-subjects.component';
import { HeaderComponent } from '../shared/header/header.component';

const routes: Routes = [
  {
    path: '',
    component: HeaderComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: ProfessorHomeComponent },
      { path: 'subjects', component: ListSubjectsComponent },
      { path: 'tutors', component: ProfessorTutorsComponent },
      {
        path: 'subject/:id',
        loadChildren: () => import('../shared/shared.module').then(m => m.SharedModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessorRoutingModule { }

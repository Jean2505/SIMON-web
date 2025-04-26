import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Importação de telas do professor */
import { ProfessorHeaderComponent } from './header/header.component';
import { ProfessorHomeComponent } from './home/home.component';
import { ProfessorSubjectsComponent } from './subjects/subjects.component';
import { ProfessorTutorsComponent } from './tutors/tutors.component';

const routes: Routes = [
  {
    path: '',
    component: ProfessorHeaderComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: ProfessorHomeComponent },
      { path: 'subjects', component: ProfessorSubjectsComponent },
      { path: 'tutors', component: ProfessorTutorsComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessorRoutingModule { }

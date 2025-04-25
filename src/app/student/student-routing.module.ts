import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Importação de telas do aluno */
import { StudentHeaderComponent } from './header/header.component';
import { StudentHomeComponent } from './home/home.component';
import { StudentSubjectsComponent } from './subjects/subjects.component';
import { StudentSubjectComponent } from './subject/subject.component';
import { StudentEnlistComponent } from './enlist/enlist.component';

const routes: Routes = [
  {
    path: '',
    component: StudentHeaderComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: StudentHomeComponent },
      { path: 'subjects', component: StudentSubjectsComponent },
      { path: 'subject/:id', component: StudentSubjectComponent },
      { path: 'enlist', component: StudentEnlistComponent },
    ]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }

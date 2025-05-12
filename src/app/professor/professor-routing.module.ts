import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Importação de telas do professor */
import { ProfessorHeaderComponent } from './header/header.component';
import { ProfessorHomeComponent } from './home/home.component';
import { ProfessorTutorsComponent } from './tutors/tutors.component';
import { SubjectComponent } from '../shared/subject/subject.component';
import { SubjectBoardComponent } from '../shared/board/board.component';
import { SubjectTutorsComponent } from '../shared/tutors/tutors.component';
import { SubjectForumComponent } from '../shared/forum/forum.component';
import { ListSubjectsComponent } from '../shared/list-subjects/list-subjects.component';

const routes: Routes = [
  {
    path: '',
    component: ProfessorHeaderComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: ProfessorHomeComponent },
      { path: 'subjects', component: ListSubjectsComponent },
      { path: 'tutors', component: ProfessorTutorsComponent },
      {
        path: 'subject/:id',
        component: SubjectComponent,
        children: [
          { path: '', redirectTo: 'board', pathMatch: 'full' },
          { path: 'board', component: SubjectBoardComponent },
          { path: 'tutors', component: SubjectTutorsComponent },
          { path: 'forum', component: SubjectForumComponent },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessorRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Importação de telas do aluno */
import { StudentHeaderComponent } from './header/header.component';
import { StudentHomeComponent } from './home/home.component';
import { StudentSubjectsComponent } from './subjects/subjects.component';
import { StudentEnlistComponent } from './enlist/enlist.component';
import { SubjectBoardComponent } from '../shared/board/board.component';
import { SubjectComponent } from '../shared/subject/subject.component';
import { SubjectTutorsComponent } from '../shared/tutors/tutors.component';
import { SubjectForumComponent } from '../shared/forum/forum.component';
import { TutorSubjectsComponent } from './tutor-subjects/subjects.component';
import { ForumPostComponent } from '../shared/forum/post/post.component';

const routes: Routes = [
  {
    path: '',
    component: StudentHeaderComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: StudentHomeComponent },
      { path: 'subjects', component: StudentSubjectsComponent },
      { path: 'enlist', component: StudentEnlistComponent },
      { path: 'tutor-subjects', component: TutorSubjectsComponent },
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
export class StudentRoutingModule { }

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
      // rota com arquivos compartilhados entre aluno, professor e instituição
      {
        path: 'shared',
        loadChildren: () => import('../shared/shared.module').then(m => m.SharedModule)
      },
      {
        path: 'subject/:id',
        component: SubjectComponent,
        children: [
          { path: '', redirectTo: 'board', pathMatch: 'full' },
          { path: 'board', component: SubjectBoardComponent },
          { path: 'tutors', component: SubjectTutorsComponent },
          { path: 'forum', component: SubjectForumComponent },
          { path: 'forum/:postId', component: ForumPostComponent },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }

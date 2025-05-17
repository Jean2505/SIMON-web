import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Importação de telas da instituição */
import { InstitutionHeaderComponent } from './header/header.component';
import { InstitutionHomeComponent } from './home/home.component';
import { InstitutionManageSubjectsComponent } from './manage-subjects/manage-subjects.component';
import { SubjectComponent } from '../shared/subject/subject.component';
import { SubjectBoardComponent } from '../shared/board/board.component';
import { SubjectTutorsComponent } from '../shared/tutors/tutors.component';
import { SubjectForumComponent } from '../shared/forum/forum.component';
import { ApproveCandidateComponent } from './approve-candidate/approve-candidate.component';
import { ForumPostComponent } from '../shared/forum/post/post.component';

const routes: Routes = [
  {
    path: '',
    component: InstitutionHeaderComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: InstitutionHomeComponent },
      { path: 'manage-subjects', component: InstitutionManageSubjectsComponent },
      { path: 'manage-tutors', component: ApproveCandidateComponent },
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
export class InstitutionRoutingModule { }

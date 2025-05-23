import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SubjectComponent } from '../../shared/subject/subject.component';
import { SubjectBoardComponent } from '../../shared/board/board.component';
import { SubjectTutorsComponent } from '../../shared/tutors/tutors.component';
import { SubjectForumComponent } from '../../shared/forum/forum.component';
import { ForumPostComponent } from '../../shared/forum/post/post.component';

const routes: Routes = [
  {
    path: '',
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

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class SharedRoutingModule { }

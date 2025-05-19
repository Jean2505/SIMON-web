import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SubjectComponent } from './subject/subject.component';
import { SubjectBoardComponent } from './board/board.component';
import { SubjectTutorsComponent } from './tutors/tutors.component';
import { SubjectForumComponent } from './forum/forum.component';
import { ForumPostComponent } from './forum/post/post.component';

const routes: Routes = [

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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedRoutingModule { }

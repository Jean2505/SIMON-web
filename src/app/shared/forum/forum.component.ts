import { Component } from '@angular/core';
import { DUMMY_FORUM_POSTS } from './dummy-forumPost';
import { CardComponent } from "./card/card.component";

@Component({
  selector: 'app-forum',
  imports: [CardComponent],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.scss'
})
export class SubjectForumComponent {

  posts = DUMMY_FORUM_POSTS;

  onClickPost() {

  }

  onLikePost() {
    
  }
}

import { Component } from '@angular/core';
import { type ForumPost } from '../../../models/forum-post.model';
import { CommentsComponent } from "../comments/comments.component";
import { DUMMY_FORUM_POSTS } from '../dummy-forumPost';

@Component({
  selector: 'app-forum-post',
  imports: [CommentsComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class ForumPostComponent {

  dummy_posts = DUMMY_FORUM_POSTS;

  selectedPost!: ForumPost;

  post: ForumPost =  this.dummy_posts [1];
}

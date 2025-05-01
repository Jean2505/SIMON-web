import { Component } from '@angular/core';

import { CardComponent } from "./card/card.component";
import { DUMMY_POSTS } from './dummy-posts';
import { NewPostComponent } from "./new-post/new-post.component";

@Component({
  selector: 'app-board',
  imports: [CardComponent, NewPostComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  posts = DUMMY_POSTS;

  isCreatingPost = false;

  onStartCreatePost() {
    this.isCreatingPost = true;
  }

  onCloseCreatePost() {
    this.isCreatingPost = false;
  }
}

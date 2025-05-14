import { Component, Input } from '@angular/core';
import { type ForumPost } from '../../../models/forum-post.model';

@Component({
  selector: 'app-forum-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  @Input() post?: ForumPost;
}

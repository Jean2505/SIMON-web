import { Component, Input } from '@angular/core';
import { PostComment } from '../../../models/forum-post.model';

@Component({
  selector: 'app-comments',
  imports: [],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent {
  @Input() comment?: PostComment;
}

import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { type PostComment } from '../../../models/forum-post.model';

@Component({
  selector: 'app-comments',
  imports: [CommonModule, DatePipe],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent {
  @Input() comment?: PostComment;
}

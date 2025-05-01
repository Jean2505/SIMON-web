import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../../models/post.model';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  @Input() post!: Post;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}

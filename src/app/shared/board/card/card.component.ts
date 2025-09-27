import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { type MuralPost } from '../../../models/mural-post.model';

import { PostComponent } from "../post/post.component";

@Component({
  selector: 'app-card',
  imports: [PostComponent, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  @Input() post!: MuralPost;

  color: string = '';

  /** Indica se o post possui anexos @type {boolean} */
  hasAttachments: boolean = false;

  ngOnInit(): void {
    this.hasAttachments = this.post!.files.length > 0 || this.post!.images.length > 0 || this.post!.videos.length > 0;
    this.color = this.getRandomColor();
  }

  private getRandomColor(): string {
    const colors = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  isViewingPost = false;

  onOpenPost() {
    this.isViewingPost = true;
  }

  onClosePost() {
    this.isViewingPost = false;
  }
}

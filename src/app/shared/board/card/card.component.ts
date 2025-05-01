import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { type Post } from '../../../models/post.model';
import { PostComponent } from "../post/post.component";

@Component({
  selector: 'app-card',
  imports: [DatePipe, PostComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() post?: Post; 

  isViewingPost = false;

  onOpenPost(){
    this.isViewingPost = true;
  }

  onClosePost() {
    this.isViewingPost = false;
  }
}

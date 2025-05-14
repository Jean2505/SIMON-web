import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { type Post } from '../../../models/mural-post.model';
import { type Discipline } from '../../../models/discipline.model';

import { PostComponent } from "../post/post.component";

@Component({
  selector: 'app-card',
  imports: [DatePipe, PostComponent, CommonModule ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  @Input() post?: Post;
  
  color: string = '';

  ngOnInit(): void {
    this.color = this.getRandomColor();
  }

  private getRandomColor(): string {
    const colors = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  isViewingPost = false;

  onOpenPost(){
    this.isViewingPost = true;
  }

  onClosePost() {
    this.isViewingPost = false;
  }
}

import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { type Post } from '../../../models/post.model';
import { type Discipline } from '../../../models/discipline.model';

import { PostComponent } from "../post/post.component";

@Component({
  selector: 'app-card',
  imports: [DatePipe, PostComponent, CommonModule ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  /**
   * Interface da Disciplina
   * @property id: ID da disciplina
   * @property cursoId: ID do curso ao qual a disciplina pertence
   * @property name: Nome da disciplina
   * @property professor: Nome do professor responsável pela disciplina
   * @property term: Período da disciplina
   * @optional monitorAmnt: Quantidade de monitores para a disciplina
   */
  @Input() subject?: Discipline;

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

import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { type Post } from '../../../models/post.model';

@Component({
  selector: 'app-card',
  imports: [DatePipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() post?: Post; 
}

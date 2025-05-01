import { Component } from '@angular/core';

import { CardComponent } from "./card/card.component";
import { DUMMY_POSTS } from './dummy-posts';

@Component({
  selector: 'app-board',
  imports: [CardComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  posts = DUMMY_POSTS;

  
}

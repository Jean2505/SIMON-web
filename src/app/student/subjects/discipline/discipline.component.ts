import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { type Discipline } from '../../../models/discipline.model';

@Component({
  selector: 'app-discipline',
  imports: [FormsModule],
  templateUrl: './discipline.component.html',
  styleUrl: './discipline.component.scss'
})

// 

export class DisciplineComponent {
  @Input({required:true}) discipline!: Discipline;
  @Input({required:true}) cursoId!: string;
  enteredQuantity = '';

  constructor(private router: Router) { }

  viewSubject(discipline: Discipline): void {
    this.router.navigate([`/student/subject/${discipline.id}`]) 
      .then(success => console.log('Navegação realizada:', success))
      .catch(error => console.error('Erro na navegação:', error));
  }
}

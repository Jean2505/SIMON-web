import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { type Discipline } from './discipline.model';

@Component({
  selector: 'app-discipline',
  imports: [FormsModule],
  templateUrl: './discipline.component.html',
  styleUrl: './discipline.component.scss'
})
export class DisciplineComponent {
  @Input({required:true}) discipline!: Discipline;
  @Input({required:true}) cursoId!: string;
  enteredQuantity = '';

  onAddDiscipline(discipline: String){
    console.log('Discipline ID:', discipline);
  }
}

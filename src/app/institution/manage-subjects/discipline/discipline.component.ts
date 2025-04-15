import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { type Discipline } from './discipline.model';


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

  constructor(private http: HttpClient) { }

  onAddDiscipline(discipline: String){
    console.log('Discipline ID:', discipline);
    console.log('Monitor Amount:', this.enteredQuantity);


    this.http.post<string>('http://localhost:3000/updateCourse', { params: { id: discipline, qtdMonitors: this.enteredQuantity } })
      .subscribe(
        response => {
          console.log('Response from server:', response);
        },
        error => {
          console.error('Error sending data:', error);
        }
      );
  }
}

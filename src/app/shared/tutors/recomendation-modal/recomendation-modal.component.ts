import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgOptionComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { Student } from '../../../models/student.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recomendation-modal',
  imports: [NgLabelTemplateDirective, NgLabelTemplateDirective, NgSelectComponent, FormsModule, NgOptionComponent],
  templateUrl: './recomendation-modal.component.html',
  styleUrl: './recomendation-modal.component.scss'
})
export class RecomendationModalComponent implements OnInit{

  @Input({ required: true }) disciplineId!: string;
  @Input({ required: true }) disciplineTerm!: number ;
  @Input({ required: true }) disciplineCourse!: string;
  @Output() cancel = new EventEmitter<boolean>();

  students: Student [] = [];

  selectedStudent?: Student;

  constructor(
    /** Serviço HttpClient para requisições HTTP @type {HttpClient} */
    private http: HttpClient
  ){}

  ngOnInit(): void {
    this.getStudents();
  }

  cancelModal() {
    this.cancel.emit(false);
  }

  confirmAndClose() {

  }

  getStudents(): void {
    let result: any;
    this.http.post('http://localhost:3000/getStudentsFromDiscipline', { term: this.disciplineTerm, course: this.disciplineCourse })
      .subscribe({
        next: (response: any) => {
          this.students = JSON.parse(response);
        },
        error: error => {
          console.error('Erro ao carregar alunos:', error);
          return;
        }
      }
    )
  }
}

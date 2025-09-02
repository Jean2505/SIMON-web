import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgOptionComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { Student } from '../../../models/student.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recomendation-modal',
  imports: [NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, FormsModule, NgOptionComponent],
  templateUrl: './recomendation-modal.component.html',
  styleUrl: './recomendation-modal.component.scss'
})
export class RecomendationModalComponent implements OnInit{

  @Input({ required: true }) disciplineId!: string;
  @Input({ required: true }) disciplineTerm!: number ;
  @Input({ required: true }) disciplineCourse!: string;
  @Input({ required: true }) disciplineName?: string;
  @Input({ required: true }) professorName!: string | null;
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

  confirmAndClose(): void {
    this.http.post('http://localhost:3000/sendMonitorRecommendation',
      {
        disciplineId: this.disciplineId,
        disciplineName: this.disciplineName,
        studentUid: this.selectedStudent?.uid,
        studentName: this.selectedStudent?.nome,
        professorName: this.professorName
      })
    .subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: error => {
        console.error('Erro ao enviar recomendação: ', error);
        return;
      }
    })

    this.cancelModal();
  }

  getStudents(): void {
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

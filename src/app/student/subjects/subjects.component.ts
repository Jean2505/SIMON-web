import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';

import { DisciplineComponent } from './discipline/discipline.component';
import { Discipline } from '../../models/discipline.model';

interface School {
  escolaId: string;
  name: string;
}

interface Course {
  cursoId: string;
  escolaId: string;
  name: string;
}

@Component({
  selector: 'app-student-subjects',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    DisciplineComponent
  ],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss'
})
export class StudentSubjectsComponent implements OnInit {

  courseId = 'cursoId';

  // Dados carregados dinamicamente do backend (SQLite)
  escolas: School[] = [];
  cursos: Course[] = [];

  // Disciplinas carregadas do Firebase (após sincronização)
  subjects: Discipline[] = [];

  // Flags de carregamento
  loadingSchools: boolean = false;
  loadingCourses: boolean = false;
  loadingDisciplinas: boolean = false;
  loadingSync: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadSubjects('Engenharia de Software');
  }

  loadSubjects(course: string) {
    const payload = { course: course };
    console.log('Payload:', payload);
    this.http.post('http://localhost:3000/getExternalCourses', payload)
      .subscribe({
        next: (response: any) => {
          console.log('Matérias recebidas:', JSON.stringify(response.payload));

          this.subjects = JSON.parse(response.payload);
        },
        error: (error) => {
          console.error('Erro ao carregar matérias:', error);
        },
      });
  }

  trackBySubject(index: number, subject: Discipline): string {
    return subject.id;
  }
}

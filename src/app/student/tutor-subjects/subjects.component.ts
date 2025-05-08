import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';

import { DisciplineComponent } from './discipline/discipline.component';
import { Discipline } from '../../models/discipline.model';

/**
 * Componente para exibir as disciplinas de um curso para o estudante.
 * Busca disciplinas sincronizadas do Firebase via backend.
 */
@Component({
  selector: 'app-student-subjects',        // Seletor HTML para usar este componente
  standalone: true,                        // Componente standalone sem NgModule externo
  imports: [                               // Dependências necessárias no template
    CommonModule,
    MatSelectModule,
    DisciplineComponent
  ],
  templateUrl: './subjects.component.html',// Caminho para o template HTML
  styleUrls: ['./subjects.component.scss'] // Caminho para estilos SCSS
})
export class StudentSubjectsComponent implements OnInit {
  /** ID do curso selecionado. */
  courseId = 'cursoId';

  /** Lista de disciplinas carregadas do Firebase (após sincronização). */
  subjects: Discipline[] = [];

  /** Indica se as disciplinas estão sendo carregadas. */
  loadingDisciplinas = true;

  /** Indica se a sincronização de disciplinas está em andamento. */
  loadingSync = true;

  /**
   * Construtor do componente.
   * @param http - HttpClient para requisições HTTP.
   */
  constructor(private http: HttpClient) { }

  /**
   * Hook de ciclo de vida Angular.
   * Carrega as disciplinas de um curso padrão.
   */
  ngOnInit(): void {
    this.loadSubjects('Engenharia de Software');
  }

  /**
   * Carrega disciplinas via backend.
   * @param course - Nome do curso para consulta.
   */
  loadSubjects(course: string): void {
    const payload = { course };
    console.log('Payload:', payload);
    this.http.post('http://localhost:3000/getExternalCourses', payload)
      .subscribe({
        next: (response: any) => {
          console.log('Matérias recebidas:', JSON.stringify(response.payload));
          this.subjects = JSON.parse(response.payload);
        },
        error: (error) => {
          console.error('Erro ao carregar matérias:', error);
        }
      });
      console.log('Carregamento de matérias concluído.');
      this.loadingDisciplinas = false;
      this.loadingSync = false;
  }

  /**
   * trackBy para otimização de *ngFor em disciplinas.
   * @param index   - Índice do item no array.
   * @param subject - Objeto Discipline corrente.
   * @returns ID único da disciplina.
   */
  trackBySubject(index: number, subject: Discipline): string {
    return subject.id;
  }
}
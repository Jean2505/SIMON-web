import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';

import { DisciplineComponent } from './discipline/discipline.component';
import { Discipline } from '../../models/discipline.model';
import { Auth } from '@angular/fire/auth';

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
export class TutorSubjectsComponent implements OnInit {
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
   * @param auth - Serviço de autenticação para obter o ID do usuário.
   */
  constructor(private http: HttpClient, private auth: Auth) { }

  /**
   * Hook de ciclo de vida Angular.
   * Carrega as disciplinas de um curso padrão.
   */
  ngOnInit(): void {
    this.loadSubjects();
  }

  /**
   * Carrega disciplinas via backend.
   * @param course - Nome do curso para consulta.
   */
  loadSubjects(): void {
    const uid = this.auth.currentUser!.uid;
    const payload = { uid: uid };
    console.log('Payload:', payload);
    this.http.post('http://localhost:3000/getTutorCourses', payload)
      .subscribe({
        next: (tutorCourses: any) => {
          const result = JSON.parse(tutorCourses);
          console.log('Matérias recebidas:', result);
          let list: Array<string> = [];
          result.forEach((course: any) => {
            if (course.aprovacao == 1) {
              list.push(course.disciplinaId);
            }
          })
          console.log('Lista de cursos:', list);
          if (list.length === 0) {
            console.log('Nenhuma disciplina encontrada.');
            this.loadingDisciplinas = false;
            this.loadingSync = false;
            return;
          }
          this.http.post('http://localhost:3000/getCourseList', { courses: list })
            .subscribe({
              next: (CourseList: any) => {
                this.subjects = JSON.parse(CourseList);
                console.log('Disciplinas recebidas:', this.subjects);
              },
              error: (error) => {
                console.error('Erro ao carregar disciplinas:', error);
              }
            });
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
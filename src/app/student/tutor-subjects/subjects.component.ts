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
  selector: 'app-student-subjects', // Seletor HTML para usar este componente
  standalone: true, // Componente standalone sem NgModule externo
  imports: [
    // Dependências necessárias no template
    CommonModule,
    MatSelectModule,
    DisciplineComponent,
  ],
  templateUrl: './subjects.component.html', // Caminho para o template HTML
  styleUrls: ['./subjects.component.scss'], // Caminho para estilos SCSS
})
export class TutorSubjectsComponent implements OnInit {
  /**
   * Lista de disciplinas carregadas do Firebase (após sincronização).
   * @type {Discipline[]}
   * @property {string} id - ID da disciplina.
   * @property {string} course - ID do curso ao qual a disciplina pertence.
   * @property {string} name - Nome da disciplina.
   * @property {string} professor - Nome do professor responsável pela disciplina.
   * @property {Number} term - Período da disciplina.
   * @property {Number} monitorAmnt - Quantidade de monitores para a disciplina.
   */
  subjects: Discipline[] = [];

  /** Indica se as disciplinas estão sendo carregadas. */
  loadingDisciplinas = true;

  /** Indica se a sincronização de disciplinas está em andamento. */
  loadingSync = true;

  /** Lista de IDs de disciplinas a serem carregadas. */
  list: Array<string> = [];
  /**
   * Construtor do componente.
   * @param http - HttpClient para requisições HTTP.
   * @param auth - Serviço de autenticação para obter o ID do usuário.
   */
  constructor(private http: HttpClient, private auth: Auth) {}

  /**
   * Hook de ciclo de vida Angular.
   * Carrega as disciplinas de um curso padrão.
   */
  ngOnInit(): void {
    this.loadSubjects();
  }

  /**
   * Carrega disciplinas via backend.
   */
  loadSubjects(): void {
    const uid = this.auth.currentUser!.uid;
    const payload = { uid: uid };
    console.log('Payload:', payload);
    this.http.post('http://localhost:3000/getTutorCourses', payload).subscribe({
      next: (tutorCourses: any) => {
        const result = JSON.parse(tutorCourses);
        console.log('Matérias recebidas:', result);
        result.forEach((course: any) => {
          if (course.aprovacao == 1) {
            this.list.push(course.disciplinaId);
          }
        });
        console.log('Lista de cursos:', this.list);
        if (this.list.length === 0) {
          console.log('Nenhuma disciplina encontrada.');
          this.loadingDisciplinas = false;
          this.loadingSync = false;
          return;
        }
        this.http
          .post('http://localhost:3000/getCourseList', { courses: this.list })
          .subscribe({
            next: (CourseList: any) => {
              this.subjects = JSON.parse(CourseList);
              console.log('Disciplinas recebidas:', this.subjects);
              this.loadingDisciplinas = false;
              this.loadingSync = false;
            },
            error: (error) => {
              console.error('Erro ao carregar disciplinas:', error);
            },
          });
      },
      error: (error) => {
        console.error('Erro ao carregar matérias:', error);
      },
    });
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

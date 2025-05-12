import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';

import { Discipline } from '../../models/discipline.model';
import { DisciplineComponent } from './discipline/discipline.component';
import { ActivatedRoute } from '@angular/router';
import { Auth, User } from '@angular/fire/auth';

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
  templateUrl: './list-subjects.component.html',// Caminho para o template HTML
  styleUrls: ['./list-subjects.component.scss'] // Caminho para estilos SCSS
})
export class ListSubjectsComponent implements OnInit {

  /** Usuário */
  user!: User;

  role = '';

  /** ID do curso */
  courseId = '';

  /** Lista de disciplinas carregadas do Firebase (após sincronização). */
  subjects: Discipline[] = [];

  /** Indica se as disciplinas estão sendo carregadas. */
  loadingDisciplinas = true;

  /** Indica se a sincronização de disciplinas está em andamento. */
  loadingSync = true;

  /** Indica se o usuário é professor. */
  professors: string[] = [];

  /**
   * Construtor do componente.
   * @param http - HttpClient para requisições HTTP.
   */
  constructor(
    private auth: Auth,
    private http: HttpClient,
    private route: ActivatedRoute,
  ) { }

  /**
   * Hook de ciclo de vida Angular.
   * Carrega as disciplinas de um curso padrão.
   */
  async ngOnInit(): Promise<void> {
    this.user = this.auth.currentUser!;
    const idTokenResult = await this.user.getIdTokenResult(true);
    const role = (idTokenResult.claims['role'] as string) ?? null;
    this.role = role;
    this.loadSubjects(role);
  }

  /**
   * Carrega disciplinas via backend.
   * @param course - Nome do curso para consulta.
   */
  loadSubjects(role: string): void {
    if (role === 'PROFESSOR') this.getProfessorSubjects();
    else this.getStudentSubjects();

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

  /**
   * Carrega as disciplinas do estudante.
   * Faz uma requisição ao backend para obter as disciplinas do estudante.
   */
  getStudentSubjects(): void {
    this.http.post('http://localhost:300/getUser', { userId: this.user.uid })
      .subscribe({
        next: (response: any) => {
          const result = JSON.parse(response.payload);
          this.courseId = result.curso;
          console.log('Curso:', this.courseId);
          this.http.post('http://localhost:3000/getDisciplinas', { curso: this.courseId })
            .subscribe({
              next: (response: any) => {
                const result = JSON.parse(response.payload);
                this.subjects = result.map((subject: any) => {
                  return {
                    id: subject.id,
                    cursoId: subject.cursoId,
                    name: subject.name,
                    professor: subject.professor,
                    term: subject.term,
                    monitorAmnt: subject.monitorAmnt
                  };
                });
                console.log('Matérias:', this.subjects);
              },
              error: (error) => {
                console.error('Erro ao carregar matérias:', error);
              }
            });
        }
      });
  }

  /**
   * Carrega as disciplinas do professor.
   * Faz uma requisição ao backend para obter as disciplinas do professor.
   */
  getProfessorSubjects(): void {
    this.http.post('http://localhost:3000/getProfessorDisciplines', { uid: this.user.uid })
      .subscribe({
        next: (response: any) => {
          const result = JSON.parse(response);
          this.courseId = result.curso;
          this.subjects = result.map((subject: any) => {
            return {
              id: subject.id,
              cursoId: subject.cursoId,
              name: subject.name,
              professor: subject.professor,
              term: subject.term,
              monitorAmnt: subject.monitorAmnt
            };
          });
        }
      })
  }
}
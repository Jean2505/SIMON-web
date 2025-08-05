import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Auth, User } from '@angular/fire/auth';
import { Discipline } from '../../models/discipline.model';
import { DisciplineComponent } from '../../shared/list-subjects/discipline/discipline.component';
import { BackButtonComponent } from "../../shared/buttons/back-button/back-button.component";

@Component({
  selector: 'app-request-tutoring',
  imports: [
    BackButtonComponent, 
    CommonModule,
    DisciplineComponent
  ],
  templateUrl: './request-tutoring.component.html',
  styleUrl: './request-tutoring.component.scss'
})
export class RequestTutoringComponent implements OnInit {

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

  /**
   * Construtor do componente.
   * @param auth - Serviço de autenticação do Firebase.
   * @param http - HttpClient para requisições HTTP.
   * @param route - ActivatedRoute para acessar parâmetros da rota.
   */
  constructor(
    /** Serviço de autenticação do Firebase @type {Auth} */
    private auth: Auth,
    /** Serviço HttpClient para requisições HTTP @type {HttpClient} */
    private http: HttpClient,
    /** Serviço de rota ativa para acessar parâmetros da rota @type {ActivatedRoute} */
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.user = this.auth.currentUser!;
    this.loadSubjects;
  }

  /**
   * Carrega disciplinas via backend.
   * @param course - Nome do curso para consulta.
   */
  loadSubjects(): void {
    this.getProfessorSubjects();
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

  getProfessorSubjects(): void {
    this.http
      .post('http://localhost:3000/getProfessorDisciplines', {
        uid: this.user.uid,
      })
      .subscribe({
        next: (response: any) => {
          const result = JSON.parse(response);
          this.courseId = result.curso;
          this.subjects = result.map((subject: any) => {
            return {
              id: subject.id,
              course: subject.course,
              name: subject.name,
              professor: subject.professor,
              term: subject.term,
              monitorAmnt: subject.monitors,
            };
          });
          this.loadingDisciplinas = false;
          this.loadingSync = false;
          console.log('Matérias do professor:', this.subjects);
        },
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { type Student } from '../../models/student.model';
import { type Discipline } from '../../models/discipline.model';
import { SessionStorageService } from '../../core/services/session-storage.service';
import { BackButtonComponent } from "../../shared/buttons/back-button/back-button.component";

/**
 * Componente de candidatura à monitoria do estudante.
 * Permite ao aluno enviar uma proposta de monitoria para uma disciplina.
 */
@Component({
  selector: 'app-student-enlist', // Seletor HTML para este componente
  standalone: true, // Componente standalone sem NgModule externo
  imports: [
    // Módulos necessários para template
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    BackButtonComponent
],
  templateUrl: './enlist.component.html', // Caminho para template HTML
  styleUrls: ['./enlist.component.scss'], // Caminho para estilos SCSS
})
export class StudentEnlistComponent implements OnInit {
  /** Nome da disciplina exibido ao carregar. */
  discipline: string = 'carregando...';

  /**
   * Objeto Student com informações do usuário autenticado.
   * @param {string} nome - Nome do aluno.
   * @param {string} uid - ID único do aluno.
   * @param {string} ra - Registro Acadêmico do aluno.
   * @param {string} curso - Curso do aluno.
   * @param {string} foto - URL da foto do aluno.
   * */
  student: Student = {
    nome: 'carregando...',
    uid: 'carregando...',
    ra: 'carregando...',
    curso: 'carregando...',
    term: 0,
    foto: '',
  };

  /** Usuário autenticado (não utilizado inicialmente). */
  user: any;

  /** Mensagem de justificativa do aluno. */
  message: string = '';

  /** Indicador de remuneração (switch). */
  isSwitchOn: boolean = false;

  /** Horário escolhido (não utilizado inicialmente). */
  time!: string;

  /** Lista de disciplinas para dropdown. */
  subjectsOptions: Discipline[] = [];

  /** Disciplina selecionada pelo aluno. */
  selectedSubject!: Discipline;

  /** Opções de carga horária disponíveis. */
  hoursOptions: number[] = [6, 12, 18];

  /** Horas selecionadas pelo aluno. */
  selectedHours!: number;

  /**
   * Construtor do componente.
   * @param http  - HttpClient para requisições HTTP.
   * @param auth  - Auth do Firebase para obter usuário atual.
   * @param route - ActivatedRoute para parâmetros de rota.
   */
  constructor(
    /** Cliente HTTP para comunicação com o backend @type {HttpClient} */
    private http: HttpClient,
    /** Serviço de autenticação do Firebase @type {Auth} */
    private auth: Auth,
    /** Roteador Angular para navegação entre páginas @type {Router} */
    private router: Router,
    /** Serviço de aquisição de dados armazenados na sessão @type {SessionStorageService} */
    private sessionService: SessionStorageService
  ) {}

  /**
   * Hook de ciclo de vida Angular.
   * Obtém parâmetro de rota e carrega dados do aluno.
   */
  ngOnInit(): void {
    this.user = this.sessionService.getAllDataFromKey('user');
    this.student = {
      nome: this.user!.nome || 'carregando...',
      uid: this.user!.uid || 'carregando...',
      ra: this.user!.ra || 'carregando...',
      curso: this.user!.curso || 'carregando...',
      term: this.user!.periodo || 0,
      foto: this.user!.foto || '',
    };
    this.loadSubjects();
  }

  /**
   * Carrega opções de disciplinas disponíveis no backend.
   */
  loadSubjects(): void {
    console.log('curso:', this.student.curso);
    this.http
      .post('http://localhost:3000/getExternalCourses', {
        course: this.student.curso,
      })
      .subscribe({
        next: (resp: any) => {
          const subjects = JSON.parse(resp);
          console.log('Matérias recebidas:', subjects);
          subjects.forEach((discipline: any) => {
            const firstOrSecondSemester = this.student.term % 2;
            if (
              discipline.term < this.student.term &&
              discipline.term % 2 === firstOrSecondSemester &&
              discipline.monitors - discipline.currentMonitors > 0
            ) {
              this.subjectsOptions.push({ ...discipline });
            }
          });
          console.log('Matérias filtradas:', this.subjectsOptions);
        },
        error: (err) => console.error('Erro em getExternalCourses:', err),
      });
  }

  /**
   * Envia candidatura à monitoria para o backend.
   * Valida campos e exibe alertas de sucesso/erro.
   */
  enlist(): void {
    if (!this.message) {
      console.error('Mensagem não pode ser vazia');
      return;
    }

    const payload = {
      aprovacao: 0,
      cargaHoraria: this.selectedHours,
      disciplina: this.selectedSubject.name,
      disciplinaId: this.selectedSubject.id,
      foto: this.student.foto,
      local: '',
      mensagem: this.message,
      nome: this.student.nome,
      ra: this.student.ra,
      remuneracao: this.isSwitchOn,
      sala: '',
      status: false,
      uid: this.student.uid,
    };

    this.http.post('http://localhost:3000/enlist', payload).subscribe({
      next: (res) => {
        console.log('Candidatura enviada com sucesso:', res);
        alert('Candidatura enviada com sucesso!');

        this.router
          .navigate(['/student/home'])
          .then((success) => {
            console.log('Navegação realizada:', success);
            console.clear();
          })
          .catch((error) => console.error('Erro na navegação:', error));
      },
      error: (err) => {
        console.error('Erro ao enviar candidatura:', err);
        alert('Erro ao enviar candidatura. Tente novamente mais tarde.');
      },
    });
  }
}

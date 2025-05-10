import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { Student } from '../../models/student.model';
import { Discipline } from '../../models/discipline.model';

/**
 * Componente de candidatura à monitoria do estudante.
 * Permite ao aluno enviar uma proposta de monitoria para uma disciplina.
 */
@Component({
  selector: 'app-student-enlist',               // Seletor HTML para este componente
  standalone: true,                            // Componente standalone sem NgModule externo
  imports: [                                   // Módulos necessários para template
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './enlist.component.html',       // Caminho para template HTML
  styleUrls: ['./enlist.component.scss']        // Caminho para estilos SCSS
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
    foto: ''
  };

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
    private http: HttpClient,
    private auth: Auth,
    private router: Router
  ) { }

  /**
   * Hook de ciclo de vida Angular.
   * Obtém parâmetro de rota e carrega dados do aluno.
   */
  ngOnInit(): void {
    this.getStudent();
  }

  /**
   * Obtém dados do estudante autenticado no backend.
   * Atualiza `student` e chama `loadSubjects`.
   */
  getStudent(): void {
    const uid = this.auth.currentUser?.uid;
    console.log('UID do aluno:', uid);
    this.http.post('http://localhost:3000/getStudent', { uid })
      .subscribe({
        next: (response: any) => {
          const result = JSON.parse(response.payload);
          console.log('Aluno recebido:', result);
          this.student = {
            nome: result.nome,
            uid: result.uid,
            ra: result.ra,
            curso: result.curso,
            foto: result.photo
          };
          this.loadSubjects();
        },
        error: err => console.error('Erro em getStudent:', err)
      });
  }

  /**
   * Carrega opções de disciplinas disponíveis no backend.
   */
  loadSubjects(): void {
    console.log('curso:', this.student.curso);
    this.http.post('http://localhost:3000/getExternalCourses', { course: this.student.curso })
      .subscribe({
        next: (resp: any) => {
          this.subjectsOptions = JSON.parse(resp);
          console.log('Matérias recebidas:', this.subjectsOptions);
        },
        error: err => console.error('Erro em getExternalCourses:', err)
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
      uid: this.student.uid
    };

    this.http.post('http://localhost:3000/enlist', payload)
      .subscribe({
        next: res => {
          console.log('Candidatura enviada com sucesso:', res);
          alert('Candidatura enviada com sucesso!');

          this.router.navigate(['/student/home'])
            .then(success => {
              console.log('Navegação realizada:', success);
              console.clear();
            })
            .catch(error => console.error('Erro na navegação:', error));
        },
        error: err => {
          console.error('Erro ao enviar candidatura:', err);
          alert('Erro ao enviar candidatura. Tente novamente mais tarde.');
        }
      });
  }
}
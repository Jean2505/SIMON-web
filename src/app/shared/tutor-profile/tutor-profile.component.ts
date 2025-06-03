// --------------------------- IMPORTS ---------------------------

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { type Tutor } from '../../models/tutor.model';

import { SessionStorageService } from '../../core/services/session-storage.service';
import { TutorSubjectComponent } from './subject/subject.component';

// --------------------------- COMPONENTE ---------------------------

@Component({
  selector: 'app-tutor-profile',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatSlideToggleModule,
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    FormsModule,
    TutorSubjectComponent
  ],
  templateUrl: './tutor-profile.component.html',
  styleUrl: './tutor-profile.component.scss',
})
export class TutorProfileComponent implements OnInit {
  /** Se é monitor ou não */
  isTutor: boolean = false;

  /** Lista de matérias monitoradas */
  subjects: Tutor[] = [];

  /** Nome do monitor da matéria */
  userName!: string;
  /** Email do monitor da matéria */
  userEmail!: string;
  /** Foto do monitor da matéria */
  userPhoto: string = '/gosling.jpg';
  /** ID do monitor da matéria */
  uid!: string;

  /** Controle de edição do perfil */
  isEditingProfile = false;
  /** Controle de edição de matéria */
  isEditingSubject = false;

  /** Controle de tutoria da disciplina */
  isTutoring!: string;

  /** Dias da semana e horários */
  days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  /** Colunas da tabela */
  displayedColumns: string[] = [...this.days];

  /** Horários de 08:00 até 22:00 */
  times: number[] = Array.from({ length: 15 }, (_, i) => 8 + i);

  /** Registro de seleção por disciplina */
  selection: Record<string, Record<number, Record<number, boolean>>> = {};

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private sessionStorage: SessionStorageService
  ) {}

  /** Inicializa o componente */
  async ngOnInit(): Promise<void> {
    if (this.route.snapshot.url[0]?.path === 'tutor-profile') {
      this.isTutor = true;
      this.managingProfile();
    } else {
      this.isTutor = false;
      this.viewingProfile();
    }

    const request = { uid: this.uid };
    this.http.post('http://localhost:3000/getTutorCourses', request).subscribe({
      next: (response: any) => {
        this.subjects = JSON.parse(response);

        this.subjects.forEach((subject) => {
          this.inicializarSelecao(subject.disciplinaId);
          if (subject.status) this.isTutoring = subject.disciplinaId;
          if (subject.horarioDisponivel) {
            this.preencherSelecao(
              subject.disciplinaId,
              subject.horarioDisponivel
            );
          }
        });
      },
      error: (error) => {
        console.error('Erro ao carregar perfil:', error);
      },
    });
  }

  /** Inicializa a matriz de seleção de uma disciplina */
  inicializarSelecao(disciplinaId: string): void {
    this.selection[disciplinaId] = {};
    this.days.forEach((_, dayIdx) => {
      this.selection[disciplinaId][dayIdx] = {};
      this.times.forEach((t) => {
        this.selection[disciplinaId][dayIdx][t] = false;
      });
    });
  }

  /**
   * Preenche a seleção da disciplina com os dados do backend
   * @param disciplinaId ID da disciplina
   * @param disponibilidade Array no formato [{ day: string, time: number[] }]
   */
  preencherSelecao(
    disciplinaId: string,
    disponibilidade: { day: string; time: number[] }[]
  ): void {
    if (!this.selection[disciplinaId]) {
      this.inicializarSelecao(disciplinaId);
    }

    disponibilidade.forEach((item) => {
      const dayIndex = this.days.indexOf(item.day);
      if (dayIndex !== -1) {
        item.time.forEach((hora) => {
          this.selection[disciplinaId][dayIndex][hora] = true;
        });
      }
    });
  }

  /** Carrega os dados do usuário autenticado */
  managingProfile(): void {
    this.uid = this.sessionStorage.getData('user', 'uid');
    this.userEmail = this.sessionStorage.getData('user', 'email');
    this.userName = this.sessionStorage.getData('user', 'nome');
    this.userPhoto =
      this.sessionStorage.getData('user', 'foto') || '/gosling.jpg';
  }

  /** Visualiza o perfil de outro usuário (aluno) */
  viewingProfile(): void {
    this.uid = this.route.snapshot.params['id'];
    const uid = this.uid;
    this.isTutor = false;

    this.http.post('http://localhost:3000/getStudent', { uid }).subscribe({
      next: (response: any) => {
        const student = JSON.parse(response.payload);
        this.userName = student.nome;
        this.userEmail = student.email!;
        this.userPhoto = student.foto || '/gosling.jpg';
      },
      error: (error) => {
        console.error('Erro ao carregar perfil:', error);
      },
    });
  }

  /** Alterna modo de edição do perfil */
  onEditProfile() {
    this.isEditingProfile = !this.isEditingProfile;
  }

  /** Salva dados do perfil */
  onSaveProfile() {
    this.isEditingProfile = false;
    const oldUserName = this.userName;
    const oldUserEmail = this.userEmail;
    const oldUserPhoto = this.userPhoto;
    let update = {};
    if (oldUserName != this.userName)
      update = { ...update, nome: this.userName };
    if (oldUserEmail != this.userEmail)
      update = { ...update, email: this.userEmail };
    if (oldUserPhoto != this.userPhoto)
      update = { ...update, foto: this.userPhoto };
    const request = {
      uid: this.uid,
      updates: update,
    };

    if (Object.keys(update).length > 0) {
      this.http.post('http://localhost:3000/updateUser', request).subscribe({
        next: (response) => {
          console.log('Dados do perfil atualizados!', response);
        },
        error: (error) => {
          console.error('Erro ao atualizar perfil:', error);
        },
      });

      // Atualizar sessionStorage local
      this.sessionStorage.setData('user', {
        ...this.sessionStorage.getAllDataFromKey('user'),
        ...update,
      });

      window.location.reload();
    }
  }

  private updateTutor(request: any): void {
    this.http.post('http://localhost:3000/updateTutor', request).subscribe({
      next: (response) => {
        console.log('Dados do tutor atualizados!', response);
      },
      error: (error) => {
        console.error('Erro ao atualizar dados do tutor:', error);
      },
    });
  }

  onUpdateTutoring(disciplinaId: string): void {

    let request: any;

    const oldDisciplinaId = this.isTutoring;
    if (oldDisciplinaId === disciplinaId) {
      this.isTutoring = '';
      request = {
        uid: this.uid,
        updates: {
          disciplinaId: '',
        },
      };
    } else {
      this.isTutoring = disciplinaId;
      request = {
        uid: this.uid,
        updates: {
          disciplinaId: disciplinaId,
        },
      };
    }

    this.updateTutor(request);
  }
}

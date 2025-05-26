// --------------------------- IMPORTS ---------------------------

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { type Tutor } from '../../models/tutor.model';

import { HttpClient } from '@angular/common/http';
import { SessionStorageService } from '../../core/services/session-storage.service';
import { ActivatedRoute } from '@angular/router';

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
  ],
  templateUrl: './tutor-profile.component.html',
  styleUrl: './tutor-profile.component.scss',
})
export class TutorProfileComponent implements OnInit {
  /** Se é tutor ou não */
  isTutor: boolean = false;

  /** Lista de matérias monitoradas */
  subjects: Tutor[] = [];

  /** Nome do usuário logado */
  userName!: string;
  /** Email do usuário logado */
  userEmail!: string;
  /** Foto do usuário logado */
  userPhoto: string = '/gosling.jpg';
  /** ID do usuário logado */
  uid!: string;

  /** Controle de edição do perfil */
  isEditingProfile = false;
  /** Controle de edição de matéria */
  isEditingSubject = false;

  /** Controle de tutoria por disciplina */
  isTutoring: Record<string, boolean> = {};

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
          this.isTutoring[subject.disciplinaId] = subject.status;
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

  /** Alterna o estado de um slot */
  toggleSlot(disciplinaId: string, dayIdx: number, time: number) {
    this.selection[disciplinaId][dayIdx][time] =
      !this.selection[disciplinaId][dayIdx][time];
  }

  /**
   * Retorna a disponibilidade agrupada por dia de uma disciplina.
   * @param disciplinaId ID da disciplina
   * @returns Array de objetos no formato { day: string, time: number[] }
   */
  getSelected(disciplinaId: string): { day: string; time: number[] }[] {
    const grouped: { [key: string]: number[] } = {};

    this.days.forEach((day, d) => {
      this.times.forEach((t) => {
        if (this.selection[disciplinaId][d][t]) {
          if (!grouped[day]) {
            grouped[day] = [];
          }
          grouped[day].push(t);
        }
      });
    });

    const result = Object.keys(grouped).map((day) => ({
      day,
      time: grouped[day],
    }));

    return result;
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
      update: update,
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
        ...this.sessionStorage.getAllData('user'),
        ...update,
      });

      window.location.reload();
    }
  }

  /** Alterna modo de edição de matéria */
  onEditSubject() {
    this.isEditingSubject = !this.isEditingSubject;
  }

  /**
   * Altera o estado de tutoria, e tira o estado de monitoria das outras disciplinas
   * @param disciplinaId ID da disciplina
   */
  onToggleTutoring(disciplinaId: string) {
    const newState = !this.isTutoring[disciplinaId];
    // Desativa todas
    Object.keys(this.isTutoring).forEach((key) => {
      this.isTutoring[key] = false;
    });

    const tutorRequest = {
      uid: this.uid,
      disciplinaId: disciplinaId,
      updates: {
        status: newState,
      },
    };

    const userRequest = {
      uid: this.uid,
      updates: {
        status: newState ? disciplinaId : '',
      },
    }

    this.http.post('http://localhost:3000/updateTutor', tutorRequest).subscribe({
      next: (response) => {
        console.log('Estado de tutoria atualizado!', response);
      },
      error: (error) => { 
        console.error('Erro ao atualizar estado de tutoria:', error);
      }
    });

    this.http.post('http://localhost:3000/updateUser', userRequest).subscribe({
      next: (response) => {
        console.log('Estado de monitoria atualizado!', response);
      },
      error: (error) => {
        console.error('Erro ao atualizar estado de monitoria:', error);
      }
    });

    // Ativa a selecionada (ou desativa se já estava ativa)
    this.isTutoring[disciplinaId] = newState;
  }

  /**
   * Salva a disponibilidade de uma disciplina
   * @param disciplinaId ID da disciplina
   */
  onSaveSubject(disciplinaId: string) {
    this.isEditingSubject = false;
    const horarioDisponivel = this.getSelected(disciplinaId);

    const request = {
      uid: this.uid,
      updates: {
        horarioDisponivel: horarioDisponivel,
      },
    };

    console.log('Requisição:', request);

    this.http.post('http://localhost:3000/updateTutor', request).subscribe({
      next: (response) => {
        console.log('Disponibilidade salva!', response);
        this.isEditingSubject = false;
      },
      error: (error) => {
        console.error('Erro ao salvar disponibilidade:', error);
      },
    });
  }

  /**
   * Formata o horário para exibição
   * @param hour Hora a ser formatada
   * @returns String formatada no formato HH:MM
   */
  formatTime(hour: number): string {
    return `${hour.toString().padStart(2, '0')}:00`;
  }

  /**
   * Verifica se há algum slot marcado para um dia específico e uma disciplina
   * @param dayIndex Índice do dia (0: Seg, 1: Ter, ..., 5: Sáb)
   * @param subject ID da disciplina
   * @returns Verdadeiro se houver pelo menos um slot marcado, falso caso contrário
   */
  hasCheckedSlot(dayIndex: number, subject: string): boolean {
    const daySelection = this.selection[subject]?.[dayIndex];

    if (!daySelection) return false;

    return Object.values(daySelection).some((isChecked) => isChecked);
  }
}

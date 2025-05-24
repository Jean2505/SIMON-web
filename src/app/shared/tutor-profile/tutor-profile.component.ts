// --------------------------- IMPORTS ---------------------------

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule, Location } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { type Tutor } from '../../models/tutor.model';
import { type Student } from '../../models/student.model';

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

  /** Dados do usuário logado */
  userName!: string;
  userEmail!: string;
  userPhoto: string = '/gosling.jpg';
  uid!: string;

  /** Controle de edição */
  isEditingProfile = false;
  isEditingSubject = false;

  /** Disponibilidade do tutor */
  isTutoring = false;

  /** Dias da semana e horários */
  days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  displayedColumns: string[] = ['time', ...this.days];

  /** Horários de 08:00 até 22:00 */
  times: string[] = Array.from({ length: 15 }).map((_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  /** Registro de seleção */
  selection: Record<number, Record<string, boolean>> = {};

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private sessionStorage: SessionStorageService,
  ) {}

  /** Inicializa o componente */
  async ngOnInit(): Promise<void> {
    this.inicializarSelecao();

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
      },
      error: (error) => {
        console.error('Erro ao carregar perfil:', error);
      },
    });
  }

  /** Inicializa a matriz de seleção */
  inicializarSelecao(): void {
    this.days.forEach((_, dayIdx) => {
      this.selection[dayIdx] = {};
      this.times.forEach((t) => (this.selection[dayIdx][t] = false));
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
    console.log('ID do aluno:', this.uid);

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
  toggleSlot(dayIdx: number, time: string) {
    this.selection[dayIdx][time] = !this.selection[dayIdx][time];
  }

  /**
   * Obtém os slots selecionados
   * @returns Lista de dias e horários selecionados
   */
  getSelected(): { day: string; time: string }[] {
    const result: { day: string; time: string }[] = [];
    this.days.forEach((day, d) => {
      this.times.forEach((t) => {
        if (this.selection[d][t]) {
          result.push({ day, time: t });
        }
      });
    });
    return result;
  }

  /**
   * Verifica se há algum horário marcado em um dia
   * @param dayIndex Índice do dia
   * @returns boolean
   */
  hasCheckedSlot(dayIndex: number): boolean {
    const daySelection = this.selection[dayIndex];
    return Object.values(daySelection || {}).some((val) => val);
  }

  /** Alterna disponibilidade */
  onToggle(toggle: boolean) {
    this.isTutoring = !toggle;
  }

  /** Alterna modo de edição do perfil */
  onEditProfile() {
    this.isEditingProfile = !this.isEditingProfile;
  }

  /** Salva dados do perfil */
  onSaveProfile() {
    this.isEditingProfile = false;
    let update = {};
    if (this.userName) update = { ...update, nome: this.userName };
    if (this.userEmail) update = { ...update, email: this.userEmail };
    if (this.userPhoto) update = { ...update, foto: this.userPhoto };
    const request = {
      uid: this.uid,
      update: update,
    };

    this.http
      .post('http://localhost:3000/updateUser', request)
      .subscribe({
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
      uid: this.uid,
      ...update,
    });

    window.location.reload();
  }

  /** Alterna modo de edição de matéria */
  onEditSubject() {
    this.isEditingSubject = !this.isEditingSubject;
  }

  /**
   * Salva a disponibilidade de uma disciplina
   * @param disciplineId ID da disciplina
   */
  onSaveSubject(disciplineId: string) {
    const disponibilidade = this.getSelected();

    const request = {
      uid: this.uid,
      disciplinaId: disciplineId,
      updates: {
        disponibilidade: disponibilidade,
      },
    };

    this.http
      .post('http://localhost:3000/saveDisponibilidade', request)
      .subscribe({
        next: (response) => {
          console.log('Disponibilidade salva!', response);
          this.isEditingSubject = false;
        },
        error: (error) => {
          console.error('Erro ao salvar disponibilidade:', error);
        },
      });
  }
}

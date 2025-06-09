// --------------------------- IMPORTS ---------------------------

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClient } from '@angular/common/http';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';

import { type Tutor } from '../../models/tutor.model';

import { SessionStorageService } from '../../core/services/session-storage.service';
import { BackButtonComponent } from '../buttons/back-button/back-button.component';
import { TutorSubjectComponent } from './subject/subject.component';
import { waitForPendingWrites } from 'firebase/firestore';

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
    BackButtonComponent,
    TutorSubjectComponent,
  ],
  templateUrl: './tutor-profile.component.html',
  styleUrl: './tutor-profile.component.scss',
})
export class TutorProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  /** Se é monitor ou não */
  isTutor: boolean = false;

  /** Lista de matérias monitoradas */
  subjects: Tutor[] = [];
  /** Lista de matérias pendentes */
  pendingSubjects: Tutor[] = [];

  /** Nome do monitor da matéria */
  userName!: string;
  /** Email do monitor da matéria */
  userEmail!: string;
  /** Foto do monitor da matéria */
  userPhoto: string = '/simons.png';
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
    /** Referência ao serviço de armazenamento do Firebase @type {Storage} */
    private storage: Storage,
    /** Referência ao serviço de requisições HTTP @type {HttpClient} */
    private http: HttpClient,
    /** Referência ao serviço de rotas @type {ActivatedRoute} */
    private route: ActivatedRoute,
    /** Referência ao serviço de armazenamento de sessão @type {SessionStorageService} */
    private sessionStorage: SessionStorageService
  ) {}

  /**
   * Inicializa o componente
   * Carrega o perfil do usuário, verifica se é tutor ou aluno, e busca as disciplinas monitoradas.
   * @returns {Promise<void>} Promise que indica a conclusão da inicialização
   */
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
        const result = JSON.parse(response);

        const approvedSubjects = result.filter(
          (subject: Tutor) => subject.aprovacao === 1
        );
        const pendingSubjects = result.filter(
          (subject: Tutor) => subject.aprovacao === 0
        );
        console.log('Disciplinas aprovadas:', approvedSubjects);
        console.log('Disciplinas pendentes:', pendingSubjects);

        this.subjects = approvedSubjects.map((subject: Tutor) => {
          this.inicializarSelecao(subject.disciplinaId);
          if (subject.horarioDisponivel) {
            this.preencherSelecao(
              subject.disciplinaId,
              subject.horarioDisponivel
            );
          }
          return {
            ...subject,
          };
        });
        this.pendingSubjects = pendingSubjects;
      },
      error: (error) => {
        console.error('Erro ao carregar perfil:', error);
      },
    });
  }

  updateSubjects(): void {
    this.subjects.map((subject) => {
      subject.status = this.isTutoring === subject.disciplinaId;
      return subject;
    });
  }

  /**
   * Inicializa a matriz de seleção de uma disciplina
   * @param disciplinaId ID da disciplina
   * @returns {void}
   */
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
   * @returns {void}
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

  /**
   * Carrega os dados do usuário autenticado
   * @returns {void}
   */
  managingProfile(): void {
    this.uid = this.sessionStorage.getData('user', 'uid');
    this.userEmail = this.sessionStorage.getData('user', 'email');
    this.userName = this.sessionStorage.getData('user', 'nome');
    this.userPhoto =
      this.sessionStorage.getData('user', 'foto') || '/simons.png';
    this.isTutoring = this.sessionStorage.getData('user', 'status') || '';
  }

  /**
   * Visualiza o perfil de outro usuário (aluno)
   * @returns {void}
   */
  viewingProfile(): void {
    this.uid = this.route.snapshot.params['id'];
    const uid = this.uid;
    this.isTutor = false;

    this.http.post('http://localhost:3000/getStudent', { uid }).subscribe({
      next: (response: any) => {
        const student = JSON.parse(response.payload);
        console.log(student.status);
        this.isTutoring = student.status;
        this.userName = student.nome;
        this.userEmail = student.email!;
        this.userPhoto = student.foto || '/simons.jpg';
      },
      error: (error) => {
        console.error('Erro ao carregar perfil:', error);
      },
    });
  }

  /**
   * Ação ao selecionar uma imagem para o perfil
   * @param event Evento de input do tipo file
   */
  onChangePhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Preview imediato da imagem
    const reader = new FileReader();
    reader.onload = () => {
      this.userPhoto = reader.result as string;
    };
    reader.readAsDataURL(file);

    // Caminho de upload no Firebase
    const path = `avatars/${this.uid}_${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, path);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      'state_changed',
      (snapshot) => {
        // Aqui você pode exibir progresso se quiser
      },
      (error) => {
        console.error('Erro no upload da imagem:', error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(storageRef);

          // Atualizar imagem no backend
          const request = {
            uid: this.uid,
            updates: { foto: downloadURL },
          };

          this.updateUser(request);

          // Atualizar visualmente e localmente
          this.userPhoto = downloadURL;
          this.sessionStorage.setData('user', {
            ...this.sessionStorage.getAllDataFromKey('user'),
            foto: downloadURL,
          });

          console.log('Foto atualizada com sucesso!');
        } catch (err) {
          console.error('Erro ao obter URL da imagem:', err);
        }
      }
    );
  }

  /** Alterna modo de edição do perfil */
  onEditProfile() {
    this.isEditingProfile = !this.isEditingProfile;
  }

  /** Salva dados do perfil */
  onSaveProfile() {
    this.isEditingProfile = false;

    const request = {
      uid: this.uid,
      updates: {
        nome: this.userName,
        email: this.userEmail,
      },
    };

    this.updateUser(request);
  }

  /**
   * Atualiza os dados do usuário
   * @param request Objeto de requisição para atualizar os dados do usuário
   */
  private updateUser(request: any): void {
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
      ...request.updates,
    });

    window.location.reload();
  }

  /**
   * Atualiza os dados do monitor
   * @param request Objeto de requisição para atualizar os dados do monitor
   */
  private updateTutor(request: any): void {
    this.http.post('http://localhost:3000/updateTutor', request).subscribe({
      next: (response) => {
        console.log('Dados do monitor atualizados!', response);
      },
      error: (error) => {
        console.error('Erro ao atualizar dados do monitor:', error);
      },
    });
  }

  /**
   * Atualiza a disponibilidade de horários do tutor
   * @param disciplinaId ID da disciplina
   * @returns {void}
   */
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

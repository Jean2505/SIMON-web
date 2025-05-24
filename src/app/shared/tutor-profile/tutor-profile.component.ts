// --------------------------- IMPORTS ---------------------------

/** Importações essenciais do Angular e Angular Material */
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule, Location } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

/** Importação dos modelos utilizados */
import { type Tutor } from '../../models/tutor.model';
import { type Student } from '../../models/student.model';

/** Serviços HTTP, Roteamento e Sessão */
import { HttpClient } from '@angular/common/http';
import { SessionStorageService } from '../../core/services/session-storage.service';
import { ActivatedRoute } from '@angular/router';

// --------------------------- COMPONENTE ---------------------------

/**
 * Componente responsável por exibir e gerenciar o perfil do tutor.
 */
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
  // --------------------------- VARIÁVEIS ---------------------------

  /** Define se o usuário atual é um tutor */
  isTutor: boolean = false;

  /** Lista de disciplinas que o tutor ministra */
  subjects: Tutor[] = [];

  /** Nome do usuário */
  userName!: string;
  /** Email do usuário */
  userEmail!: string;
  /** Foto do usuário */
  userPhoto: string = '/gosling.jpg'; // Foto padrão

  /** ID do usuário */
  uid!: string;

  /** Dados auxiliares para controle de dias e horários */
  dias!: string;
  horario!: string;

  /** Controle dos modos de edição */
  isEditingProfile = false;
  isEditingSubject = false;

  /** Define se o tutor está disponível para atendimento */
  isTutoring = false;

  /** Dias da semana para exibição na tabela */
  days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  /** Colunas exibidas na tabela */
  displayedColumns: string[] = ['time', ...this.days];

  /** Lista de horários de 08h às 22h */
  times: string[] = Array.from({ length: 22 - 8 + 1 }).map((_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  /** Registro de seleção de dias e horários */
  selection: Record<number, Record<string, boolean>> = {};

  // --------------------------- CONSTRUTOR ---------------------------

  /**
   * Inicializa os serviços necessários.
   * @param http Serviço HTTP para requisições
   * @param route Serviço de rota para obter parâmetros
   * @param sessionStorage Serviço de armazenamento de sessão
   * @param location Serviço de controle de navegação
   */
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private sessionStorage: SessionStorageService,
    private location: Location
  ) {}

  // --------------------------- MÉTODOS DO CICLO DE VIDA ---------------------------

  /**
   * Executado na inicialização do componente.
   * Define o perfil, inicializa seleção de horários e carrega dados.
   */
  async ngOnInit(): Promise<void> {
    this.days.forEach((_, dayIdx) => {
      this.selection[dayIdx] = {};
      this.times.forEach((t) => (this.selection[dayIdx][t] = false));
    });

    if (this.route.snapshot.url[0].path === 'tutor-profile') {
      this.isTutor = true;
      this.managingProfile();
    } else {
      this.isTutor = false;
      this.managingProfile();
    }

    console.log('É monitor:', this.isTutor);

    const request = { uid: this.uid };
    this.http.post('http://localhost:3000/getTutorCourses', request).subscribe({
      next: (response: any) => {
        this.subjects = JSON.parse(response);
        console.log('Perfil do monitor:', this.subjects);
      },
      error: (error) => {
        console.error('Erro ao carregar o perfil do monitor:', error);
      },
    });
  }

  // --------------------------- MÉTODOS DE PERFIL ---------------------------

  /**
   * Carrega os dados do próprio perfil do tutor (autenticado).
   */
  managingProfile(): void {
    this.uid = this.sessionStorage.getData('user', 'uid');
    this.userEmail = this.sessionStorage.getData('user', 'email');
    this.userName = this.sessionStorage.getData('user', 'nome');
    this.userPhoto = this.sessionStorage.getData('user', 'foto')
      ? this.sessionStorage.getData('user', 'foto')
      : '/gosling.jpg';
    console.log(this.userPhoto);
  }

  /**
   * Visualiza o perfil de um tutor específico através do ID passado na rota.
   */
  viewingProfile(): void {
    this.uid = this.route.snapshot.params['id'];
    let uid = this.uid;
    console.log('Monitor:', uid);

    this.isTutor = false;
    this.http.post('http://localhost:3000/getStudent', { uid }).subscribe({
      next: (response: any) => {
        const student = JSON.parse(response);
        this.userName = student.nome;
        this.userEmail = student.email!;
        this.userPhoto = student.foto ? student.foto : '/gosling.jpg';
      },
      error: (error) => {
        console.error('Erro ao carregar o perfil do aluno:', error);
      },
    });
  }

  // --------------------------- MÉTODOS DE DISPONIBILIDADE ---------------------------

  /**
   * Alterna a seleção de um slot (dia e horário).
   * @param dayIdx Índice do dia na lista days
   * @param time Horário no formato 'HH:mm'
   */
  toggleSlot(dayIdx: number, time: string) {
    this.selection[dayIdx][time] = !this.selection[dayIdx][time];
  }

  /**
   * Obtém todos os horários selecionados pelo tutor.
   * @returns Lista de objetos contendo dia e horário
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
   * Apenas retorna a entrada recebida (auxiliar para depuração).
   * @param input Lista de seleção de dias e horários
   * @returns Retorna a própria entrada
   */
  verSelecionados(input: { day: string; time: string }[]): any {
    return input;
  }

  /**
   * Alterna o estado de disponibilidade do tutor.
   * @param toggle Estado atual do botão toggle
   */
  onToggle(toggle: boolean) {
    this.isTutoring = !toggle;
  }

  // --------------------------- MÉTODOS DE EDIÇÃO ---------------------------

  /** Alterna modo de edição do perfil */
  onEditProfile() {
    this.isEditingProfile = !this.isEditingProfile;
  }

  /**
   * Salva as alterações do perfil.
   * Atualiza o sessionStorage e recarrega a página.
   */
  onSaveProfile() {
    this.isEditingProfile = !this.isEditingProfile;

    const request = {
      uid: this.uid,
      nome: this.userName,
      email: this.userEmail,
      foto: this.userPhoto,
    };

    // Código comentado para futuras atualizações no backend:
    // this.http.post('http://localhost:3000/updateUser', request).subscribe(...)

    this.sessionStorage.setData('user', {
      ...this.sessionStorage.getAllData('user'),
      uid: this.uid,
      nome: this.userName,
      email: this.userEmail,
      foto: this.userPhoto,
    });

    window.location.reload();
  }

  /** Alterna modo de edição das matérias */
  onEditSubject() {
    this.isEditingSubject = !this.isEditingSubject;
  }

  /** Salva alterações nas matérias */
  onSaveSubject(disciplineId: string) {
    this.isEditingSubject = !this.isEditingSubject;
    const request = {
      uid: this.uid,
      disciplinaId: disciplineId,
      updates: {
        dias: this.dias,
        horario: this.horario,
      }
    };
  }
}

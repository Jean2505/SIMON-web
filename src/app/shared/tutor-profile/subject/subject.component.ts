import { Component, Input, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClient } from '@angular/common/http';

import { type Tutor } from '../../../models/tutor.model';

import { SessionStorageService } from '../../../core/services/session-storage.service';
import { TutorProfileComponent } from '../tutor-profile.component';
import { TutorLocationComponent } from '../tutor-location/tutor-location.component';

@Component({
  selector: 'app-tutor-subject',
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatTableModule,
    MatCheckboxModule,
    TutorLocationComponent
  ],
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss', '.././tutor-profile.component.scss'],
})
export class TutorSubjectComponent implements OnInit {
  /**
   * Matéria do monitor
   * @type {Tutor}
   */
  @Input() subject!: Tutor;
  /**
   * Indica se o aluno é um monitor
   * @type {boolean}
   */
  @Input() isTutor!: boolean;
  /**
   * ID do usuário
   * @type {string}
   */
  @Input() uid!: string;

  /**
   * Dias da semana e horários
   * @type {string[]}
   */
  days: string[] = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  /**
   * Colunas da tabela
   * @type {string[]}
   */
  displayedColumns: string[] = [...this.days];

  /**
   * Horários de 08:00 até 22:00
   * @type {number[]}
   */
  times: number[] = Array.from({ length: 15 }, (_, i) => 8 + i);

  /**
   * Controle de edição de matéria
   * @type {boolean}
   * @default false
   */
  isEditingSubject: boolean = false;

  /**
   * Controle de edição de localização
   * @type {boolean}
   * @default false
   */
  isMapOpen: boolean = false;

  /**
   * Controle de status de monitoria
   * @type {boolean}
   * @default false
   */
  @Input() isTutoring!: boolean;

  /**
   * Registro de seleção por disciplina
   * @type {Record<number, Record<number, boolean>>}
   */
  selection: Record<number, Record<number, boolean>> = {};

  constructor(
    /** HttpClient para requisições HTTP @type {HttpClient} */
    private http: HttpClient,
    /** Serviço de armazenamento de sessão @type {SessionStorageService} */
    private sessionStorage: SessionStorageService,
    /** Componente pai de perfil de tutor @type {TutorProfileComponent} */
    private tutorProfileComponent: TutorProfileComponent
  ) { }

  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.isMapOpen) {
      this.isMapOpen = false;
    }
  }

  /** Alterna modo de edição de matéria */
  onEditSubject(): void {
    this.isEditingSubject = !this.isEditingSubject;
  }

  ngOnInit(): void {
    this.inicializarSelecao();
    if (this.subject.horarioDisponivel) {
      this.preencherSelecao(this.subject.horarioDisponivel);
    }
    console.log(this.subject.disciplinaId, '-', this.isTutoring);
  }

  /**
   * Inicializa a matriz de seleção de uma disciplina
   * @returns void
   */
  inicializarSelecao(): void {
    this.selection = {};
    this.days.forEach((_, dayIdx) => {
      this.selection[dayIdx] = {};
      this.times.forEach((t) => {
        this.selection[dayIdx][t] = false;
      });
    });
  }

  /**
   * Preenche a seleção da disciplina com os dados do backend
   * @param disciplinaId ID da disciplina
   * @param disponibilidade Array no formato [{ day: string, time: number[] }]
   * @returns void
   */
  preencherSelecao(disponibilidade: { day: string; time: number[] }[]): void {
    if (!this.selection) {
      this.inicializarSelecao();
    }

    disponibilidade.forEach((item) => {
      const dayIndex = this.days.indexOf(item.day);
      if (dayIndex !== -1) {
        item.time.forEach((hora) => {
          this.selection[dayIndex][hora] = true;
        });
      }
    });
  }

  /**
   * Alterna o estado de um slot
   * @param {number} dayIdx Índice do dia (0-6)
   * @param {number} time Horário (8-22)
   * @returns {void}
   */
  toggleSlot(dayIdx: number, time: number): void {
    this.selection[dayIdx][time] = !this.selection[dayIdx][time];
  }

  /**
   * Retorna a disponibilidade agrupada por dia de uma disciplina.
   * @returns Array de objetos no formato { day: string, time: number[] }
   */
  getSelected(): { day: string; time: number[] }[] {
    const grouped: { [key: string]: number[] } = {};

    this.days.forEach((day, d) => {
      this.times.forEach((t) => {
        if (this.selection[d][t]) {
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

  closeMap(): void {
    this.isMapOpen = false;
  }

  onEditLocation(): void {
    this.isMapOpen = true;
  }

  onViewLocation(): void {
    this.isMapOpen = true;
  }

  /**
   * Salva a disponibilidade de uma disciplina
   * @returns void
   */
  onSaveSubject(): void {
    this.isEditingSubject = false;
    const horarioDisponivel = this.getSelected();

    const request = {
      uid: this.uid,
      disciplinaId: this.subject.disciplinaId,
      updates: {
        local: this.subject.local,
        sala: this.subject.sala,
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
   * @param dayIndex Índice do dia (0: Seg, 1: Ter, 2: Qua, 3: Qui, 4: Sex, 5: Sáb)
   * @param subject ID da disciplina
   * @returns Verdadeiro se houver pelo menos um slot marcado, falso caso contrário
   */
  hasCheckedSlot(dayIndex: number): boolean {
    const daySelection = this.selection[dayIndex];

    if (!daySelection) return false;

    return Object.values(daySelection).some((isChecked) => isChecked);
  }

  /**
   * Altera o estado de tutoria, e tira o estado de monitoria das outras disciplinas
   * @param disciplinaId ID da disciplina
   */
  onToggleTutoring() {
    const newState = !this.isTutoring;

    // const tutorRequest = {
    //   uid: this.uid,
    //   disciplinaId: this.subject.disciplinaId,
    //   updates: {
    //     status: newState,
    //   },
    // };

    const userRequest = {
      uid: this.uid,
      updates: {
        status: newState ? this.subject.disciplinaId : '',
      },
    };

    // this.http.post('http://localhost:3000/updateTutor', tutorRequest).subscribe({
    //   next: (response) => {
    //     console.log('Estado de tutoria atualizado!', response);
    //   },
    //   error: (error) => {
    //     console.error('Erro ao atualizar estado de tutoria:', error);
    //   }
    // });

    this.http.post('http://localhost:3000/updateUser', userRequest).subscribe({
      next: (response) => {
        console.log('Estado de monitoria atualizado!', response);
        // Atualiza o usuário da sessão
        this.sessionStorage.setData('user', {
          ...this.sessionStorage.getAllDataFromKey('user'),
          status: newState ? this.subject.disciplinaId : '',
        });
        console.log(
          'Atualizando usuário na sessão:',
          this.sessionStorage.getAllData()
        );

        // Atualiza o estado de monitoria no componente pai
        window.location.reload();
      },
      error: (error) => {
        console.error('Erro ao atualizar estado de monitoria:', error);
      },
    });

    // Ativa a selecionada (ou desativa se já estava ativa)
    this.isTutoring = newState;
  }
}

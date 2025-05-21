import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { type Tutor } from '../../models/tutor.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../service/auth.service';

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
  /** Componente para exibir o perfil do tutor */
  tutor!: Tutor;

  dias!: string;
  horario!: string;

  isTutoring = false;
  isEditting = false;

  /** Dias da semana exibidos como colunas */
  days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  /** Colunas da tabela, incluindo horários e dias */
  displayedColumns: string[] = ['time', ...this.days];

  /** Horários a cada 15 minutos (por ex.) */
  times: string[] = Array.from({ length: 22 - 8 + 1 }) // 22-8 = 14, +1 = 15 slots (08, 09, …, 22)
    .map((_, i) => {
      const hour = 8 + i;
      return `${hour.toString().padStart(2, '0')}:00`;
    });

  /** Armazena as marcações: selection[diaIndex][hora] = true/false */
  selection: Record<number, Record<string, boolean>> = {};

  constructor(
    /** Serviço HTTP para chamadas de API @type {HttpClient} */
    private http: HttpClient,
    /** Serviço de autenticação @type {AuthService} */
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.days.forEach((_, dayIdx) => {
      this.selection[dayIdx] = {};
      this.times.forEach((t) => (this.selection[dayIdx][t] = false));
    });

    this.authService.getUserId().then((userId) => {
      this.http.post('http://localhost:3000/getTutor', { userId }).subscribe({
        next: (response: any) => {
          this.tutor = JSON.parse(response);
          console.log('Perfil do tutor:', this.tutor);
        },
        error: (error) => {
          console.error('Erro ao carregar o perfil do tutor:', error);
        },
      });
    });
  }

  /** Chama quando o usuário checa/desmarca um slot */
  toggleSlot(dayIdx: number, time: string) {
    this.selection[dayIdx][time] = !this.selection[dayIdx][time];
  }

  /** Retorna um array com todas as combinações selecionadas */
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

  verSelecionados(input: { day: string; time: string }[]): any {
    return input;
  }

  onToggle(toggle: boolean) {
    this.isTutoring = !toggle;
  }

  onEdit() {
    this.isEditting = !this.isEditting;
  }

  onSave() {
    this.isEditting = !this.isEditting;
  }
}

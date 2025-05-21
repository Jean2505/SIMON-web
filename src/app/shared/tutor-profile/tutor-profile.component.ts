import { Component } from '@angular/core';
import {FormsModule, FormGroup, FormArray, FormControl} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { type Tutor } from '../../models/tutor.model';

@Component({
  selector: 'app-tutor-profile',
  imports: [MatExpansionModule, MatSlideToggleModule, FormsModule, CommonModule, MatTableModule, MatCheckboxModule],
  templateUrl: './tutor-profile.component.html',
  styleUrl: './tutor-profile.component.scss'
})
export class TutorProfileComponent {

  tutor!: Tutor;

  dias!: string;
  horario!: string;

  isTutoring = false;
  isEditting = false;

  /** Dias da semana exibidos como colunas */
  days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  /** Horários a cada 15 minutos (por ex.) */
  times: string[] = Array
    .from({ length: (23 - 6) * 4 + 1 })
    .map((_, i) => {
      const hour = 6 + Math.floor(i / 4);
      const mins = (i % 4) * 15;
      return `${hour.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}`;
    });

  /** Armazena as marcações: selection[diaIndex][hora] = true/false */
  selection: Record<number, Record<string, boolean>> = {};

  constructor() {
    // inicializa todo o grid como false
    this.days.forEach((_, dayIdx) => {
      this.selection[dayIdx] = {};
      this.times.forEach(t => this.selection[dayIdx][t] = false);
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
      this.times.forEach(t => {
        if (this.selection[d][t]) {
          result.push({ day, time: t });
        }
      });
    });
    return result;
  }

  verSelecionados(input: any): any {
    return input;
  }

  onToggle(toggle: boolean) {
    this.isTutoring = !toggle;
  }

  onEdit(){
    this.isEditting = !this.isEditting;
  }

  onSave(){
    this.isEditting = !this.isEditting;
  }
}

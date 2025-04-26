import { Component, Input } from '@angular/core';

import { type Tutor } from '../../../models/tutor.model';
import { DUMMY_MONITORS } from './dummy-monitors';

/**
 * Componente de exibição de informações de um monitor.
 * @property monitor - Objeto Monitor recebido como input, representando os dados do monitor.
 */
@Component({
  selector: 'app-tutors',            // Seletor HTML para usar este componente
  standalone: true,                   // Componente standalone sem necessidade de NgModule externo
  imports: [],                        // Lista de módulos importados para este componente
  templateUrl: './tutors.component.html', // Caminho para o template HTML
  styleUrls: ['./tutors.component.scss']   // Caminho para estilos SCSS
})
export class TutorsComponent {
  /** Monitor a ser exibido. */
  @Input() tutor!: Tutor;
}
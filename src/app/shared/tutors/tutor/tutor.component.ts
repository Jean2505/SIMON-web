import { Component, Input } from '@angular/core';

import { type Tutor } from '../../../models/tutor.model';

/**
 * Componente de exibição de informações de um monitor.
 * @property monitor - Objeto Monitor recebido como input, representando os dados do monitor.
 */
@Component({
  selector: 'app-tutor',            // Seletor HTML para usar este componente
  standalone: true,                   // Componente standalone sem necessidade de NgModule externo
  imports: [],                        // Lista de módulos importados para este componente
  templateUrl: './tutor.component.html', // Caminho para o template HTML
  styleUrls: ['./tutor.component.scss']   // Caminho para estilos SCSS
})
export class TutorComponent {
  /** Monitor a ser exibido. */
  @Input() tutor!: Tutor;
}
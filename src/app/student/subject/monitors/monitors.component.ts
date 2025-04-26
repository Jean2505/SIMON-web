import { Component, Input } from '@angular/core';

import { type Monitor } from '../../../models/monitor.model';
import { DUMMY_MONITORS } from './dummy-monitors';

/**
 * Componente de exibição de informações de um monitor.
 * @property monitor - Objeto Monitor recebido como input, representando os dados do monitor.
 */
@Component({
  selector: 'app-monitors',            // Seletor HTML para usar este componente
  standalone: true,                   // Componente standalone sem necessidade de NgModule externo
  imports: [],                        // Lista de módulos importados para este componente
  templateUrl: './monitors.component.html', // Caminho para o template HTML
  styleUrls: ['./monitors.component.scss']   // Caminho para estilos SCSS
})
export class MonitorsComponent {
  /** Monitor a ser exibido. */
  @Input() monitor!: Monitor;
}
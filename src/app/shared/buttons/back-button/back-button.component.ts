import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-back-button',
  imports: [],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.scss'
})
export class BackButtonComponent {

  constructor(
    /** Injeção do serviço de localização do Angular @type {Location} */
    private location: Location
  ) { }

  /** Método para navegar de volta à página anterior */
  goBack(): void {
    this.location.back();
  }
  
  /**
   * Método para verificar se é possível voltar na navegação
   * @returns {boolean} Retorna true se for possível voltar, caso contrário false
   */
  canGoBack(): boolean {
    const state = this.location.getState() as { previousUrl?: string };
    return this.location.isCurrentPathEqualTo(state.previousUrl ?? '');
  }
}

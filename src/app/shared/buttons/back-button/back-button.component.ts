import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  imports: [],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.scss',
})
export class BackButtonComponent implements OnInit {
  constructor(
    /** Injeção do serviço de localização do Angular @type {Location} */
    private location: Location,
    /** Injeção do serviço de roteamento do Angular @type {Router} */
    private router: Router,
    /** Referência ao serviço de rota ativa @type {ActivatedRoute} */
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Inicialização do componente, se necessário
    console.log('rota:', this.route.snapshot);
  }

  /** Método para navegar de volta à página anterior */
  goBack(event: MouseEvent): void {
    if (this.route.snapshot.params['id']) {
      console.log('voltando para subjects');
      this.router
        .navigate(['subjects'], { relativeTo: this.route.pathFromRoot[1] })
        .then(
          (success) => {
            console.log('Navegação realizada:', success);
            return;
          },
          (error) => {
            console.error('Erro na navegação:', error);
            return;
          }
        );
    }
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

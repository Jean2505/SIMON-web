import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  imports: [],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.scss',
})
/** Componente de botão de voltar */
export class BackButtonComponent implements OnInit {
  /** Construtor do componente BackButtonComponent */
  constructor(
    /** Injeção do serviço de roteamento do Angular @type {Router} */
    private router: Router,
    /** Referência ao serviço de rota ativa @type {ActivatedRoute} */
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

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
    } else {
      this.router.navigate(['../'], { relativeTo: this.route }).then(
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
  }
}

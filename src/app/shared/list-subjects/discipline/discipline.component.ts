import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { type Discipline } from '../../../models/discipline.model';

/**
 * Componente de exibição e manipulação de informações de disciplina.
 * @property discipline - Objeto Discipline recebido como input, representando a disciplina atual.
 * @property cursoId    - ID do curso associado à disciplina.
 * @property role       - Papel do usuário (ex: aluno, professor).
 */
@Component({
  selector: 'app-discipline',                   // Seletor HTML para usar este componente
  standalone: true,                             // Componente standalone sem necessidade de NgModule externo
  imports: [FormsModule, RouterModule],         // Módulos necessários para formulários e navegação
  templateUrl: './discipline.component.html',   // Caminho para o template HTML
  styleUrls: ['./discipline.component.scss']    // Caminho para estilos SCSS
})
export class DisciplineComponent {
  /** Objeto Discipline com dados da matéria. */
  @Input({ required: true }) discipline!: Discipline;

  /** ID do curso ao qual a disciplina pertence. */
  @Input({ required: true }) cursoId!: string;

  /** Role do usuário */
  @Input({ required: true }) role = '';

  /** Quantidade de monitores informada pelo usuário. */
  enteredQuantity: string = '';

  /**
   * Construtor do componente.
   * @param router - Serviço Router para navegação programática.
   * @param route  - Serviço ActivatedRoute para acessar informações da rota atual.
   * @description Este construtor inicializa o componente com os serviços necessários para navegação e manipulação de rotas.
   */
  constructor(
    /** Referência ao serviço de roteamento @type {Router} */
    private router: Router,
    /** Referência ao serviço de rota ativa @type {ActivatedRoute} */
    private route: ActivatedRoute
  ) { }

  /**
   * Navega para a página de detalhes de um monitor.
   * @param discipline - Objeto Discipline selecionado para visualização.
   */
  viewSubject(discipline: Discipline): void {
    this.router.navigate([discipline.id], { relativeTo: this.route })
      .then(success => {
        console.log('Navegação realizada:', success);
        console.clear();                         // Limpa o console após navegação bem-sucedida
      })
      .catch(error => console.error('Erro na navegação:', error));
  }
}

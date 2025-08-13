import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { type Discipline } from '../../../models/discipline.model';
import { SessionStorageService } from '../../../core/services/session-storage.service';
import { RequestModalComponent } from "../request-modal/request-modal.component";

/**
 * Componente de exibição e manipulação de informações de disciplina.
 * @property discipline - Objeto Discipline recebido como input, representando a disciplina atual.
 * @property cursoId    - ID do curso associado à disciplina.
 */
@Component({
  selector: 'app-discipline', // Seletor HTML para usar este componente
  standalone: true, // Componente standalone sem necessidade de NgModule externo
  imports: [FormsModule, RouterModule, RequestModalComponent], // Módulos necessários para formulários e navegação
  templateUrl: './discipline.component.html', // Caminho para o template HTML
  styleUrls: ['./discipline.component.scss'], // Caminho para estilos SCSS
})
export class DisciplineComponent {
  /** Objeto Discipline com dados da matéria. */
  @Input({ required: true }) discipline!: Discipline;

  /** ID do curso ao qual a disciplina pertence. */
  @Input({ required: true }) cursoId!: string; 

  @Input({ required: true }) monitorsQuantity!: Number | undefined;

  isRequesting = false;
  @Output() openModal = new EventEmitter<boolean>();

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
    private route: ActivatedRoute,
    /** Referência ao serviço de armazenamento de sessão @type {SessionStorageService} */
    private sessionStorage: SessionStorageService
  ) {}

  /**
   * Navega para a página de detalhes de um monitor.
   * @param discipline - Objeto Discipline selecionado para visualização.
   */
  viewSubject(discipline: Discipline): void {
    this.router
      .navigate([`subject/${discipline.id}`], { relativeTo: this.route.parent })
      .then((success) => {
        // Armazena a disciplina selecionada na sessão para uso posterior
        this.sessionStorage.setData('selectedDiscipline', discipline);
        console.log('Navegação realizada:', success);
        console.clear(); // Limpa o console após navegação bem-sucedida
      })
      .catch((error) => console.error('Erro na navegação:', error));
  }

  openRequestModal(discipline: Discipline): void {
    console.log(this.monitorsQuantity);
    this.isRequesting = !this.isRequesting;
  }

  cancel() {
    this.isRequesting = false;
  }

  clickCancel(event: boolean) {
    this.isRequesting = event;
  }
}

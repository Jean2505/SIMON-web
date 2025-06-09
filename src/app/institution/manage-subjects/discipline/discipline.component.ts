import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { type Discipline } from '../../../models/discipline.model';

/**
 * Componente de exibição e manipulação de informações de disciplina.
 * @property discipline - Objeto Discipline recebido como input, representando a disciplina atual.
 * @property cursoId    - ID do curso associado à disciplina.
 */
@Component({
  selector: 'app-discipline', // Seletor HTML para usar este componente
  standalone: true, // Indica componente standalone sem necessidade de NgModule externo
  imports: [FormsModule], // Módulo para formulários necessários no template
  templateUrl: './discipline.component.html', // Caminho para template HTML
  styleUrls: ['./discipline.component.scss'], // Caminho para estilos SCSS
})
export class DisciplineComponent implements OnInit {
  /** Inputs do componente */
  @Input({ required: true }) discipline!: Discipline; // Objeto Discipline com dados da matéria
  @Input({ required: true }) cursoId!: string; // ID do curso ao qual a disciplina pertence

  /** Estado local */
  enteredQuantity: Number = 0; // Quantidade de monitores informada pelo usuário

  /** Indicador de estado de carregamento */
  loading: boolean = false; // Indicador de carregamento, usado para exibir spinner enquanto aguarda resposta do backend

  /**
   * Construtor do componente.
   * @param http - Injeção do HttpClient para realizar requisições HTTP.
   */
  constructor(
    /** Injeção do HttpClient para realizar requisições HTTP @type {HttpClient} */
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (this.discipline.monitors !== undefined) {
      this.enteredQuantity = this.discipline.monitors!; // Inicializa quantidade de monitores com valor da disciplina ou zero
    }
  }

  /**
   * Método acionado ao adicionar monitores à disciplina.
   * Envia POST ao backend para atualizar quantidade de monitores.
   * @param disciplineId - ID da disciplina a ser atualizada.
   */
  onAddDiscipline(disciplineId: string): void {
    this.loading = true; // Ativa indicador de carregamento
    console.log('Discipline ID:', disciplineId);
    console.log('Monitor Amount:', this.enteredQuantity);

    this.http
      .post<string>('http://localhost:3000/updateCourse', {
        params: { id: disciplineId, qtdMonitors: this.enteredQuantity },
      })
      .subscribe({
        next: (response) => {
          console.log('Response from server:', response);
          this.loading = false; // Desativa indicador de carregamento
        },
        error: (error) => {
          console.error('Error sending data:', error);
          this.loading = false; // Desativa indicador de carregamento em caso de erro
        },
      });
  }
}

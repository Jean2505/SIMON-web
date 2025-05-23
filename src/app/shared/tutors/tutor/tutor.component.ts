import { Component, Input } from '@angular/core';

import { type Tutor } from '../../../models/tutor.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Componente de exibição de informações de um monitor.
 * @property monitor - Objeto Monitor recebido como input, representando os dados do monitor.
 */
@Component({
  selector: 'app-tutor', // Seletor HTML para usar este componente
  standalone: true, // Componente standalone sem necessidade de NgModule externo
  imports: [], // Lista de módulos importados para este componente
  templateUrl: './tutor.component.html', // Caminho para o template HTML
  styleUrls: ['./tutor.component.scss'], // Caminho para estilos SCSS
})
export class TutorComponent {
  /** Monitor a ser exibido. */
  @Input() tutor!: Tutor;

  /**
   * Construtor do componente TutorComponent.
   */
  constructor(
    /** Serviço HTTP para chamadas de API @type {HttpClient} */
    private http: HttpClient,
    /** Serviço de roteamento @type {Router} */
    private router: Router,
    /** Serviço de rota atual @type {ActivatedRoute} */
    private route: ActivatedRoute,
  ) {}

  /**
   * Método para ir para o perfil do monitor.
   */
  goTutor() {
    this.router.navigate(['/tutor', this.tutor.uid], { relativeTo: this.route.pathFromRoot[1] });
  }
}

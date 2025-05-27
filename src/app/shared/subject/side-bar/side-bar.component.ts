import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [
    CommonModule
  ],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {

  /** Nome da tela atual. @type {string} */
  activatedScreen: string = 'board'; // Tela ativa padrão

  /**
   * Construtor do componente.
   * @param router - Serviço Router para navegação programática.
   * @param route  - Rota ativa, usada para navegação relativa.
   */
  constructor(
    /**
     * Serviço Router para navegação programática.
     * @type {Router}
     */
    private router: Router,
    /**
     * Rota ativa, usada para navegação relativa.
     * @type {ActivatedRoute}
     */
    private route: ActivatedRoute
  ) { }

  /** Navega para o mural da matéria (`board`) */
  goMural(): void {
    this.activatedScreen = 'board'; // Atualiza a tela ativa
    this.router.navigate(['board'], { relativeTo: this.route });
  }

  /** Navega para a lista de monitores (`tutors`) */
  goTutors(): void {
    this.activatedScreen = 'tutors'; // Atualiza a tela ativa
    this.router.navigate(['tutors'], { relativeTo: this.route });
  }

  /** Navega para o fórum da matéria (`forum`) */
  goForum(): void {
    this.activatedScreen = 'forum'; // Atualiza a tela ativa
    this.router.navigate(['forum'], { relativeTo: this.route });
  }
}

import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {
  /**
   * Construtor do componente.
   * @param router - Serviço Router para navegação programática.
   * @param route  - Rota ativa, usada para navegação relativa.
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  /** Navega para o mural da matéria (`board`) */
  goMural(): void {
    this.router.navigate(['board'], { relativeTo: this.route });
  }

  /** Navega para a lista de monitores (`tutors`) */
  goTutors(): void {
    this.router.navigate(['tutors'], { relativeTo: this.route });
  }

  /** Navega para o fórum da matéria (`forum`) */
  goForum(): void {
    this.router.navigate(['forum'], { relativeTo: this.route });
  }
}

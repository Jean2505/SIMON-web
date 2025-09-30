import { Component, Input } from '@angular/core';
import { Discipline } from '../../../models/discipline.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '../../../core/services/session-storage.service';

@Component({
  selector: 'app-discipline',
  imports: [],
  templateUrl: './discipline.component.html',
  styleUrl: './discipline.component.scss'
})
export class DisciplineComponent {

  @Input({ required: true }) discipline!: Discipline;

  constructor (
    private router: Router,
    private route: ActivatedRoute,
    private sessionStorage: SessionStorageService
  ) {}

  viewReports(disciplina: Discipline): void {
    this.router
      .navigate([`reports/${disciplina.id}`], { relativeTo: this.route.parent })
      .then((success) => {
        this.sessionStorage.setData('selectedDiscipline', disciplina);
      })
      .catch((error) => console.error('Erro na navegação:', error));
  }
}

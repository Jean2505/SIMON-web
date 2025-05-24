import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { type Tutor } from '../../../models/tutor.model';

/**
 * Componente de exibição de informações de um monitor.
 */
@Component({
  selector: 'app-tutor',
  standalone: true,
  imports: [],
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.scss'],
})
export class TutorComponent implements OnInit {
  /** Monitor a ser exibido */
  @Input({ required: true }) tutor!: Tutor;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
   * Hook chamado após a inicialização do componente
   */
  ngOnInit(): void {
    console.log('TutorComponent criado com tutor:', this.tutor.uid);
  }

  /**
   * Navega para o perfil do monitor
   */
  goTutor(): void {
    console.log('Navegando para o perfil do monitor:', this.tutor.uid);
    this.router.navigate(['tutor', this.tutor.uid], {
      relativeTo: this.route.pathFromRoot[1],
    });
  }
}

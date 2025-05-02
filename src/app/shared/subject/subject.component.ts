import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from './side-bar/side-bar.component';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [CommonModule, SideBarComponent, RouterOutlet],
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {

  /** ID da matéria recuperada da rota */
  subjectId!: string;
  /**
   * Injetar o serviço de rota ativa para leitura dos parâmetros.
   * @param route serviço do Angular para obter dados da rota atual
   */
  constructor(private route: ActivatedRoute) { } // Injeta o ActivatedRoute para acessar parâmetros de rota

  /** Método chamado quando o componente é inicializado */
  ngOnInit(): void {
    // Recupera o ID da matéria a partir dos parâmetros da rota
    this.route.params.subscribe(params => {
      this.subjectId = params['id'];
    });
  }
}

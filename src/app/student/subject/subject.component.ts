import { ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { type Tutor } from '../../models/tutor.model';
import { TutorsComponent } from './tutors/tutors.component';

/**
 * Componente de exibição de monitores de uma disciplina para o estudante.
 * Busca e apresenta lista de monitores disponíveis.
 */
@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    TutorsComponent
  ],
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class StudentSubjectComponent implements OnInit {
  /** Lista de monitores disponíveis para a disciplina. */
  tutors: Tutor[] = [];

  /** ID da disciplina extraído da rota. */
  disciplineId!: string;

  /** Nome da disciplina exibido no topo. */
  discipline: string = 'carregando...';

  /** Indica se as disciplinas estão sendo carregadas. */
  loadingTutors = true;

  /**
   * Construtor do componente.
   * @param http  - HttpClient para requisições HTTP.
   * @param auth  - Auth do Firebase para obter usuário atual.
   * @param route - ActivatedRoute para parâmetros de rota.
   */
  constructor(
    private http: HttpClient,
    private auth: Auth,
    private route: ActivatedRoute
  ) { }

  /**
   * Hook de ciclo de vida Angular.
   * Executa a busca inicial de monitores.
   */
  ngOnInit(): void {
    this.getMonitors();
  }

  /**
   * Obtém informações da disciplina e de seus monitores via backend.
   * Atualiza `discipline` e popula `monitors`.
   */
  getMonitors(): void {
    let result: any = null;
    this.disciplineId = this.route.snapshot.paramMap.get('id')!;

    // Solicita detalhes da disciplina
    this.http.get('http://localhost:3000/discipline', { params: { disciplineId: this.disciplineId } })
      .subscribe({
        next: (response: any) => {
          console.log('Resposta do servidor:', response[0]);
          this.discipline = response[0].nome_Disciplina;
          console.log('Nome da disciplina:', this.discipline);
        },
        error: error => {
          console.error('Erro ao buscar disciplina:', error);
        }
      });

    console.log('ID da disciplina:', this.disciplineId);

    // Solicita lista de monitores disponíveis
    this.http.post('http://localhost:3000/getTutor', { courseId: this.disciplineId })
      .subscribe({
        next: (response: any) => {
          result = JSON.parse(response.payload);
          console.log('Resposta do servidor:', result);
          this.tutors = result.map((monitor: any) => ({
            approved: monitor.aprovacao,
            discipline: monitor.disciplina,
            disciplineId: monitor.disciplinaId,
            photo: monitor.foto,
            availability: monitor.horarioDisponivel,
            local: monitor.local,
            name: monitor.nome,
            ra: monitor.ra,
            room: monitor.sala,
            status: monitor.status,
          }));
        },
        error: error => {
          console.error('Erro ao buscar monitores:', error);  
        },
      });
      this.loadingTutors = false; // Atualiza o estado de carregamento após a resposta
  }
}
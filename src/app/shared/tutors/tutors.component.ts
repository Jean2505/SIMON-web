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
import { TutorComponent } from './tutor/tutor.component';

@Component({
  selector: 'app-tutors',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    TutorComponent
  ],
  templateUrl: './tutors.component.html',
  styleUrl: './tutors.component.scss'
})
export class SubjectTutorsComponent implements OnInit {
  /** Lista de monitores disponíveis para a disciplina. */
  tutors: Tutor[] = [];

  /** ID da disciplina extraído da rota. */
  disciplineId!: string;

  /** Nome da disciplina exibido no topo. */
  discipline: string = 'carregando...';

  /** Indica se as disciplinas estão sendo carregadas. */
  loadingTutors = true;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getMonitors();
  }
  /**
   * Obtém informações da disciplina e de seus monitores via backend.
   * Atualiza `discipline` e popula `monitors`.
   */
  getMonitors(): void {
    let result: any = null;
    this.route.parent!.paramMap.subscribe(async params => {
      this.disciplineId = params.get('id') ?? '';

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
              aprovacao: monitor.aprovacao,
              discipline: monitor.disciplina,
              disciplinaId: monitor.disciplinaId,
              foto: monitor.foto,
              horarioDisponivel: monitor.horarioDisponivel,
              local: monitor.local,
              nome: monitor.nome,
              ra: monitor.ra,
              sala: monitor.sala,
              status: monitor.status,
            }));
          },
          error: error => {
            console.error('Erro ao buscar monitores:', error);
          },
        });
      this.loadingTutors = false; // Atualiza o estado de carregamento após a resposta
    })
  }
}

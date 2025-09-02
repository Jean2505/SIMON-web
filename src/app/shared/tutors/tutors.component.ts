import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { type Tutor } from '../../models/tutor.model';

import { TutorComponent } from './tutor/tutor.component';
import { ProgressWithGifComponent } from "../loading/loading.component";
import { SessionStorageService } from '../../core/services/session-storage.service';
import { RecomendationModalComponent } from "./recomendation-modal/recomendation-modal.component";
import { Discipline } from '../../models/discipline.model';
import { Auth, User } from '@angular/fire/auth';

@Component({
  selector: 'app-tutors',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    TutorComponent,
    ProgressWithGifComponent,
    RecomendationModalComponent
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
  disciplineName?: string;

  disciplineTerm!: number;

  disciplineCourse!: string;

  /** Indica se as disciplinas estão sendo carregadas. */
  loadingTutors = true;

  userRole: any;
  user!: User;

  isModalOpen = false;

  constructor(
    /** Serviço de requisições HTTP @type {HttpClient} */
    private http: HttpClient,
    /** Serviço de rota ativa para acessar parâmetros da rota @type {ActivatedRoute} */
    private route: ActivatedRoute, 
    /** Serviço para gerenciar dados na sessão @type {SessionStorageService} */
    private sessionStorage: SessionStorageService,
    /** Referência ao serviço de autenticação do Firebase */
    private auth: Auth,
  ) {
    this.userRole = this.sessionStorage.getData('role', 'role');
    this.user = this.auth.currentUser!;
  }

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
            this.disciplineName = response[0].nome_Disciplina;
            this.disciplineTerm = response[0].periodo_Disciplina;
            this.disciplineCourse = response[0].curso_Disciplina;
          },
          error: error => {
            console.error('Erro ao buscar disciplina:', error);
            this.loadingTutors = false; // Atualiza o estado de carregamento após a resposta
            return;
          }
        });

      // Solicita lista de monitores disponíveis
      this.http.post('http://localhost:3000/getCourseTutors', { courseId: this.disciplineId })
        .subscribe({
          next: (response: any) => {
            result = JSON.parse(response);
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
              uid: monitor.uid,
            }));
            this.loadingTutors = false; // Atualiza o estado de carregamento após a resposta
          },
          error: error => {
            console.error('Erro ao buscar monitores:', error);
            this.loadingTutors = false; // Atualiza o estado de carregamento após a resposta
          },
        });
    })
  }

  openRecomendationModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  clickCancel(event: boolean) {
    this.isModalOpen = event;
  }
}

import { Component, Input, OnInit } from '@angular/core';

import { Auth, User } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Timestamp } from 'firebase/firestore/lite';

import { type Discipline } from '../../models/discipline.model';

import { CardComponent } from "./card/card.component";
import { DUMMY_POSTS } from './dummy-posts';
import { NewPostComponent } from "./new-post/new-post.component";

@Component({
  selector: 'app-board',
  imports: [CardComponent, NewPostComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class SubjectBoardComponent implements OnInit {

  /**
   * Construtor do componente.
   * @param auth    - Auth do Firebase para obter usuário atual.
   * @param http    - HttpClient para requisições HTTP.
   * @param storage - Storage do Firebase para upload de arquivos.
   */
  constructor(
    /** Referência ao serviço de autenticação do Firebase */
    private auth: Auth,
    /** Referência ao backend */
    private http: HttpClient,
    /** Referência ao serviço de rota atual do Angular */
    private route: ActivatedRoute,
    /** Referência ao serviço de armazenamento do Firebase */
    //private storage: Storage
  ) { }

  /**
   * Interface da Disciplina
   * @property id: ID da disciplina
   * @property cursoId: ID do curso ao qual a disciplina pertence
   * @property name: Nome da disciplina
   * @property professor: Nome do professor responsável pela disciplina
   * @property term: Período da disciplina
   * @optional monitorAmnt: Quantidade de monitores para a disciplina
   */
  subject!: Discipline;

  user!: User;

  role!: string;

  posts = DUMMY_POSTS;

  /** Controla a visibilidade do componente de criação de post */
  isCreatingPost = false;

  async ngOnInit(): Promise<void> {
    let user = this.auth.currentUser;
    const idTokenResult = await user!.getIdTokenResult(true);
    // pega o campo "role" dos claims
    this.role = (idTokenResult.claims['role'] as string) ?? null;
    console.log(this.role);
    let subjectId: string = '';
    this.route.parent!.paramMap.subscribe(async params => {
      subjectId = params.get('id') ?? '';
      console.log(subjectId);
      this.http.get('http://localhost:3000/discipline', { params: { disciplineId: subjectId } }).subscribe({
        next: (response: any) => {
          this.subject.id = response[0].id_Disciplina;
          this.subject.curso = response[0].curso_Disciplina;
          this.subject.name = response[0].nome_Disciplina;
          this.subject.professor = response[0].professor_Disciplina;
          this.subject.term = response[0].periodo_Disciplina;
          console.log('Objeto matéria:', this.subject);
        },
        error: (error) => {
          console.error('Erro ao carregar disciplina:', error);
        }
      });
    });
  }

  /** Controla a visibilidade do componente de criação de post */
  onStartCreatePost() {
    this.isCreatingPost = true;
  }

  /** Controla o fechamento do componente de criação de post */
  onCloseCreatePost() {
    this.isCreatingPost = false;
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Auth, IdTokenResult, User } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { type MuralPost } from '../../models/mural-post.model';

import { CardComponent } from './card/card.component';
import { NewPostComponent } from './new-post/new-post.component';
import { ProgressWithGifComponent } from "../loading/loading.component";

@Component({
  selector: 'app-board',
  imports: [CardComponent, NewPostComponent, ProgressWithGifComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
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
    private route: ActivatedRoute /** Referência ao serviço de armazenamento do Firebase */
  ) //private storage: Storage
  {}

  /** ID da disciplina */
  subjectId = '';

  user!: User;

  /** Variável para verificar se o usuário é professor */
  isProfessor = false;
  /** Variável para verificar se o usuário é tutor */
  isTutor = false;

  /** Lista de posts do mural */
  posts!: MuralPost[];

  /** Lista de monitores da disciplina */
  tutors: string[] = [];

  /** Controla o estado de carregamento dos posts */
  loading = true;

  /** Controla a visibilidade do componente de criação de post */
  isCreatingPost = false;

  async ngOnInit(): Promise<void> {
    this.user = this.auth.currentUser!;
    const idTokenResult = await this.user.getIdTokenResult(true);
    this.route.parent!.paramMap.subscribe(async (params) => {
      this.subjectId = params.get('id') ?? '';
      console.log('ID da disciplina', this.subjectId);
      this.http
        .post('http://localhost:3000/getMuralPosts', {
          disciplinaId: this.subjectId,
        })
        .subscribe({
          next: (response: any) => {
            const result = JSON.parse(response.payload);
            this.posts = result.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                userName: post.userName,
                files: post.files,
                images: post.images,
                videos: post.videos,
                createdAt: new Date(
                  post.createdAt._seconds * 1000 +
                    post.createdAt._nanoseconds / 1_000_000
                ),
                disciplinaId: post.disciplinaId,
              };
            });
            this.getUserData(this.subjectId, idTokenResult);
            console.log(this.posts);
            this.loading = false;
          },
          error: (error) => {
            if (error.status === 500) {
              console.log('Nenhum post encontrado.');
              this.getUserData(this.subjectId, idTokenResult);
              this.loading = false;
            } else console.error('Erro ao carregar posts:', error);
          },
        });
    });
  }

  /**
   * Obtém os dados do usuário e verifica se é professor ou tutor.
   * @param disciplineId - ID da disciplina.
   * @param idTokenResult - Resultado do token de autenticação do usuário.
   */
  getUserData(disciplineId: string, idTokenResult: IdTokenResult): void {
    // pega o campo "role" dos claims
    const role = (idTokenResult.claims['role'] as string) ?? null;
    console.log('Role:', role);
    if (role === 'PROFESSOR') {
      this.isProfessor = true;
    } else {
      this.http
        .post('http://localhost:3000/getCourseTutors', {
          courseId: disciplineId,
        })
        .subscribe({
          next: (response: any) => {
            const result = JSON.parse(response) as any[];
            result.forEach((tutor: any) => {
              if (tutor.aprovacao === 1) {
                this.tutors.push(tutor.uid as string);
              }
            });
            console.log('monitores da matéria:', this.tutors);
            if (this.tutors.includes(this.user.uid)) {
              this.isTutor = true;
            }
          },
        });
    }
  }

  /**
   * Retorna o número de posts para rastreamento.
   * @param posts - Lista de posts.
   * @returns Número de posts.
   */
  trackPosts(posts: any[] | null): number {
    if (posts) return posts.length;
    return 0;
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

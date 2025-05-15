import { Component, OnInit } from '@angular/core';
import { DUMMY_FORUM_POSTS } from './dummy-forumPost';
import { CardComponent } from "./card/card.component";
import { HttpClient } from '@angular/common/http';

import { ForumPost } from '../../models/forum-post.model';
import { PostComment } from '../../models/forum-post.model';
import { Auth, User } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forum',
  imports: [CardComponent],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.scss'
})
export class SubjectForumComponent implements OnInit {

  /** ID da disciplina atual. */
  subjectId = '1234567890';

  user!: User;

  /**
   * Lista de posts do fórum.
   * @type {ForumPost[]}
   * @description Esta variável armazena os posts do fórum que serão exibidos na interface.
   * @property {Array} posts[].comments[] - Array de comentários associados ao post.
   * @property {string} posts[].content - Conteúdo do post.
   * @property {string} posts[].courseId - ID da disciplina à qual o post pertence.
   * @property {Date} posts[].createdAt - Data de criação do post.
   * @property {number} posts[].likes - Número de curtidas no post.
   * @property {string} posts[].title - Título do post.
   * @property {string} posts[].userId - ID do usuário que criou o post.
   * @property {string} posts[].userName - Nome do usuário que criou o post.
   */
  posts!: ForumPost[];

  /**
   * constructor
   * @param http - HttpClient para fazer requisições HTTP.
   */
  constructor(
    /** Referência ao serviço de autenticação do Firebase @type {Auth} */
    private auth: Auth,
    /** Referência ao serviço de requisições HTTP @type {HttpClient} */
    private http: HttpClient,
    /** Referência ao serviço de rota atual do Angular @type {ActivatedRoute} */
    private route: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {
    this.user = this.auth.currentUser!;
    const idTokenResult = await this.user.getIdTokenResult(true);
    this.route.parent!.paramMap.subscribe(async params => {
      this.subjectId = params.get('id') ?? '';
      console.log('ID da disciplina', this.subjectId);
      this.http.post('http://localhost:3000/getForumPosts', { courseId: this.subjectId }).subscribe({
        next: (response: any) => {
          let result = JSON.parse(response);
          this.posts = result.map((post: any) => {
            return {
              ...post.data,
              docId: post.docId,
            } as ForumPost;
          })
          console.log('Posts do fórum:', this.posts);
        },
        error: (error) => {
          console.error('Erro ao buscar os posts do fórum:', error);
        },
      })
    })
  }

}

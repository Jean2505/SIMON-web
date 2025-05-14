import { Component, OnInit } from '@angular/core';
import { DUMMY_FORUM_POSTS } from './dummy-forumPost';
import { CardComponent } from "./card/card.component";
import { HttpClient } from '@angular/common/http';

import { ForumPost } from '../../models/forum-post.model';
import { PostComment } from '../../models/forum-post.model';

@Component({
  selector: 'app-forum',
  imports: [CardComponent],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.scss'
})
export class SubjectForumComponent implements OnInit {

  /** ID da disciplina atual. */
  subjectId = '1234567890';
  
  /**
   * Lista de posts do fórum.
   * @type {ForumPost[]}
   * @description Esta variável armazena os posts do fórum que serão exibidos na interface.
   * @property {ForumPost[]} posts - Lista de posts do fórum.
   * @property {string} posts[].id - ID do post.
   * @property {string} posts[].title - Título do post.
   * @property {string} posts[].content - Conteúdo do post.
   * @property {string} posts[].userId - ID do usuário que criou o post.
   * @property {string} posts[].userName - Nome do usuário que criou o post.
   * @property {Date} posts[].createdAt - Data de criação do post.
   * @property {string} posts[].disciplineId - ID da disciplina à qual o post pertence.
   * @property {number} posts[].likes - Número de curtidas no post.
   * @property {Array} posts[].commentsIDs[] - Array de comentários associados ao post.
   */
  posts: ForumPost[] = DUMMY_FORUM_POSTS;

  /**
   * constructor
   * @param http - HttpClient para fazer requisições HTTP.
   */
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.post('http://localhost:3000/getForumPosts', { disciplinaId: this.subjectId }).subscribe({
      next: (response: any) => {

      },
      error: (error) => {
        console.error('Erro ao buscar os posts do fórum:', error);
      },
    })
  }

}

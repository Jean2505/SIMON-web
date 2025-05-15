import { Component, Input, OnInit } from '@angular/core';
import { type ForumPost } from '../../../models/forum-post.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forum-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit {
  
  isLiked = false;

  @Input() post?: ForumPost;

  @Input() userId?: string;

  /**
   * Construtor do componente CardComponent
   * @param http - HttpClient para fazer requisições HTTP.
   */
  constructor(
    /** Referência ao serviço de requisições HTTP @type {HttpClient} */
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    console.log(this.post);
    console.log(this.userId);
  }

  likePost(docId: string | undefined): void {
    // Implementar lógica para curtir o post
    this.http.post('http://localhost:3000/likePost', { docId, like: !this.isLiked }).subscribe({
      next: (response: any) => {
        console.log('Post curtido com sucesso:', response);
        this.isLiked = !this.isLiked;
      },
      error: (error) => {
        console.error('Erro ao curtir o post:', error);
      }
    });
    console.log('Curtindo o post:', docId);
  }

}

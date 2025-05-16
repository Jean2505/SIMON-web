import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { type ForumPost } from '../../../models/forum-post.model';

@Component({
  selector: 'app-forum-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnInit {
  
  isLiked = false;

  @Input() post!: ForumPost;

  @Input() userId!: string;

  /**
   * Construtor do componente CardComponent
   * @param http - HttpClient para fazer requisições HTTP.
   */
  constructor(
    /** Referência ao serviço de requisições HTTP @type {HttpClient} */
    private http: HttpClient,
    /** Referência ao serviço de rota atual do Angular @type {ActivatedRoute} */
    private route: ActivatedRoute,
    /** Referência ao serviço de roteamento @type {Router} */
    private router: Router
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

  goPost(event: MouseEvent): void {
    const element = event.target as HTMLElement
    console.log(element)
    // Implementar lógica para navegar para o post
    //this.router.navigate([this.post.docId], { relativeTo: this.route, state: { post: this.post } });
    console.log('Navegando para o post:', this.post.docId);
  }

}

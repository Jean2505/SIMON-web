import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { type PostComment, type ForumPost } from '../../../models/forum-post.model';
import { CommentsComponent } from "../comments/comments.component";
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-forum-post',
  imports: [CommentsComponent, FormsModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class ForumPostComponent implements OnInit {

  isLiked = false;

  showComments = false;

  isCreatingPost = false;

  enteredComment = '';

  comments?: PostComment[];

  constructor(
    /** Referência ao serviço de autenticação @type {AuthService} */
    private authService: AuthService,
    /** Referência ao serviço de requisições HTTP @type {HttpClient} */
    private http: HttpClient,
    /** Referência ao serviço de localização @type {Location} */
    private location: Location,
  ) { }

  post!: ForumPost;

  ngOnInit(): void {
    const state = this.location.getState() as { post?: ForumPost, isLiked?: boolean };
    if (state.post) {
      this.post = state.post;
    }
    if (state.isLiked) {
      this.isLiked = state.isLiked;
    }
    this.http.post('http://localhost:3000/getComments', { postId: this.post.docId }).subscribe({
      next: (response: any) => {
        let result = JSON.parse(response);
        this.comments = result;
        console.log(this.comments);
      },
      error: (error) => {
        console.error('Erro ao obter comentários do post:', error);
      }
    });
  }

  async onAddComment(): Promise<void> {
    const comment: PostComment = {
      content: this.enteredComment,
      createdAt: new Date(),
      postId: this.post.docId!,
      userId: await this.authService.getUserId() || '',
      userName: await this.authService.getUserName() || '',
      userRole: await this.authService.getUserRole(),
    };

    console.log('Dados do comentário:', comment);

    this.http.post('http://localhost:3000/createComment', comment).subscribe({
      next: (response) => {
        console.log('Comentário enviado com sucesso:', response);
        this.comments?.push(comment);
        this.enteredComment = '';
        this.isCreatingPost = false;
      },
      error: (error) => {
        console.error('Erro ao enviar comentário:', error);
      }
    });
  }

  likePost(postId: string | undefined): void {
    // Implementar lógica para curtir o post
    this.http.post('http://localhost:3000/likePost', { postId, like: !this.isLiked }).subscribe({
      next: (response: any) => {
        console.log('Post curtido com sucesso:', response);
        // Atualiza o estado da curtida
        this.post.likes = this.isLiked ? (this.post.likes - 1) : (this.post.likes + 1);
        this.isLiked = !this.isLiked;
      },
      error: (error) => {
        console.error('Erro ao curtir o post:', error);
      }
    });
    console.log('Curtindo o post:', postId);
  }

}

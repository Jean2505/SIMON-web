import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  type PostComment,
  type ForumPost,
} from '../../../models/forum-post.model';
import { CommentsComponent } from '../comments/comments.component';
import { Auth } from '@angular/fire/auth';
import { ProgressWithGifComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-forum-post',
  imports: [CommentsComponent, FormsModule, ProgressWithGifComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class ForumPostComponent implements OnInit {
  /** Controle de carregamento */
  loading = false;
  /** Controle de curtida do post */
  isLiked = false;

  /** Controlador de estado de curtida */
  isLiking = false;

  /** Controle de visibilidade dos comentários */
  showComments = false;

  isCreatingPost = false;

  enteredComment = '';

  comments?: PostComment[];

  constructor(
    /**  */
    private auth: Auth,
    /** Referência ao serviço de requisições HTTP @type {HttpClient} */
    private http: HttpClient,
    /** Referência ao serviço de localização @type {Location} */
    private location: Location
  ) { }

  post!: ForumPost;

  async ngOnInit(): Promise<void> {
    this.loading = true;
    const state = this.location.getState() as {
      post?: ForumPost;
      isLiked?: boolean;
    };
    if (state.post) this.post = state.post;
    if (state.isLiked) this.isLiked = state.isLiked;
    this.http
      .post('http://localhost:3000/getComments', { postId: this.post.docId })
      .subscribe({
        next: (response: any) => {
          let result = JSON.parse(response);
          this.comments = result;
          console.log(this.comments);
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao obter comentários do post:', error);
          this.loading = false;
        },
      });
  }

  async onAddComment(): Promise<void> {
    if (!this.enteredComment.trim()) {
      console.warn('Comentário vazio, não será enviado.');
      return;
    }
    const user = this.auth.currentUser!;
    const idTokenResult = await user.getIdTokenResult(true);
    const comment: PostComment = {
      content: this.enteredComment,
      createdAt: new Date(),
      postId: this.post.docId!,
      userId: user.uid,
      userName: user.displayName!,
      userRole: (idTokenResult.claims['role'] as string) || '',
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
      },
    });
  }

  likePost(postId: string | undefined): void {
    if (this.isLiking) return;
    this.isLiking = true;
    this.isLiked = !this.isLiked;
    this.post.likes = this.isLiked ? this.post.likes + 1 : this.post.likes - 1;
    this.http
      .post('http://localhost:3000/likePost', { postId, like: this.isLiked })
      .subscribe({
        next: (response: any) => {
          console.log('Post curtido com sucesso:', response);
          this.isLiking = false; // Reseta o estado de curtida
        },
        error: (error) => {
          console.error('Erro ao curtir o post:', error);
          this.isLiked = !this.isLiked;
          this.post.likes = this.isLiked
            ? this.post.likes + 1
            : this.post.likes - 1;
          this.isLiking = false; // Reseta o estado de curtida em caso de erro
        },
      });
    console.log('Curtindo o post:', postId);
  }
}

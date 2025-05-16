import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

import { type PostComment, type ForumPost } from '../../../models/forum-post.model';
import { CommentsComponent } from "../comments/comments.component";

@Component({
  selector: 'app-forum-post',
  imports: [CommentsComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class ForumPostComponent implements OnInit {

  showComments = false;

  isCreatingPost = false;

  comments?: PostComment[];

  constructor(
    /** Referência ao serviço de autenticação do Firebase @type {Auth} */
    private auth: Auth,
    /** Referência ao serviço de requisições HTTP @type {HttpClient} */
    private http: HttpClient,
    /** Referência ao serviço de localização @type {Location} */
    private location: Location,
  ) { }

  post!: ForumPost;

  async ngOnInit(): Promise<void> {
    const state = this.location.getState() as { post?: ForumPost };
    if (state.post) {
      this.post = state.post;
    } else {
      
    }
    console.log(this.post);
    this.http.post('http://localhost:3000/getComments', { postId: this.post.docId }).subscribe({
      next: (response: any) => {
        let result = JSON.parse(response);
        this.comments = result;
      },
      error: (error) => {
        console.error('Erro ao obter comentários do post:', error);
      }
    });
  }

}

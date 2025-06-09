import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';

import { type ForumPost } from '../../../models/forum-post.model';

@Component({
  selector: 'app-forum-new-post',
  imports: [FormsModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss',
})
export class NewPostComponent implements OnInit {
  /** ID da matéria passado via Input para associar o post */
  @Input() subjectId!: string;

  /** Emite quando o usuário fecha/cancela o diálogo */
  close = () => {};

  /** URL base da sua API backend */
  private apiUrl = 'http://localhost:3000/createForumPost';

  /** Título do post */
  enteredTitle = '';
  /** Conteúdo do post */
  enteredContent = '';
  /** Impede envios duplicados enquanto estiver em progresso */
  isSending = false;

  constructor(
    /** Referência ao serviço de autenticação do Firebase @type {Auth} */
    private auth: Auth,
    /** Referência ao serviço de requisições HTTP @type {HttpClient} */
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Inicializa o estado do componente
    console.log(localStorage.getItem('studentData'));
    console.log('ID da matéria:', this.subjectId);
    console.log('Novo post iniciado');
  }

  onSubmit(): void {
    this.isSending = true;

    const postData: ForumPost = {
      comments: [],
      content: this.enteredContent,
      courseId: this.subjectId,
      createdAt: new Date(),
      likes: 0,
      title: this.enteredTitle,
      userId: this.auth.currentUser?.uid || '',
      userName: this.auth.currentUser?.displayName || '',
    };

    console.log('Dados do post:', postData);

    this.http.post(this.apiUrl, postData).subscribe({
      next: (response) => {
        console.log('Post criado com sucesso:', response);
        window.location.reload();
      },
      error: (error) => {
        console.error('Erro ao criar post:', error);
      },
      complete: () => {
        this.isSending = false;
      },
    });
  }

  showModal = false;

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}

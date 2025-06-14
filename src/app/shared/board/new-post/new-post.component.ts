import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from '@angular/fire/storage';
import { AuthService } from '../../../core/services/auth.service';
import { ProgressWithGifComponent } from "../../loading/loading.component";

@Component({
  selector: 'app-new-post',
  imports: [FormsModule, ProgressWithGifComponent],
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {
  /** ID da matéria passado via Input para associar o post */
  @Input() subjectId!: string;

  /** Emite quando o usuário fecha/cancela o diálogo */
  @Output() close = new EventEmitter<void>();

  /** URL base da sua API backend */
  private apiUrl = 'http://localhost:3000/createMuralPost';

  /** Título do post */
  enteredTitle = '';
  /** Conteúdo do post */
  enteredContent = '';
  /** URL de vídeo (YouTube) */
  enteredUrl = '';

  /** Controla visibilidade da seção de anexos */
  isAttaching = false;
  /** Controla visibilidade do campo de URL */
  isAddingUrl = false;

  /** Lista de URLs de vídeos YouTube */
  videos: string[] = [''];

  /** Lista de arquivos selecionados para upload futuro */
  files: File[] = [];
  /** Lista de imagens selecionadas para upload futuro */
  images: File[] = [];

  /** Percentual geral de upload (0–100) */
  overallUploadProgress = 0;
  /** Impede envios duplicados enquanto estiver em progresso */
  isSending = false;
  /** Nome do usuário autenticado */
  userName: string = '';

  constructor(
    /** Referência ao serviço de armazenamento do Firebase @type {Storage} */
    private storage: Storage,
    /** Referência ao serviço de requisições HTTP @type {HttpClient} */
    private http: HttpClient,
    /** Referência ao serviço de autenticação @type {AuthService} */
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Obtém o nome do usuário autenticado
    this.userName = this.authService.getUserName() || '';
    console.log('Disciplina:', this.subjectId);
  }

  /** Fecha o diálogo e reseta o estado */
  onCancel(): void {
    this.resetState();
    this.close.emit();
  }

  /** Confirma cancelamento antes de fechar */
  confirmCancel(): void {
    if (confirm('Deseja realmente cancelar o post?')) {
      this.onCancel();
    }
  }

  /** Alterna a visibilidade da seção de anexos */
  onSelectAttach(): void {
    this.isAttaching = !this.isAttaching;
    if (!this.isAttaching) {
      this.isAddingUrl = false;
      this.enteredUrl = '';
      this.videos = [''];
    }
  }

  /** Adiciona um novo campo de URL de YouTube */
  addYoutubeUrl(): void {
    this.videos.push('');
  }

  /** Remove um campo de URL de YouTube pelo índice */
  removeYoutubeUrl(index: number): void {
    this.videos.splice(index, 1);
  }

  /** TrackBy para ngFor de URLs de YouTube */
  trackByIndex(index: number, item: string): number {
    return index;
  }

  /** Adiciona arquivos à lista local (sem upload) */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.files.push(...Array.from(input.files));
    }
  }

  /** Adiciona imagens à lista local (sem upload) */
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.images.push(...Array.from(input.files));
    }
  }

  /** Remove um arquivo da lista local */
  removeFile(index: number): void {
    this.files.splice(index, 1);
  }

  /** Remove uma imagem da lista local */
  removeImage(index: number): void {
    this.images.splice(index, 1);
  }

  /**
   * Faz upload resumível de cada arquivo e imagem,
   * ou envia diretamente se não houver anexos.
   */
  onPost(): void {
    if (this.isSending) return;
    this.isSending = true;

    // Se não houver arquivos nem imagens, envia diretamente
    if (this.files.length === 0 && this.images.length === 0) {
      const payload = {
        title: this.enteredTitle,
        content: this.enteredContent,
        videos: this.videos.filter(v => v.trim()).filter(v => v.trim()),
        files: [] as string[],
        images: [] as string[],
        disciplinaId: this.subjectId,
        userName: this.userName,
      };
      console.log('Payload sem anexos:', payload);
      this.http.post(this.apiUrl, payload).subscribe({
        next: () => {
          console.log('Post sem anexos enviado com sucesso');
          this.resetState();
          this.close.emit();
          window.location.reload();
        },
        error: err => {
          console.error('Erro ao enviar post sem anexos:', err);
          this.isSending = false;
        }
      });
      return;
    }

    // Caso haja anexos, faz upload resumível
    const allItems = [
      ...this.files.map(f => ({ file: f, folder: 'uploads/files' })),
      ...this.images.map(img => ({ file: img, folder: 'uploads/images' }))
    ];

    const totalBytes = allItems.reduce((sum, item) => sum + item.file.size, 0);
    const bytesArr = new Array<number>(allItems.length).fill(0);
    const downloadURLs: string[] = new Array(allItems.length).fill('');

    allItems.forEach((item, idx) => {
      const path = `${item.folder}/${Date.now()}_${item.file.name}`;
      const storageRef = ref(this.storage, path);
      const task = uploadBytesResumable(storageRef, item.file);

      task.on(
        'state_changed',
        snapshot => {
          bytesArr[idx] = snapshot.bytesTransferred;
          const transferred = bytesArr.reduce((a, b) => a + b, 0);
          this.overallUploadProgress = (transferred / totalBytes) * 100;
        },
        error => {
          console.error('Erro no upload:', error);
          this.isSending = false;
        },
        async () => {
          try {
            downloadURLs[idx] = await getDownloadURL(storageRef);
            if (downloadURLs.every(u => !!u)) {
              const files = downloadURLs.slice(0, this.files.length);
              const images = downloadURLs.slice(this.files.length);
              const payload = {
                title: this.enteredTitle,
                content: this.enteredContent,
                videos: this.videos,
                files,
                images,
                disciplinaId: this.subjectId,
                userName: this.userName,
              };
              console.log('Payload com anexos:', payload);
              this.http.post(this.apiUrl, payload).subscribe({
                next: () => {
                  console.log('Post com anexos enviado com sucesso');
                  this.resetState();
                  this.close.emit();
                  window.location.reload();
                },
                error: err => {
                  console.error('Erro ao enviar post com anexos:', err);
                  downloadURLs.forEach(u => deleteObject(ref(this.storage, u)));
                  this.isSending = false;
                }
              });
            } else {
              console.log('Aguardando todas downloadURLs');
            }
          } catch (err) {
            console.error('Erro ao obter downloadURL:', err);
            this.isSending = false;
          }
        }
      );
    });
  }

  /** Reseta todas as variáveis ao estado inicial */
  private resetState(): void {
    this.enteredTitle = '';
    this.enteredContent = '';
    this.enteredUrl = '';
    this.isAttaching = false;
    this.isAddingUrl = false;
    this.videos = [''];
    this.files = [];
    this.images = [];
    this.overallUploadProgress = 0;
    this.isSending = false;
  }
}

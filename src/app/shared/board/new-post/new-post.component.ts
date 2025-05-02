import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-new-post',
  imports: [FormsModule],
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent {
  /** Emite quando o usuário clica em “Cancelar” */
  @Output() close = new EventEmitter<void>();

  /** Emite os dados completos do post ao enviar */
  @Output()
  submitPost = new EventEmitter<{
    title: string;
    content: string;
    url?: string;
    fileUrls: string[];
    imageUrls: string[];
  }>();

  /** Título digitado pelo usuário */
  enteredTitle: string = '';

  /** Conteúdo digitado pelo usuário */
  enteredContent: string = '';

  /** URL de vídeo (YouTube) digitada pelo usuário */
  enteredUrl: string = '';

  /** Controla se a seção de anexos está aberta */
  isAttaching = false;

  /** Controla se o campo de URL está visível */
  isAddingUrl = false;

  /** Arquivos genéricos selecionados */
  files: File[] = [];

  /** Imagens selecionadas */
  images: File[] = [];

  /** URLs de download dos arquivos após upload */
  private fileDownloadURLs: string[] = [];

  /** URLs de download das imagens após upload */
  private imageDownloadURLs: string[] = [];

  /**
   * @param storage Cliente de Storage do Firebase para upload de blobs
   */
  constructor(private storage: Storage) {}

  /**
   * Fecha o diálogo e reseta o estado interno.
   */
  onCancel(): void {
    this.resetState();
    this.close.emit();
  }

  /**
   * Alterna visibilidade da seção de anexos.
   */
  onSelectAttach(): void {
    this.isAttaching = !this.isAttaching;
    if (!this.isAttaching) {
      this.isAddingUrl = false;
      this.enteredUrl = '';
    }
  }

  /**
   * Alterna visibilidade do campo de URL de vídeo.
   */
  onSelectAddUrl(): void {
    this.isAddingUrl = !this.isAddingUrl;
    if (!this.isAddingUrl) {
      this.enteredUrl = '';
    }
  }

  /**
   * Quando o usuário seleciona arquivos genéricos,
   * faz upload de cada um e armazena a URL resultante.
   * @param event Evento do <input type="file">
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach(file => {
      this.files.push(file);
      this.uploadSingleFile(file)
        .then(url => this.fileDownloadURLs.push(url))
        .catch(err => console.error('Erro upload arquivo:', err));
    });
  }

  /**
   * Quando o usuário seleciona imagens,
   * faz upload de cada uma e armazena a URL resultante.
   * @param event Evento do <input type="file" accept="image/*">
   */
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach(img => {
      this.images.push(img);
      this.uploadSingleFile(img)
        .then(url => this.imageDownloadURLs.push(url))
        .catch(err => console.error('Erro upload imagem:', err));
    });
  }

  /**
   * Faz o upload de um único File e retorna uma Promise
   * que resolve com a URL de download.
   * @param file Blob ou File a ser enviado
   * @returns Promise<string> URL pública após upload
   */
  private uploadSingleFile(file: File): Promise<string> {
    const path = `uploads/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, path);

    return new Promise((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, file);
      task.on(
        'state_changed',
        () => {
          // progresso pode ser lido aqui, se necessário
        },
        error => reject(error),
        async () => {
          try {
            const url = await getDownloadURL(storageRef);
            resolve(url);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  }

  /**
   * Quando o usuário submete o form,
   * emite todos os dados (título, conteúdo, URL, fileUrls, imageUrls).
   */
  onPost(): void {
    this.submitPost.emit({
      title: this.enteredTitle,
      content: this.enteredContent,
      url: this.enteredUrl || undefined,
      fileUrls: this.fileDownloadURLs,
      imageUrls: this.imageDownloadURLs
    });
    this.resetState();
  }

  /**
   * Reseta todas as variáveis ao estado inicial.
   */
  private resetState(): void {
    this.enteredTitle = '';
    this.enteredContent = '';
    this.enteredUrl = '';
    this.isAttaching = false;
    this.isAddingUrl = false;
    this.files = [];
    this.images = [];
    this.fileDownloadURLs = [];
    this.imageDownloadURLs = [];
  }
}

import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from '@angular/fire/storage';

@Component({
  selector: 'app-new-post',
  imports: [FormsModule, CommonModule],
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent {

  /** ID da matéria (recebido como parâmetro) */
  subjectID!: string;

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
  /** Controla o clique no botão de enviar */
  isSending = false;

  /** Lista de arquivos selecionados para upload futuro */
  files: File[] = [];
  /** Lista de imagens selecionadas para upload futuro */
  images: File[] = [];

  /** Percentual geral de upload (0–100) */
  overallUploadProgress = 0;

  /**
   * Construtor do componente.
   * @param auth  - Auth do Firebase para obter usuário atual.
   * @param http  - HttpClient para requisições HTTP.
   * @param route - ActivatedRoute para parâmetros de rota.
   */
  constructor(
    /** Referência ao serviço de autenticação do Firebase */
    private auth: Auth,
    /** Referência ao backend */
    private http: HttpClient,
    /** Referência ao serviço de armazenamento do Firebase */
    private storage: Storage
  ) { }

  /** Fecha o diálogo e reseta o estado */
  onCancel(): void {
    this.resetState();
    this.close.emit();
  }

  /** Alterna a visibilidade da seção de anexos */
  onSelectAttach(): void {
    this.isAttaching = !this.isAttaching;
    if (!this.isAttaching) {
      this.isAddingUrl = false;
      this.enteredUrl = '';
    }
  }

  /** Alterna a visibilidade do campo de URL */
  onSelectAddUrl(): void {
    this.isAddingUrl = !this.isAddingUrl;
    if (!this.isAddingUrl) this.enteredUrl = '';
  }

  /** Adiciona arquivos à lista local (sem upload) */
  onFileSelected(event: Event): void {
    const input = (event.target as HTMLInputElement);
    if (input.files) {
      this.files.push(...Array.from(input.files));
    }
  }

  /** Adiciona imagens à lista local (sem upload) */
  onImageSelected(event: Event): void {
    const input = (event.target as HTMLInputElement);
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
   * Agrupa as URLs por extensão de arquivo.
   */
  private groupByExtension(urls: string[]): Record<string, string[]> {
    return urls.reduce((acc, url) => {
      const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
      const ext = match ? match[1].toLowerCase() : 'unknown';
      if (!acc[ext]) {
        acc[ext] = [];
      }
      acc[ext].push(url);
      return acc;
    }, {} as Record<string, string[]>);
  }

  /**
   * Faz upload resumível de cada arquivo e imagem, atualizando o progresso geral.
   */
  onPost(): void {
    let isSending = true;
    // Combina arquivos e imagens
    const allFiles = [
      ...this.files.map(f => ({ file: f, folder: 'uploads/files' })),
      ...this.images.map(img => ({ file: img, folder: 'uploads/images' }))
    ];

    /** Total de bytes a serem enviados */
    const totalBytes = allFiles.reduce((sum, item) => sum + item.file.size, 0);
    /** Array para guardar bytes enviados por tarefa */
    const bytesTransferredArr = new Array(allFiles.length).fill(0);
    /** Array para URLs de download */
    const downloadURLs: string[] = new Array(allFiles.length);

    allFiles.forEach((item, idx) => {
      const path = `${item.folder}/${Date.now()}_${item.file.name}`;
      const storageRef = ref(this.storage, path);
      const task = uploadBytesResumable(storageRef, item.file);

      task.on(
        'state_changed',
        snapshot => {
          /** Atualiza bytes enviados para esta tarefa */
          bytesTransferredArr[idx] = snapshot.bytesTransferred;
          /** Calcula progresso geral */
          const transferred = bytesTransferredArr.reduce((a, b) => a + b, 0);
          this.overallUploadProgress = (transferred / totalBytes) * 100;
        },
        error => {
          console.error('Erro no upload:', error);
        },
        async () => {
          try {
            const url = await getDownloadURL(storageRef);
            downloadURLs[idx] = url;
            // Se todas as URLs estiverem definidas, envia ao backend
            if (downloadURLs.every(u => !!u)) {
              /** URLs separados */
              const fileUrls = downloadURLs.slice(0, this.files.length);
              console.log('fileUrls:', fileUrls);
              /** URLs de imagem */
              const imageUrls = downloadURLs.slice(this.files.length);
              console.log('fileUrls:', fileUrls);
              /** Agrupa arquivos por extensão */
              const groupedFiles = this.groupByExtension(fileUrls);
              console.log('groupedFiles:', groupedFiles);
              
              const payload = {
                title: this.enteredTitle,
                //disciplineId: subjectID,
                content: this.enteredContent,
                files: groupedFiles,
                url: this.enteredUrl || undefined,
                uid: this.auth.currentUser?.uid,
                imageUrls
              };
              this.http.post(this.apiUrl, payload).subscribe({
                next: res => {
                  console.log('Post enviado:', res);
                  this.resetState();
                  this.close.emit();
                },
                error: err => {
                  console.error('Erro ao enviar post:', err);
                  // Tenta deletar arquivos se o envio falhar
                  fileUrls.forEach(url => {
                    const fileRef = ref(this.storage, url);
                    deleteObject(fileRef)
                      .then(() => console.log('Arquivo deletado:', url))
                      .catch(err => console.error('Erro ao deletar arquivo:', err));
                  });
                }
              })
            }
          } catch (err) {
            console.error('Erro ao obter downloadURL:', err);
          }
        }
      );
    });
    isSending = false;
  }

  /** Reseta todas as variáveis ao estado inicial */
  private resetState(): void {
    this.enteredTitle = '';
    this.enteredContent = '';
    this.enteredUrl = '';
    this.isAttaching = false;
    this.isAddingUrl = false;
    this.files = [];
    this.images = [];
    this.overallUploadProgress = 0;
  }
}

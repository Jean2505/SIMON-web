import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '@angular/fire/storage';
import { Discipline } from '../../../models/discipline.model';

@Component({
  selector: 'app-new-post',
  imports: [FormsModule, CommonModule],
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {

  @Input() subject!: Discipline;

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
   * @param auth    - Auth do Firebase para obter usuário atual.
   * @param http    - HttpClient para requisições HTTP.
   * @param storage - Storage do Firebase para upload de arquivos.
   */
  constructor(
    /** Referência ao serviço de autenticação do Firebase */
    private auth: Auth,
    /** Referência ao backend */
    private http: HttpClient,
    /** Referência ao serviço de armazenamento do Firebase */
    private storage: Storage
  ) { }

  ngOnInit(): void {
    console.log(this.subject);
  }

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
      (acc[ext] ??= []).push(url);
      return acc;
    }, {} as Record<string, string[]>);
  }


  /**
   * Faz upload resumível de cada arquivo e imagem, atualizando o progresso geral.
   */
  async onPost(): Promise<void> {
    // 1) Combina arquivos e imagens em uma única lista
    const allFiles = [
      ...this.files.map(f => ({ file: f, folder: 'uploads/files' })),
      ...this.images.map(img => ({ file: img, folder: 'uploads/images' }))
    ];

    // 2) Opcional: total de bytes para calcular progresso geral
    const totalBytes = allFiles.reduce((sum, item) => sum + item.file.size, 0);
    let bytesTransferred = 0;

    // 3) Cria um array de Promises, uma para cada upload
    const uploadPromises = allFiles.map(item =>
      new Promise<string>((resolve, reject) => {
        const path = `${item.folder}/${Date.now()}_${item.file.name}`;
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, item.file);

        task.on(
          'state_changed',
          snapshot => {
            // atualiza progresso geral
            bytesTransferred += snapshot.bytesTransferred - bytesTransferred;
            this.overallUploadProgress = (bytesTransferred / totalBytes) * 100;
          },
          err => reject(err),
          async () => {
            try {
              const url = await getDownloadURL(storageRef);
              resolve(url);
            } catch (e) {
              reject(e);
            }
          }
        );
      })
    );

    try {
      // 4) Aguarda todos os uploads terminarem
      const downloadURLs = await Promise.all(uploadPromises);

      // 5) Separa fileUrls e imageUrls
      const fileUrls = downloadURLs.slice(0, this.files.length);
      const imageUrls = downloadURLs.slice(this.files.length);

      // 6) Agrupa arquivos por extensão
      const groupedFiles = this.groupByExtension(fileUrls);

      // 7) Monta o payload e envia ao backend
      const payload = {
        title: this.enteredTitle,
        disciplineId: this.subject.id,
        content: this.enteredContent,
        files: groupedFiles,
        url: this.enteredUrl || undefined,
        uid: this.auth.currentUser?.uid,
        images: imageUrls || undefined
      };

      this.http.post(this.apiUrl, payload).subscribe({
        next: () => {
          console.log('Post enviado com sucesso');
          // this.resetState();
          // this.close.emit();
        },
        error: err => {
          console.error('Erro ao enviar post:', err);
        }
      });

    } catch (err) {
      console.error('Erro no upload:', err);
    }
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

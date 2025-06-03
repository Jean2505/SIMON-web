import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { type MuralPost } from '../../../models/mural-post.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-post',
  imports: [MatIconModule, MatListModule, CommonModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post!: MuralPost;
  
  @Output() close = new EventEmitter<void>();

  zoomedImageSrc: string | null = null;
  currentImageIndex: number = 0;
  
  /** Lista de itens de arquivo com nome, URL e ícone */
  fileItems: { name: string; url: string; icon: string }[] = [];

  constructor(
    /** Referência ao backend para requisições HTTP @type {HttpClient} */
    private http: HttpClient,
    /** Inicializa o sanitizer @type {DomSanitizer} */
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const EXT_ICON_MAP: Record<string, string> = {
      pdf: 'picture_as_pdf',
      doc: 'description',
      docx: 'description',
      xls: 'table_chart',
      xlsx: 'table_chart',
      zip: 'archive',
      rar: 'archive',
      jpg: 'image',
      png: 'image',
      gif: 'image',
      mp4: 'videocam',
      mp3: 'audiotrack',
      exe: 'memory',
    };
    this.fileItems = this.post.files.map(url => {
      const clean = url.split('?')[0];
      const raw = decodeURIComponent(clean.split('/').pop()!);
      const ext = raw.split('.').pop()?.toLowerCase() || '';
      const icon = EXT_ICON_MAP[ext] || 'insert_drive_file';
      return { name: raw, url, icon };
    });
    console.log('fileItems:', this.fileItems);
  }

  /**
   * Sanitiza a URL para uso seguro em recursos externos
   * @param {string} url - A URL a ser sanitizada
   * @returns {SafeResourceUrl} - A URL sanitizada
   */
  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /** Fecha o modal de post */
  onClose() {
    this.close.emit();
  }

  /**
   * Verifica se o post contém imagens
   * @returns {boolean} - Retorna true se houver imagens, caso contrário false
   */
  hasImages(): boolean {
    return Array.isArray(this.post.images) && this.post.images.length > 0;
  }

  /**
   * Verifica se o post contém arquivos
   * @returns {boolean} - Retorna true se houver arquivos, caso contrário false
   */
  hasFiles(): boolean {
    return Array.isArray(this.post.files) && this.post.files.length > 0;
  }

  /**
   * Verifica se o post contém vídeos
   * @returns {boolean} - Retorna true se houver vídeos, caso contrário false
   */
  hasVideos(): boolean {
    return Array.isArray(this.post.videos) && this.post.videos.length > 0;
  }

  /**
   * Exibe a imagem em tamanho ampliado
   * @param {string} src - A URL da imagem a ser ampliada
   * @return {void}
   */
  zoomImage(src: string): void {
    this.zoomedImageSrc = src;
    this.currentImageIndex = (this.post.images as string[]).indexOf(src);
  }

  /**
   * Fecha a visualização ampliada da imagem
   * @return {void}
   */
  closeZoom(): void {
    this.zoomedImageSrc = null;
  }

  /**
   * Retorna a URL da imagem ampliada
   * @returns {SafeResourceUrl | null} - A URL sanitizada da imagem ampliada ou null se não houver imagem ampliada
   */
  getZoomedImageUrl(): SafeResourceUrl | null {
    return this.zoomedImageSrc ? this.sanitizeUrl(this.zoomedImageSrc) : null;
  }

  /**
   * Volta para a imagem anterior na visualização ampliada
   * @param event - Evento de clique para a imagem anterior
   */
  previousImage(event: Event): void {
    event.stopPropagation(); // Impede que o modal feche ao clicar nas setas
    this.currentImageIndex = (this.currentImageIndex - 1 + this.post.images.length) % this.post.images.length;
    this.zoomedImageSrc = this.post.images[this.currentImageIndex];
  }

  /**
   * Avança para a próxima imagem na visualização ampliada
   * @param event - Evento de clique para a próxima imagem
   */
  nextImage(event: Event): void {
    event.stopPropagation(); // Impede que o modal feche ao clicar nas setas
    this.currentImageIndex = (this.currentImageIndex + 1) % this.post.images.length;
    this.zoomedImageSrc = this.post.images[this.currentImageIndex];
  }

  /**
   * Deleta o post
   * @param postContent - Conteúdo do post a ser deletado
   */
  onDeletePost(postContent: string): void {
    this.http.post('http://localhost:3000/deleteMuralPost', { postContent })
      .subscribe({
        next: () => {
          console.log('Post deletado com sucesso');
         window.location.reload(); // Recarrega a página para refletir a exclusão
        },
        error: (error) => {
          console.error('Erro ao deletar post:', error);
        }
      });
  }

}

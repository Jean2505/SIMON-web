import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../../models/post.model';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  @Input() post!: Post;
  @Output() close = new EventEmitter<void>();

  postT: Post = {
    title: 'Post Exemplo',
    posterName: 'João',
    date: '2025-05-08',
    content: 'Veja os anexos abaixo!',
    images: ['/gosling.jpg', '/simons.png'],
    postId: ''
  };

  onClose() {
    this.close.emit();
  }

  zoomedImageSrc: string | null = null;
  currentImageIndex: number = 0;
  
  zoomImage(src: string): void {
    this.zoomedImageSrc = src;
    this.currentImageIndex = this.postT.images.indexOf(src); // Armazena o índice da imagem
  }
  
  closeZoom(): void {
    this.zoomedImageSrc = null;
  }
  
  previousImage(event: Event): void {
    event.stopPropagation(); // Impede que o modal feche ao clicar nas setas
    this.currentImageIndex = (this.currentImageIndex - 1 + this.postT.images.length) % this.postT.images.length;
    this.zoomedImageSrc = this.postT.images[this.currentImageIndex];
  }
  
  nextImage(event: Event): void {
    event.stopPropagation(); // Impede que o modal feche ao clicar nas setas
    this.currentImageIndex = (this.currentImageIndex + 1) % this.postT.images.length;
    this.zoomedImageSrc = this.postT.images[this.currentImageIndex];
  }
  
}

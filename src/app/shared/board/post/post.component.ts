import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../../models/post.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  @Input() post!: Post;
  @Output() close = new EventEmitter<void>();

  constructor(private sanitizer: DomSanitizer) { }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onClose() {
    this.close.emit();
  }

  zoomedImageSrc: string | null = null;
  currentImageIndex: number = 0;

  zoomImage(src: string): void {
    this.zoomedImageSrc = src;
    this.currentImageIndex = (this.post.images as string[]).indexOf(src);
  }

  closeZoom(): void {
    this.zoomedImageSrc = null;
  }

  previousImage(event: Event): void {
    event.stopPropagation(); // Impede que o modal feche ao clicar nas setas
    this.currentImageIndex = (this.currentImageIndex - 1 + this.post.images.length) % this.post.images.length;
    this.zoomedImageSrc = this.post.images[this.currentImageIndex];
  }

  nextImage(event: Event): void {
    event.stopPropagation(); // Impede que o modal feche ao clicar nas setas
    this.currentImageIndex = (this.currentImageIndex + 1) % this.post.images.length;
    this.zoomedImageSrc = this.post.images[this.currentImageIndex];
  }

}

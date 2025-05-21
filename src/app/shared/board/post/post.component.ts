import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { type MuralPost } from '../../../models/mural-post.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

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
  
  fileItems: { name: string; url: string; icon: string }[] = [];

  constructor(private sanitizer: DomSanitizer) { }

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

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onClose() {
    this.close.emit();
  }

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

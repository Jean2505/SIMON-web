import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostComponent } from './post.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MuralPost } from '../../../models/mural-post.model';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let sanitizer: DomSanitizer;

  const mockPost: MuralPost = {
    disciplinaId: 'd01',
    title: 'Título do Post',
    content: 'Conteúdo do post',
    userName: 'UsuárioTeste',
    createdAt: new Date,
    images: ['https://exemplo.com/img1.png', 'https://exemplo.com/img2.png'],
    videos: ['https://www.youtube.com/embed/123456'],
    files: ['https://site.com/pasta/arquivo.pdf?token=abc123']
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, MatIconModule, MatListModule, NoopAnimationsModule],
      declarations: [PostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    component.post = mockPost;
    sanitizer = TestBed.inject(DomSanitizer);
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar e mapear arquivos corretamente com ícones', () => {
    component.ngOnInit();
    expect(component.fileItems.length).toBe(1);
    expect(component.fileItems[0].name).toBe('arquivo.pdf');
    expect(component.fileItems[0].icon).toBe('picture_as_pdf');
  });

  it('deve emitir o evento close ao chamar onClose()', () => {
    spyOn(component.close, 'emit');
    component.onClose();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('deve aplicar sanitizer na URL do vídeo', () => {
    const safeUrl = component.sanitizeUrl(mockPost.videos[0]);
    expect(safeUrl).toBeTruthy();
  });

  it('deve abrir a imagem em zoom ao chamar zoomImage()', () => {
    const imageUrl = mockPost.images[1];
    component.zoomImage(imageUrl);
    expect(component.zoomedImageSrc).toBe(imageUrl);
    expect(component.currentImageIndex).toBe(1);
  });

  it('deve fechar o zoom corretamente ao chamar closeZoom()', () => {
    component.zoomedImageSrc = 'alguma-coisa';
    component.closeZoom();
    expect(component.zoomedImageSrc).toBeNull();
  });

  it('deve navegar para imagem anterior corretamente', () => {
    component.zoomImage(mockPost.images[0]); // index 0
    const fakeEvent = new Event('click');
    spyOn(fakeEvent, 'stopPropagation');
    component.previousImage(fakeEvent);
    expect(fakeEvent.stopPropagation).toHaveBeenCalled();
    expect(component.zoomedImageSrc).toBe(mockPost.images[1]); // último da lista
  });

  it('deve navegar para próxima imagem corretamente', () => {
    component.zoomImage(mockPost.images[1]); // index 1
    const fakeEvent = new Event('click');
    spyOn(fakeEvent, 'stopPropagation');
    component.nextImage(fakeEvent);
    expect(fakeEvent.stopPropagation).toHaveBeenCalled();
    expect(component.zoomedImageSrc).toBe(mockPost.images[0]); // volta ao início
  });
});

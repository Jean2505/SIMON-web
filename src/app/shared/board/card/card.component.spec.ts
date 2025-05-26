import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { MuralPost } from '../../../models/mural-post.model';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  const mockPost: MuralPost = {
    disciplinaId: 'd01',
    title: 'Título de Exemplo',
    content: 'Conteúdo do post de exemplo.',
    userName: 'Usuário Teste',
    createdAt: new Date(),
    files: [],
    images: [],
    videos: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    component.post = { ...mockPost };
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o título e o conteúdo do post', () => {
    const title = fixture.debugElement.query(By.css('.post-title')).nativeElement.textContent;
    const content = fixture.debugElement.query(By.css('.post-body')).nativeElement.textContent;

    expect(title).toContain(mockPost.title);
    expect(content).toContain(mockPost.content);
  });

  it('não deve exibir o ícone de anexo se não houver arquivos, imagens ou vídeos', () => {
    const icon = fixture.debugElement.query(By.css('svg.bi-paperclip'));
    expect(icon).toBeNull();
  });

  it('deve exibir o ícone de anexo quando houver arquivos', () => {
    component.post.files = ['file.pdf'];
    component.ngOnInit(); // reexecuta lógica de inicialização
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('svg.bi-paperclip'));
    expect(icon).toBeTruthy();
  });

  it('deve abrir o post quando clicado e definir isViewingPost como true', () => {
    const card = fixture.debugElement.query(By.css('.post-card'));
    card.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.isViewingPost).toBeTrue();
  });

  it('deve fechar o post ao chamar onClosePost()', () => {
    component.onOpenPost();
    expect(component.isViewingPost).toBeTrue();

    component.onClosePost();
    expect(component.isViewingPost).toBeFalse();
  });

});


import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { User } from 'firebase/auth';

import { type Discipline } from '../../models/discipline.model';

import { SideBarComponent } from './side-bar/side-bar.component';
import { SessionStorageService } from '../../core/services/session-storage.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [CommonModule, SideBarComponent, RouterOutlet],
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss'],
})
export class SubjectComponent implements OnInit, OnDestroy {
  /** Role do usuário
   *
   * `ALUNO`, `MONITOR`, `PROFESSOR`, `INSTITUICAO`
   */
  role: string | null = null;

  /** Usuário */
  user: User | null = null;

  /** ID da matéria recuperada da rota */
  subjectId = '';

  subject: Discipline = {
    id: '',
    course: '',
    name: '',
    professor: '',
    term: 0,
    tutoringEnabled: false
  };

  /**
   * Injetar o serviço de rota ativa para leitura dos parâmetros.
   * @param auth  - serviço de autenticação do Firebase
   * @param http  - serviço HTTP do Angular para fazer requisições
   * @param route - serviço do Angular para obter dados da rota atual
   */
  constructor(
    /** Referência ao serviço de armazenamento em sessão @type {SessionStorageService} */
    private sessionStorage: SessionStorageService,
    /** Referência ao cabeçalho para manipulação do título @type {HeaderComponent} */
    private headerComponent: HeaderComponent
  ) {} // Injeta o ActivatedRoute para acessar parâmetros de rota

  /** Método chamado quando o componente é inicializado */
  ngOnInit(): void {
    // obtém matéria a partir da SessionStorage
    this.subject =
      this.sessionStorage.getAllDataFromKey('selectedDiscipline') ||
      this.subject;
    console.log('Matéria selecionada:', this.subject);
    setTimeout(() => {
      this.headerComponent.setHeaderTitle(this.subject.name);
      console.log('Título do cabeçalho definido:', this.subject.name);
    });
  }

  /** Método chamado quando o componente é destruído */
  ngOnDestroy(): void {
    // Limpa o título do cabeçalho ao destruir o componente
    this.headerComponent.setHeaderTitle('');
  }
}

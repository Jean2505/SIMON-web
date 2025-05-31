import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { HttpClient } from '@angular/common/http';

import { type Discipline } from '../../models/discipline.model';

import { SideBarComponent } from './side-bar/side-bar.component';
import { SessionStorageService } from '../../core/services/session-storage.service';
import { HeaderComponent } from '../header/header.component';
import { HeaderService } from '../../core/services/header.service';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [CommonModule, SideBarComponent, RouterOutlet],
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {

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
    term: 0
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
    /** Referência ao serviço de cabeçalho para manipulação do título @type {HeaderService} */
    private headerService: HeaderService,
  ) { } // Injeta o ActivatedRoute para acessar parâmetros de rota

  /** Método chamado quando o componente é inicializado */
  ngOnInit(): void {
    // obtém matéria a partir da SessionStorage
    this.subject = this.sessionStorage.getAllDataFromKey('selectedDiscipline') || this.subject;
    console.log('Matéria selecionada:', this.subject);
    //this.headerService.setHeaderTitle(this.subject.name); // Define o título do header com o nome da matéria
  }
}

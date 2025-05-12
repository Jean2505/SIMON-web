import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { User } from 'firebase/auth';
import { HttpClient } from '@angular/common/http';

import { type Discipline } from '../../models/discipline.model';

import { SideBarComponent } from './side-bar/side-bar.component';

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
    /** Referência ao serviço de autenticação do Firebase */
    private auth: Auth,
    /** Referência ao backend */
    private http: HttpClient,
    /** Referência ao serviço de rota atual do Angular */
    private route: ActivatedRoute
  ) { } // Injeta o ActivatedRoute para acessar parâmetros de rota

  /** Método chamado quando o componente é inicializado */
  ngOnInit(): void {
  }
}

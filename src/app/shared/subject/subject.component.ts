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
  async ngOnInit(): Promise<void> {
    let user = this.auth.currentUser;
    const idTokenResult = await user!.getIdTokenResult(true);
    // pega o campo "role" dos claims
    this.role = (idTokenResult.claims['role'] as string) ?? null;
    console.log('Role do usuário:', this.role);
    // Recupera o ID da matéria a partir dos parâmetros da rota
    this.route.paramMap.subscribe(params => {
      this.subjectId = params.get('id') ?? '';
    });
    this.http.get('http://localhost:3000/discipline', { params: { disciplineId: this.subjectId } }).subscribe({
      next: (response: any) => {
        this.subject.id = response[0].id_Disciplina;
        this.subject.course = response[0].curso_Disciplina;
        this.subject.name = response[0].nome_Disciplina;
        this.subject.professor = response[0].professor_Disciplina;
        this.subject.term = response[0].periodo_Disciplina;
      },
      error: (error) => {
        console.error('Erro ao carregar disciplina:', error);
      }
    });
  }

  /**
   * Recebe a instância do componente ativado no router-outlet e faz a injeção do subjectId.
   */
  onChildActivate(child: any): void {
    // Método chamado quando um componente filho é ativado
    child.subject = this.subject;
  }
}

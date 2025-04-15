import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';

// Imports do Angular Firestore (API modular)
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

import { DisciplineComponent } from './discipline/discipline.component';
import { Discipline } from './discipline/discipline.model';

interface Escola {
  escolaId: string;
  name: string;
}

interface Curso {
  cursoId: string;
  escolaId: string;
  name: string;
}

@Component({
  selector: 'app-institution-manage-subjects',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    DisciplineComponent
  ],
  templateUrl: './manage-subjects.component.html',
  styleUrls: ['./manage-subjects.component.scss']
})
export class InstitutionManageSubjectsComponent implements OnInit {

  // Seleção dos dropdowns
  selectedEscolaId?: string;
  selectedCursoId!: string;

  // Dados carregados dinamicamente do backend (SQLite)
  escolas: Escola[] = [];
  cursos: Curso[] = [];

  // Disciplinas carregadas do Firebase (após sincronização)
  disciplinasAparentes: Discipline[] = [];

  // Flags de carregamento
  loadingSchools: boolean = false;
  loadingCourses: boolean = false;
  loadingDisciplinas: boolean = false;
  loadingSync: boolean = false;

  constructor(private http: HttpClient, private firestore: Firestore) { }

  ngOnInit() {
    this.loadSchools();
  }

  // Carrega as escolas do backend (SQLite)
  loadSchools() {
    this.loadingSchools = true;
    this.http.get<Escola[]>('http://localhost:3000/schools')
      .subscribe({
        next: (data) => {
          this.escolas = data;
          this.loadingSchools = false;
        },
        error: (err) => {
          console.error("Erro ao carregar escolas:", err);
          this.loadingSchools = false;
        }
      });
  }

  // Ao selecionar uma escola, carrega os cursos associados a ela do backend
  onSelectEscola(escolaId: string) {
    this.selectedEscolaId = escolaId;
    // Limpa a seleção de cursos e disciplinas anteriores
    this.cursos = [];
    this.selectedCursoId = '';
    this.disciplinasAparentes = [];
    // Carrega os cursos para a escola selecionada
    this.loadCourses(escolaId);
  }

  // Carrega os cursos para a escola selecionada
  loadCourses(escolaId: string) {
    this.loadingCourses = true;
    // Supondo que o endpoint aceite o parâmetro "school" com o ID da escola
    this.http.get<Curso[]>('http://localhost:3000/courses', { params: { school: escolaId } })
      .subscribe({
        next: (data) => {
          this.cursos = data;
          this.loadingCourses = false;
        },
        error: (err) => {
          console.error("Erro ao carregar cursos:", err);
          this.loadingCourses = false;
        }
      });
  }

  // Ao selecionar um curso, consulta as disciplinas do Firebase (que foram sincronizadas via backend)
  // Método atualizado do inst-manage.component.ts para buscar disciplinas usando a Firebase Function
  onSelectCurso(cursoId: string) {
    this.selectedCursoId = cursoId;
    this.loadingDisciplinas = true;

    // Supondo que você tenha a lista de cursos carregada em `this.cursos`,
    // busque o objeto do curso selecionado (para obter o nome).
    const selectedCourse = this.cursos.find(c => c.cursoId === cursoId);
    if (!selectedCourse) {
      console.error('Curso não encontrado');
      this.loadingDisciplinas = false;
      return;
    }

    const payload = { course: selectedCourse.name };
    console.log(payload);

    // Agora chama a rota do SEU backend (server.js), não a da Cloud Function
    this.http.post('http://localhost:3000/getExternalCourses', payload)
      .subscribe({
        next: (response: any) => {
          console.log('Matérias recebidas:', JSON.stringify(response.payload));
          // Se 'payload' for string, faça o parse
          if (response.payload && typeof response.payload === 'string') {
            this.disciplinasAparentes = JSON.parse(response.payload);
          } else {
            this.disciplinasAparentes = response.payload;
          }
        },
        error: (err) => {
          console.error('Erro ao obter matérias da rota local:', err);
        }
      });

  }

  // Sincroniza os dados de disciplinas do SQLite para o Firebase via backend
  onLoadCourses() {
    if (!this.selectedEscolaId || !this.selectedCursoId) {
      alert("Selecione uma escola e um curso antes de carregar as matérias.");
      return;
    }
    // Busca os objetos da escola e do curso selecionados (para enviar os nomes, se necessário)
    const selectedEscola = this.escolas.find(e => e.escolaId === this.selectedEscolaId);
    const selectedCurso = this.cursos.find(c => c.cursoId === this.selectedCursoId);
    if (!selectedEscola || !selectedCurso) {
      alert("Seleção inválida!");
      return;
    }
    // Os parâmetros aqui podem ser ajustados conforme o que seu backend espera (por exemplo, o nome da escola e do curso)
    const params = {
      school: selectedEscola.name,
      major: selectedCurso.name
    };

    this.loadingSync = true;
    this.http.get('http://localhost:3000/loadCourses', { params })
      .subscribe({
        next: (resp) => {
          console.log("Sincronização concluída, matérias carregadas para o Firebase:", resp);
          this.loadingSync = false;
          // Atualiza as disciplinas após a sincronização
          this.onSelectCurso(this.selectedCursoId);
        },
        error: (err) => {
          console.error("Erro na sincronização:", err);
          this.loadingSync = false;
        }
      });
  }

  // Getter para facilitar a verificação do curso selecionado
  get selectedCurso() {
    return this.cursos.find(curso => curso.cursoId === this.selectedCursoId);
  }

  // Funções trackBy para otimizar os *ngFor
  trackByEscola(index: number, escola: Escola): string {
    return escola.escolaId;
  }

  trackByCurso(index: number, curso: Curso): string {
    return curso.cursoId;
  }

  trackByDisciplina(index: number, disciplina: Discipline): string {
    return disciplina.id;
  }
}

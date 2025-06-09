import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';

import { DisciplineComponent } from './discipline/discipline.component';
import { BackButtonComponent } from '../../shared/buttons/back-button/back-button.component';

import { type Discipline } from '../../models/discipline.model';

/**
 * Representa uma escola no sistema.
 * @property escolaId - Identificador único da escola.
 * @property name     - Nome da escola exibido ao usuário.
 */
interface School {
  escolaId: string;
  name: string;
}

/**
 * Representa um curso vinculado a uma escola.
 * @property name     - Nome do curso exibido ao usuário.
 * @property school   - Nome da escola à qual o curso pertence.
 */
interface Major {
  name: string;
  school: string;
}

interface Subject {
  disciplinaId: string;
  nome: string;
}

@Component({
  selector: 'app-institution-manage-subjects', // Seletor HTML para usar este componente
  standalone: true, // Componente standalone sem NgModule externo
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    DisciplineComponent,
    BackButtonComponent,
  ],
  templateUrl: './manage-subjects.component.html', // Caminho para o template HTML
  styleUrls: ['./manage-subjects.component.scss'], // Caminho para estilos SCSS
})
export class InstitutionManageSubjectsComponent implements OnInit {
  /** ID da escola atualmente selecionada no dropdown */
  selectedSchoolId?: string;

  /** Nome do curso atualmente selecionado no dropdown */
  selectedMajorName!: string;

  /**
   * Lista de escolas carregadas do backend (SQLite)
   * @type {School[]}
   * @property {string} escolaId - Identificador único da escola
   * @property {string} name     - Nome da escola exibido ao usuário
   */
  schools: School[] = [];

  /**
   * Lista de cursos carregados do backend para a escola selecionada
   * @type {Major[]}
   * @property {string} cursoId  - Identificador único do curso
   * @property {string} escolaId - Identificador da escola ao qual o curso pertence
   * @property {string} name     - Nome do curso exibido ao usuário
   */
  majors: Major[] = [];

  /**
   * Lista de disciplinas carregadas do Firebase após sincronização
   * @type {Discipline[]}
   * @property {string} course - ID do curso ao qual a disciplina pertence
   * @property {string} id - ID da disciplina
   * @property {string} [monitors] - Quantidade de monitores para a disciplina (opcional)
   * @property {string} name - Nome da disciplina
   * @property {string} professor - Nome do professor responsável pela disciplina
   * @property {string} school - Nome da escola a qual o curso pertence
   * @property {string} term - Período da disciplina
   */
  subjects: Discipline[] = [];

  /** Flag indicando se as escolas estão sendo carregadas */
  loadingSchools: boolean = false;

  /** Flag indicando se os cursos estão sendo carregados */
  loadingCourses: boolean = false;

  /** Flag indicando se as disciplinas estão sendo carregadas */
  loadingSubjects: boolean = false;

  /** Flag indicando se a sincronização de disciplinas está em andamento */
  loadingSync: boolean = false;

  /**
   * Construtor do componente.
   * @param http - HttpClient para requisições HTTP ao backend.
   */
  constructor(private http: HttpClient) {}

  /**
   * Hook de ciclo de vida Angular.
   * Executado após a construção do componente; inicia o carregamento das escolas.
   */
  ngOnInit(): void {
    this.loadSchools();
  }

  /**
   * Carrega a lista de escolas do backend SQLite.
   * Atualiza a flag `loadingSchools` e popula `this.schools`.
   */
  loadSchools(): void {
    this.loadingSchools = true;
    this.http.get<School[]>('http://localhost:3000/schools').subscribe({
      next: (data) => {
        this.schools = data;
        this.loadingSchools = false;
      },
      error: (err) => {
        console.error('Erro ao carregar escolas:', err);
        this.loadingSchools = false;
      },
    });
  }

  /**
   * Tratador de evento para seleção de escola.
   * Limpa cursos e disciplinas anteriores e inicia o carregamento de cursos.
   * @param schoolId - ID da escola selecionada.
   */
  onSelectSchool(schoolId: string): void {
    this.selectedSchoolId = schoolId;
    this.majors = [];
    this.selectedMajorName = '';
    this.subjects = [];
    this.loadCourses(schoolId);
  }

  /**
   * Carrega a lista de cursos associados à escola selecionada.
   * Atualiza a flag `loadingCourses` e popula `this.courses`.
   * @param school - Nome da escola para consulta dos cursos.
   */
  loadCourses(school: string): void {
    this.loadingCourses = true;
    const payload = {
      school: school,
    };
    console.log('Carregando cursos para a escola:', payload);
    this.http
      .post('http://localhost:3000/getSchoolCourses', payload)
      .subscribe({
        next: (response: any) => {
          const result = JSON.parse(response);
          this.majors = result.map((course: any) => ({
            school: course.school,
            name: course.course,
          }));
          console.log('Cursos carregados:', this.majors);
          this.loadingCourses = false;
        },
        error: (err) => {
          console.error('Erro ao carregar cursos:', err);
          this.loadingCourses = false;
        },
      });
  }

  /**
   * Tratador de evento para seleção de curso.
   * Realiza requisição POST ao backend para obter disciplinas sincronizadas no Firebase.
   * @param majorName - Nome do curso selecionado.
   */
  onSelectCourse(majorName: string): void {
    this.selectedMajorName = majorName;
    this.loadingSubjects = true;

    /**
     * Verifica se o curso selecionado existe na lista de cursos.
     * Se não existir, exibe mensagem de erro e retorna.
     */
    const selectedCourse = this.majors.find((c) => c.name === majorName);
    if (!selectedCourse) {
      console.error('Curso não encontrado');
      this.loadingSubjects = false;
      return;
    }

    const payload = { course: selectedCourse.name };
    this.http
      .post('http://localhost:3000/getExternalCourses', payload)
      .subscribe({
        next: (response: any) => {
          const result = JSON.parse(response);
          console.log('Disciplinas carregadas:', result);
          this.subjects = result.map((subject: any) => ({
            course: subject.course,
            id: subject.id,
            monitors: subject.monitors || 0, // Define 0 se não houver monitores
            name: subject.name,
            professor: subject.professor,
            school: subject.school,
            term: subject.term,
          }));
          this.loadingSubjects = false;
        },
        error: (err) => {
          console.error('Erro ao obter disciplinas externamente:', err);
          this.loadingSubjects = false;
        },
      });
  }

  /**
   * Inicia a sincronização de cursos do SQLite para o Firebase via backend.
   * Verifica pré-condições e faz GET ao endpoint de sincronização.
   */
  onLoadCourses(): void {
    if (!this.selectedSchoolId || !this.selectedMajorName) {
      alert('Selecione uma escola e um curso antes de carregar as matérias.');
      return;
    }

    const selectedSchool = this.schools.find(
      (e) => e.escolaId === this.selectedSchoolId
    )!;
    const selectedCourse = this.majors.find(
      (c) => c.name === this.selectedMajorName
    )!;
    const params = { school: selectedSchool.name, major: selectedCourse.name };

    this.loadingSync = true;
    this.http.get('http://localhost:3000/loadCourses', { params }).subscribe({
      next: (resp) => {
        console.log('Sincronização concluída:', resp);
        this.loadingSync = false;
        this.onSelectCourse(this.selectedMajorName);
      },
      error: (err) => {
        console.error('Erro na sincronização:', err);
        this.loadingSync = false;
      },
    });
  }

  /**
   * Getter para obter o objeto do curso atualmente selecionado.
   */
  get selectedCourse(): Major | undefined {
    return this.majors.find((c) => c.name === this.selectedMajorName);
  }

  /**
   * trackBy para otimização de *ngFor em escolas.
   * @param index  - Índice do item no array.
   * @param school - Objeto School corrente.
   * @returns ID único da escola para rastreamento.
   */
  trackBySchool(index: number, school: School): string {
    return school.escolaId;
  }

  /**
   * trackBy para otimização de *ngFor em cursos.
   * @param index  - Índice do item no array.
   * @param course - Objeto Course corrente.
   * @returns ID único do curso para rastreamento.
   */
  trackByCourse(index: number, course: Major): string {
    return course.name;
  }

  /**
   * trackBy para otimização de *ngFor em disciplinas.
   * @param index   - Índice do item no array.
   * @param subject - Objeto Discipline corrente.
   * @returns ID único da disciplina para rastreamento.
   */
  trackBySubject(index: number, subject: Discipline): string {
    return subject.id;
  }
}

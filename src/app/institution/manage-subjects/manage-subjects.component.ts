import { Component, OnInit } from '@angular/core';  
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';  
import { MatFormFieldModule } from '@angular/material/form-field';  
import { MatSelectModule } from '@angular/material/select';  
import { MatIconModule } from '@angular/material/icon';  
import { MatCardModule } from '@angular/material/card';  
import { HttpClient } from '@angular/common/http';  

import { DisciplineComponent } from './discipline/discipline.component';  
import { Discipline } from '../../models/discipline.model';  

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
 * @property cursoId  - Identificador único do curso.
 * @property escolaId - Identificador da escola ao qual o curso pertence.
 * @property name     - Nome do curso exibido ao usuário.
 */
interface Course {
  cursoId: string;
  escolaId: string;
  name: string;
}

@Component({
  selector: 'app-institution-manage-subjects',    // Seletor HTML para usar este componente
  standalone: true,                               // Componente standalone sem NgModule externo
  imports: [                                      // Dependências necessárias no template
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    DisciplineComponent
  ],
  templateUrl: './manage-subjects.component.html',  // Caminho para o template HTML
  styleUrls: ['./manage-subjects.component.scss']    // Caminho para estilos SCSS
})
export class InstitutionManageSubjectsComponent implements OnInit {
  /** ID da escola atualmente selecionada no dropdown */
  selectedSchoolId?: string;

  /** ID do curso atualmente selecionado no dropdown */
  selectedCourseId!: string;

  /** Lista de escolas carregadas do backend (SQLite) */
  schools: School[] = [];

  /** Lista de cursos carregados do backend para a escola selecionada */
  courses: Course[] = [];

  /** Lista de disciplinas carregadas do Firebase após sincronização */
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
  constructor(private http: HttpClient) { }

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
    this.http.get<School[]>('http://localhost:3000/schools')
      .subscribe({
        next: data => {
          this.schools = data;
          this.loadingSchools = false;
        },
        error: err => {
          console.error('Erro ao carregar escolas:', err);
          this.loadingSchools = false;
        }
      });
  }

  /**
   * Tratador de evento para seleção de escola.
   * Limpa cursos e disciplinas anteriores e inicia o carregamento de cursos.
   * @param schoolId - ID da escola selecionada.
   */
  onSelectSchool(schoolId: string): void {
    this.selectedSchoolId = schoolId;
    this.courses = [];
    this.selectedCourseId = '';
    this.subjects = [];
    this.loadCourses(schoolId);
  }

  /**
   * Carrega a lista de cursos associados à escola selecionada.
   * Atualiza a flag `loadingCourses` e popula `this.courses`.
   * @param schoolId - ID da escola para consulta dos cursos.
   */
  loadCourses(schoolId: string): void {
    this.loadingCourses = true;
    this.http.get<Course[]>('http://localhost:3000/courses', { params: { school: schoolId } })
      .subscribe({
        next: data => {
          this.courses = data;
          this.loadingCourses = false;
        },
        error: err => {
          console.error('Erro ao carregar cursos:', err);
          this.loadingCourses = false;
        }
      });
  }

  /**
   * Tratador de evento para seleção de curso.
   * Realiza requisição POST ao backend para obter disciplinas sincronizadas no Firebase.
   * @param courseId - ID do curso selecionado.
   */
  onSelectCourse(courseId: string): void {
    this.selectedCourseId = courseId;
    this.loadingSubjects = true;

    const selectedCourse = this.courses.find(c => c.cursoId === courseId);
    if (!selectedCourse) {
      console.error('Curso não encontrado');
      this.loadingSubjects = false;
      return;
    }

    const payload = { course: selectedCourse.name };
    this.http.post('http://localhost:3000/getExternalCourses', payload)
      .subscribe({
        next: (response: any) => {
          const raw = response.payload;
          this.subjects = typeof raw === 'string' ? JSON.parse(raw) : raw;
          this.loadingSubjects = false;
        },
        error: err => {
          console.error('Erro ao obter disciplinas externamente:', err);
          this.loadingSubjects = false;
        }
      });
  }

  /**
   * Inicia a sincronização de cursos do SQLite para o Firebase via backend.
   * Verifica pré-condições e faz GET ao endpoint de sincronização.
   */
  onLoadCourses(): void {
    if (!this.selectedSchoolId || !this.selectedCourseId) {
      alert('Selecione uma escola e um curso antes de carregar as matérias.');
      return;
    }

    const selectedSchool = this.schools.find(e => e.escolaId === this.selectedSchoolId)!;
    const selectedCourse = this.courses.find(c => c.cursoId === this.selectedCourseId)!;
    const params = { school: selectedSchool.name, major: selectedCourse.name };

    this.loadingSync = true;
    this.http.get('http://localhost:3000/loadCourses', { params })
      .subscribe({
        next: resp => {
          console.log('Sincronização concluída:', resp);
          this.loadingSync = false;
          this.onSelectCourse(this.selectedCourseId);
        },
        error: err => {
          console.error('Erro na sincronização:', err);
          this.loadingSync = false;
        }
      });
  }

  /**
   * Getter para obter o objeto do curso atualmente selecionado.
   */
  get selectedCourse(): Course | undefined {
    return this.courses.find(c => c.cursoId === this.selectedCourseId);
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
  trackByCourse(index: number, course: Course): string {
    return course.cursoId;
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

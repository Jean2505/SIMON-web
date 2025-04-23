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

interface School {
  escolaId: string;
  name: string;
}

interface Course {
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
  selectedSchoolId?: string;
  selectedCourseId!: string;

  // Dados carregados dinamicamente do backend (SQLite)
  schools: School[] = [];
  courses: Course[] = [];

  // Disciplinas carregadas do Firebase (após sincronização)
  subjects: Discipline[] = [];

  // Flags de carregamento
  loadingSchools: boolean = false;
  loadingCourses: boolean = false;
  loadingSubjects: boolean = false;
  loadingSync: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadSchools();
  }

  // Carrega as escolas do backend (SQLite)
  loadSchools() {
    this.loadingSchools = true;
    this.http.get<School[]>('http://localhost:3000/schools')
      .subscribe({
        next: (data) => {
          this.schools = data;
          this.loadingSchools = false;
        },
        error: (err) => {
          console.error("Erro ao carregar escolas:", err);
          this.loadingSchools = false;
        }
      });
  }

  // Ao selecionar uma escola, carrega os cursos associados a ela do backend
  onSelectSchool(schoolId: string) {
    this.selectedSchoolId = schoolId;
    // Limpa a seleção de cursos e disciplinas anteriores
    this.courses = [];
    this.selectedCourseId = '';
    this.subjects = [];
    // Carrega os cursos para a escola selecionada
    this.loadCourses(schoolId);
  }

  // Carrega os cursos para a escola selecionada
  loadCourses(schoolId: string) {
    this.loadingCourses = true;
    // Supondo que o endpoint aceite o parâmetro "school" com o ID da escola
    this.http.get<Course[]>('http://localhost:3000/courses', { params: { school: schoolId } })
      .subscribe({
        next: (data) => {
          this.courses = data;
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
  onSelectCourse(courseId: string) {
    this.selectedCourseId = courseId;
    this.loadingSubjects = true;

    // Supondo que você tenha a lista de cursos carregada em `this.cursos`,
    // busque o objeto do curso selecionado (para obter o nome).
    const selectedCourse = this.courses.find(c => c.cursoId === courseId);
    if (!selectedCourse) {
      console.error('Curso não encontrado');
      this.loadingSubjects = false;
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
            this.subjects = JSON.parse(response.payload);
          } else {
            this.subjects = response.payload;
          }
        },
        error: (err) => {
          console.error('Erro ao obter matérias da rota local:', err);
        }
      });
  }

  // Sincroniza os dados de disciplinas do SQLite para o Firebase via backend
  onLoadCourses() {
    if (!this.selectedSchoolId || !this.selectedCourseId) {
      alert("Selecione uma escola e um curso antes de carregar as matérias.");
      return;
    }
    // Busca os objetos da escola e do curso selecionados (para enviar os nomes, se necessário)
    const selectedSchool = this.schools.find(e => e.escolaId === this.selectedSchoolId);
    const selectedCourse = this.courses.find(c => c.cursoId === this.selectedCourseId);
    if (!selectedSchool || !selectedCourse) {
      alert("Seleção inválida!");
      return;
    }
    // Os parâmetros aqui podem ser ajustados conforme o que seu backend espera (por exemplo, o nome da escola e do curso)
    const params = {
      school: selectedSchool.name,
      major: selectedCourse.name
    };

    this.loadingSync = true;
    this.http.get('http://localhost:3000/loadCourses', { params })
      .subscribe({
        next: (resp) => {
          console.log("Sincronização concluída, matérias carregadas para o Firebase:", resp);
          this.loadingSync = false;
          // Atualiza as disciplinas após a sincronização
          this.onSelectCourse(this.selectedCourseId);
        },
        error: (err) => {
          console.error("Erro na sincronização:", err);
          this.loadingSync = false;
        }
      });
  }

  // Getter para facilitar a verificação do curso selecionado
  get selectedCourse() {
    return this.courses.find(curso => curso.cursoId === this.selectedCourseId);
  }

  // Funções trackBy para otimizar os *ngFor
  trackBySchool(index: number, school: School): string {
    return school.escolaId;
  }

  trackByCourse(index: number, course: Course): string {
    return course.cursoId;
  }

  trackBySubject(index: number, subject: Discipline): string {
    return subject.id;
  }
}

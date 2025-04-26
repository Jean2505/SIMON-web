import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';

import { Student } from '../../models/student.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Discipline } from '../../models/discipline.model';

@Component({
  selector: 'app-student-enlist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './enlist.component.html',
  styleUrls: ['./enlist.component.scss']
})
export class StudentEnlistComponent implements OnInit {

  constructor(private http: HttpClient, private auth: Auth, private route: ActivatedRoute) { }

  disciplineId!: string;
  discipline: string = 'carregando...';
  student: Student = {
    nome: 'carregando...',
    uid: 'carregando...',
    ra: 'carregando...',
    curso: 'carregando...',
  };
  time!: string;
  message = '';
  isSwitchOn = false;
  subjectsOptions: Discipline[] = [];
  selectedSubject!: Discipline;
  hoursOptions: number[] = [6, 12, 18];
  selectedHours!: number;

  ngOnInit() {
    this.getStudent();
  }

  getStudent() {
    const uid = this.auth.currentUser?.uid;
    var result: any = null;
    console.log('UID do aluno:', uid);
    this.http.post('http://localhost:3000/getStudent', { uid: uid })
      .subscribe({
        next: (response: any) => {
          result = JSON.parse(response.payload);
          console.log('Aluno recebido:', result);
          this.student.nome = result.nome;
          this.student.uid = result.uid;
          this.student.ra = result.ra;
          this.student.curso = result.curso;
          this.loadSubjects();
        },
        error: (error) => {
          console.error('Error em subscribe do getStudent:', error);
        }
      });
  }

  loadSubjects() {
    console.log('curso:', this.student.curso);
    var result: any = null;
    this.http.post('http://localhost:3000/getExternalCourses', { course: this.student.curso })
      .subscribe({
        next: (response: any) => {
          result = JSON.parse(response.payload);
          console.log('Matérias recebidas:', result);
          this.subjectsOptions = result;
        },
        error: (error) => {
          console.error('Error em subscribe do getExternalCourses:', error);
        }
      });
  }

  enlist() {
    if (!this.student) {
      console.error('Aluno não encontrado');
      return;
    }
    if (!this.message) {
      console.error('Mensagem não pode ser vazia');
      return;
    }
    const enlist = {
      uid: this.student.uid,
      nome: this.student.nome,
      ra: this.student.ra,
      disciplinaId: this.selectedSubject.id,
      disciplina: this.selectedSubject.name,
      mensagem: this.message,
      status: 'Analise',
      cargaHoraria: this.selectedHours,
    }
    try {
      this.http.post('http://localhost:3000/enlist', enlist).subscribe({
        next: (response) => {
          console.log('Candidatura enviada com sucesso:', response);
          alert('Candidatura enviada com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao enviar candidatura:', error);
          alert('Erro ao enviar candidatura. Tente novamente mais tarde.');
        }
      });
      console.log('Candidatura enviada:', enlist);
    } catch (error) {
      console.error('Erro ao enviar candidatura:', error);
    }
  }
}

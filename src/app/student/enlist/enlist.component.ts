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
    ra: 'carregando...'
  };
  time!: string;
  message = '';
  isSwitchOn = false;
  hoursOptions: number[] = [6, 12, 18];
  selectedHours!: number;

  ngOnInit() {
    this.disciplineId = this.route.snapshot.paramMap.get('id')!;
    this.http.get('http://localhost:3000/discipline', { params: { disciplineId: this.disciplineId } })
      .subscribe({
        next: (response: any) => {
          console.log('Resposta do servidor:', response[0]);
          this.discipline = response[0].nome_Disciplina;
          console.log('Nome da disciplina:', this.discipline);
        },
        error: (error) => {
          console.error('Error em subscribe do discipline:', error);
        }
      });
    this.getStudent();
  }

  getStudent() {
    console.log('ID da disciplina:', this.disciplineId);
    const uid = this.auth.currentUser?.uid;
    var result: any = null;
    console.log('UID do aluno:', uid);
    this.http.post('http://localhost:3000/getStudent', { uid: uid })
      .subscribe({
        next: (response: any) => {
          result = JSON.parse(response.payload);
          this.student.nome = result.nome;
          this.student.uid = result.uid;
          this.student.ra = result.ra;
        },
        error: (error) => {
          console.error('Error em subscribe do getStudent:', error);
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
      disciplinaId: this.disciplineId,
      disciplina: this.discipline,
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

import { Component, OnInit } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Auth } from '@angular/fire/auth';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-enlist',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSlideToggleModule
  ],
  templateUrl: './enlist.component.html',
  styleUrls: ['./enlist.component.scss']
})
export class StudentEnlistComponent implements OnInit {
  student!: Student;
  message = '';
  isSwitchOn = false;

  constructor(private http: HttpClient, private auth: Auth) { }
  
  ngOnInit() {
    this.getStudent();
  }

  getStudent() {
    const uid = this.auth.currentUser?.uid;
    this.http.post('http://localhost:3000/getStudent', { studentID: uid } )
      .subscribe({
        next: (response: any) => {
          console.log('Dados do aluno:', response.payload);
          this.student = {
            uid: response.payload.uid,
            name: response.payload.nome,
            ra: response.payload.ra
          };
        },
        error: (error) => {
          console.error('Erro ao obter dados do aluno:', error);
        }
      });
  }

  enlist() {
    try {
      if (!this.student) {
        console.error('Aluno não encontrado');
        return;
      }
      if (!this.message) {
        console.error('Mensagem não pode ser vazia');
        return;
      }
      console.log('Candidatura enviada:', {
        nome: this.student.name,
        ra: this.student.ra,
        mensagem: this.message
      });
    } catch (error) {
      console.error('Erro ao enviar candidatura:', error);
    }
  }
}

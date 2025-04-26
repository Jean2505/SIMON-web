import { ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { type Monitor } from "../../models/monitor.model"
import { MonitorsComponent } from "./monitors/monitors.component";
import { DUMMY_MONITORS } from './monitors/dummy-monitors';

@Component({
  selector: 'app-subject',
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatSelectModule,
    CommonModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MonitorsComponent
  ],
  templateUrl: './subject.component.html',
  styleUrl: './subject.component.scss'
})
export class StudentSubjectComponent implements OnInit {

  constructor(private http: HttpClient, private auth: Auth, private route: ActivatedRoute) { }

  monitors: Monitor[] = [];
  disciplineId!: string;
  discipline: string = 'carregando...';

  ngOnInit() {
    this.getMonitors();
  }

  getMonitors() {
    let result: any = null;
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
    console.log('ID da disciplina:', this.disciplineId);
    this.http.post('http://localhost:3000/getTutor', { courseId: this.disciplineId })
      .subscribe({
        next: (response: any) => {
          result = JSON.parse(response.payload);
          console.log('Resposta do servidor:', result);
          this.monitors = result.map((monitor: any) => ({
            approved: monitor.aprovacao,
            discipline: monitor.disciplina,
            disciplineId: monitor.disciplinaId,
            photo: monitor.foto,
            availability: monitor.horarioDisponivel,
            local: monitor.local,
            name: monitor.nome,
            ra: monitor.ra,
            room: monitor.sala,
            status: monitor.status,
          }));
        },
        error: (error) => {
          console.error('Error em subscribe do discipline:', error);
        }
      });
  }
}

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

  monitors = DUMMY_MONITORS;
  disciplineId!: string;
  discipline: string = 'carregando...';
  
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
    this.getMonitors();
  }

  getMonitors() {
    console.log('ID da disciplina:', this.disciplineId);
    this.http.get('http://localhost:3000/monitor', { params: { disciplineId: this.disciplineId } })
      .subscribe({
        next: (response: any) => {
          console.log('Resposta do servidor:', response);
          this.monitors = response;
        },
        error: (error) => {
          console.error('Error em subscribe do discipline:', error);
        }
      });
    }
}

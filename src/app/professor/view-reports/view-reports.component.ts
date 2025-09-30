import { Component, Input, OnInit } from '@angular/core';
import { BackButtonComponent } from "../../shared/buttons/back-button/back-button.component";
import { Discipline } from '../../models/discipline.model';
import { DisciplineComponent } from "./discipline/discipline.component";
import { HttpClient } from '@angular/common/http';
import { Auth, User } from '@angular/fire/auth';

@Component({
  selector: 'app-view-reports',
  imports: [BackButtonComponent, DisciplineComponent],
  templateUrl: './view-reports.component.html',
  styleUrl: './view-reports.component.scss'
})
export class ViewReportsComponent implements OnInit {

  user!: User;

  disciplinas: Discipline [] = [];

  loadingDisciplinas = true;

  constructor (
    private auth: Auth,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.auth.currentUser!;
    this.getDisciplines();
  }

  getDisciplines(): void { 
    this.http.post('http://localhost:3000/getProfessorDisciplines', { user: this.user.uid })
      .subscribe({
        next: (response: any) => {
          const result = JSON.parse(response);
          this.disciplinas = result.map((subject: any) => {
            return {
              id: subject.id,
              course: subject.course,
              name: subject.name,
              professor: subject.professor,
              term: subject.term,
              monitorAmnt: subject.monitors,
            };
        });
        this.loadingDisciplinas = false;
      }
    });
  }
}

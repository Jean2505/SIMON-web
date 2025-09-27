import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent, NgOptionComponent, NgLabelTemplateDirective, NgOptgroupTemplateDirective} from '@ng-select/ng-select';
import { BackButtonComponent } from "../../shared/buttons/back-button/back-button.component";
import { SessionStorageService } from '../../core/services/session-storage.service';
import { Discipline } from '../../models/discipline.model';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-send-report',
  imports: [
    BackButtonComponent, 
    FormsModule, 
    NgLabelTemplateDirective, 
    NgOptgroupTemplateDirective, 
    NgSelectComponent, 
    NgOptionComponent
  ],
  templateUrl: './send-report.component.html',
  styleUrl: './send-report.component.scss'
})
export class SendReportComponent implements OnInit {

  discipline!: any;

  description = '';
  selectedTopic = '';

  disciplineTopics: string [] = [];
  reportTopics: string [] = [];

  constructor(
    private sessionStorage: SessionStorageService,
    /** Serviço HttpClient para requisições HTTP @type {HttpClient} */
    private http: HttpClient,
    private router: Router,
    /** Referência ao serviço de rota ativa @type {ActivatedRoute} */
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.discipline = this.sessionStorage.getAllDataFromKey('selectedDiscipline');
    this.disciplineTopics = this.discipline.topics;
    this.disciplineTopics.push('Outro');
  }

  addTopic(topic: string) {
    this.reportTopics.push(topic);
  }

  removeTopic(topic: string) {
    this.reportTopics = this.reportTopics.filter(str => {return str !== topic});
  }

  sendReport() {
    this.http.post('http://localhost:3000/sendReport',
      {
        courseId: this.discipline.id,
        course: this.discipline.name,
        userName: this.sessionStorage.getData('user', 'nome'), 
        userUid: this.sessionStorage.getData('user', 'uid'),
        description: this.description,
        topics: this.reportTopics,
        createdAt: new Date()
      })
      .subscribe({
        next: (response) => {
          console.log('Relatório enviado com sucesso:', response);
        },
        error: (error) => {
          console.error('Erro ao criar post:', error);
        }
      });

    this.goTutorSubjects();
  }

  goTutorSubjects(): void {
    this.router
      .navigate(['../'], { relativeTo: this.route })
      .then((success) => {
        console.log('Navegação realizada:', success);
        console.clear(); // Limpa console após navegação bem-sucedida
      })
      .catch((error) => console.error('Erro na navegação:', error));
  }
}

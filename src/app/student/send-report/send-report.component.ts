import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectComponent, NgOptionComponent, NgLabelTemplateDirective, NgOptgroupTemplateDirective} from '@ng-select/ng-select';
import { BackButtonComponent } from "../../shared/buttons/back-button/back-button.component";
import { SessionStorageService } from '../../core/services/session-storage.service';
import { Discipline } from '../../models/discipline.model';

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

  selectedTopic = '';

  disciplineTopics: string [] = [];
  reportTopics: string [] = [];

  constructor(
    private sessionStorage: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.discipline = this.sessionStorage.getAllDataFromKey('selectedDiscipline');
    this.disciplineTopics = this.discipline.topics;
    console.log(this.disciplineTopics);
  }

  addTopic(topic: string) {
    this.reportTopics.push(topic);
  }

  removeTopic(topic: string) {
    this.reportTopics = this.reportTopics.filter(str => {return str !== topic});
  }

  sendReport() {

  }
}

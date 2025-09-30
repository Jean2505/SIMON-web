import { Component, OnInit } from '@angular/core';
import { BackButtonComponent } from "../../../shared/buttons/back-button/back-button.component";
import { ProgressWithGifComponent } from "../../../shared/loading/loading.component";
import { SessionStorageService } from '../../../core/services/session-storage.service';
import { HttpClient } from '@angular/common/http';
import { ReportItemComponent } from "./report-item/report-item.component";

@Component({
  selector: 'app-reports-list',
  imports: [BackButtonComponent, ProgressWithGifComponent, ReportItemComponent],
  templateUrl: './reports-list.component.html',
  styleUrl: './reports-list.component.scss'
})
export class ReportsListComponent implements OnInit {

  reports: any [] = [];

  isLoading: boolean = true;

  disciplineName = '';

  disciplineId = '';

  constructor (
    private sessionStorage: SessionStorageService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.disciplineId = this.sessionStorage.getData('selectedDiscipline', 'id');
    this.disciplineName = this.sessionStorage.getData('selectedDiscipline', 'name');
    this.getReports();
  }

  getReports(): void {
    this.http.post('http://localhost:3000/getReports', { courseId: this.disciplineId })
      .subscribe({
        next: (response: any) => {
          let result = JSON.parse(response);
          this.reports = result.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        },
        error: (error) => {
          console.error('Error fetching requisitions:', error);
          this.reports = [];
          this.isLoading = false;
        },
        complete: () => (this.isLoading = false)
      })
  }
}

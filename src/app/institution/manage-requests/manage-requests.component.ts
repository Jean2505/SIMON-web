import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackButtonComponent } from "../../shared/buttons/back-button/back-button.component";
import { ProgressWithGifComponent } from "../../shared/loading/loading.component";
import { RequestItemComponent } from "./request-item/request-item.component";
import { ProfessorRequest } from '../../models/professor-request.model';

@Component({
  selector: 'app-manage-requests',
  imports: [BackButtonComponent, ProgressWithGifComponent, RequestItemComponent],
  templateUrl: './manage-requests.component.html',
  styleUrl: './manage-requests.component.scss'
})
export class ManageRequestsComponent implements OnInit {

  requests: ProfessorRequest [] = [];

  /** Loading state */
  loading: boolean = false;

  /**
 * Constructor
 * @param http HttpClient
 */
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loading = true;
    this.http.get('http://localhost:3000/getMonitorRequest').subscribe({
      next: (response: any) => {
        let result = JSON.parse(response);
        console.log(result);
        this.requests = result;
      },
      error: (error) => {
        console.error('Error fetching requisitions:', error);
        this.requests = []; // Reset tutors on error
        this.loading = false; // Reset loading state on error
      },
      complete: () => (this.loading = false),
    });
  }
}

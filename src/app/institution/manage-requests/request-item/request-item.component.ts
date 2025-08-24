import { Component, Input } from '@angular/core';
import { MatExpansionModule } from "@angular/material/expansion";
import { HttpClient } from '@angular/common/http';
import { ProfessorRequest } from '../../../models/professor-request.model';

@Component({
  selector: 'app-request-item',
  imports: [MatExpansionModule],
  templateUrl: './request-item.component.html',
  styleUrl: './request-item.component.scss'
})
export class RequestItemComponent {

  @Input({ required: true }) request!: ProfessorRequest; 

  /** Loading state for approval actions */
  loadingResult: boolean = false;

  /**
   * Constructor
   * @param http HttpClient
   */
  constructor(private http: HttpClient){}

  sendResult(result: number, disciplinaId: string, requestQuantity: Number): void {
    this.loadingResult = true;
    this.http
      .post('http://localhost:3000/updateMonitorRequisition', {
        disciplinaId: disciplinaId,
        aprovacao: result,
        requestQuantity: requestQuantity
      })
      .subscribe({
        next: (response: any) => {
          console.log(response);
          window.location.reload();
        },
        error: (error) => {
          console.error('Error sending data:', error);
        },
         complete: () => {
          this.loadingResult = false;
        },  
      })
  }
}

import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { HttpClient } from '@angular/common/http';
import { Tutor } from '../../models/tutor.model';

@Component({
  selector: 'app-approve-candidate',
  standalone: true,
  imports: [MatExpansionModule],
  templateUrl: './approve-candidate.component.html',
  styleUrl: './approve-candidate.component.scss'
})
export class ApproveCandidateComponent implements OnInit {

  tutors: Tutor[] = [];

  /**
   * Constructor
   * @param http HttpClient
   */
  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.http.get('http://localhost:3000/getRequisitions')
      .subscribe({
        next: (response: any) => {
          let result = JSON.parse(response);
          console.log(result);
          this.tutors = result;
        },
        error: (error) => console.error('Error fetching requisitions:', error)
      })
  }

  /**
   * Track by function for ngFor
   * @param Tutor Tutor object
   * @returns Unique identifier for the item
   */
  trackEnlistment(Tutor: Tutor): string {
    return Tutor.nome + Tutor.disciplina;
  }

  sendResult(result: number, uid: string): void {
    this.http.post('http://localhost:3000/updateRequisition', {
      uid: uid,
      aprovacao: result
    }).subscribe({
      next: (response) => {
        console.log('Response:', response);
        window.location.reload();
      },
      error: (error) => console.error('Error:', error)
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { HttpClient } from '@angular/common/http';
import { Tutor } from '../../models/tutor.model';
import { ProgressWithGifComponent } from '../../shared/loading/loading.component';
import { BackButtonComponent } from "../../shared/buttons/back-button/back-button.component";

@Component({
  selector: 'app-approve-candidate',
  standalone: true,
  imports: [MatExpansionModule, ProgressWithGifComponent, BackButtonComponent],
  templateUrl: './approve-candidate.component.html',
  styleUrl: './approve-candidate.component.scss',
})
export class ApproveCandidateComponent implements OnInit {
  /** List of tutors */
  tutors: Tutor[] = [];

  /** Loading state */
  loading: boolean = false;

  /** Loading state for approval actions */
  loadingResult: boolean = false;

  /**
   * Constructor
   * @param http HttpClient
   */
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loading = true;
    this.http.get('http://localhost:3000/getRequisitions').subscribe({
      next: (response: any) => {
        let result = JSON.parse(response);
        console.log(result);
        this.tutors = result;
      },
      error: (error) => {
        console.error('Error fetching requisitions:', error);
        this.tutors = []; // Reset tutors on error
        this.loading = false; // Reset loading state on error
      },
      complete: () => (this.loading = false),
    });
  }

  /**
   * Track by function for ngFor
   * @param Tutor Tutor object
   * @returns Unique identifier for the item
   */
  trackEnlistment(Tutor: Tutor): string {
    return Tutor.nome + Tutor.disciplina;
  }

  /**
   * Send result of approval or rejection
   * @param result Result of the approval (1 for approved, 0 for rejected)
   * @param uid User ID of the tutor
   * @param disciplinaId Discipline ID
   */
  sendResult(result: number, uid: string, disciplinaId: string): void {
    this.loadingResult = true;
    this.http
      .post('http://localhost:3000/updateRequisition', {
        uid: uid,
        aprovacao: result,
        disciplinaId: disciplinaId,
      })
      .subscribe({
        next: (response) => {
          console.log('Response:', response);
          this.http
            .post('http://localhost:3000/approveTutor', {
              id: disciplinaId,
            })
            .subscribe({
              next: (response) => {
                console.log('Response from server:', response);
                window.location.reload();
              },
              error: (error) => {
                console.error('Error sending data:', error);
              },
            });
        },
        error: (error) => console.error('Error:', error),
        complete: () => {
          this.loadingResult = false; // Reset loading state
        },
      });
  }
}

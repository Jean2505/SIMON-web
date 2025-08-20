import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Discipline } from '../../../models/discipline.model';

@Component({
  selector: 'app-request-modal',
  imports: [FormsModule],
  templateUrl: './request-modal.component.html',
  styleUrl: './request-modal.component.scss'
})
export class RequestModalComponent implements OnInit{

  /** Objeto Discipline com dados da matéria. */
  @Input({ required: true }) discipline!: Discipline;
  
  @Output() cancel = new EventEmitter<boolean>();

  requestQuantity: Number | undefined;

  /**
   * @param http - HttpClient para requisições HTTP.
   */
  constructor(
    /** Serviço HttpClient para requisições HTTP @type {HttpClient} */
    private http: HttpClient
  ){}

  ngOnInit(): void {
    this.requestQuantity = this.discipline.monitors;
  }

  cancelModal() {
    this.cancel.emit(false);
  }

  confirmAndClose(): void {
    this.http
      .post('http://localhost:3000/sendMonitorRequest', {
        id: this.discipline.id,
        name: this.discipline.name,
        course: this.discipline.course,
        professor: this.discipline.professor,
        monitors: this.discipline.monitors,
        requestQuantity: this.requestQuantity
      })
      .subscribe({
        next: (response: any) => {
          console.log(response);
        }
      });
      this.cancel.emit(false);
  }
}

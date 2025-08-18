import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Discipline } from '../../../models/discipline.model';

@Component({
  selector: 'app-request-modal',
  imports: [],
  templateUrl: './request-modal.component.html',
  styleUrl: './request-modal.component.scss'
})
export class RequestModalComponent {

  /** Objeto Discipline com dados da matéria. */
  @Input({ required: true }) discipline!: Discipline;
  
  @Output() cancel = new EventEmitter<boolean>();

  cancelModal() {
    this.cancel.emit(false);
  }

  sendRequest() {

  }
}

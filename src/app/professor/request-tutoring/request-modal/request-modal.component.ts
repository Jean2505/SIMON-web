import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-request-modal',
  imports: [],
  templateUrl: './request-modal.component.html',
  styleUrl: './request-modal.component.scss'
})
export class RequestModalComponent {

  @Output() cancel = new EventEmitter<boolean>();

  cancelModal() {
    this.cancel.emit(false);
  }

  sendRequest() {

  }
}

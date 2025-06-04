import { Component } from '@angular/core';
import { BackButtonComponent } from "../buttons/back-button/back-button.component";

@Component({
  selector: 'app-error',
  imports: [BackButtonComponent],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {

}

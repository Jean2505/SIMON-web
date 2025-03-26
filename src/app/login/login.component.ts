import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Output() submit = new EventEmitter<void>();
  enteredEmail = '';
  enteredPassword = '';

  onSubmit() {
    this.submit.emit();
  }
}

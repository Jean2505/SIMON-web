import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  enteredEmail = '';
  enteredPassword = '';

  constructor(private auth: Auth, private router: Router) {}

  async onSubmit() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        this.enteredEmail,
        this.enteredPassword
      );

      console.log('Login efetuado com sucesso!', userCredential.user);

      // Exemplo: redirecionar usuário para home após login
      this.router.navigate(['/home']);

    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro ao fazer login. Verifique suas credenciais!');
    }
  }
}

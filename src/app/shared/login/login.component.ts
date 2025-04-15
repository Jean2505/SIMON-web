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
  
      // Atualiza o token para garantir que os custom claims estejam disponíveis
      const idTokenResult = await userCredential.user.getIdTokenResult(true);
      const role = idTokenResult.claims['role'] || '';
      console.log('Role do usuário:', role);
  
      // Redireciona de acordo com o role
      switch (role) {
        case 'ALUNO':
          this.router.navigate(['/student']);
          break;
        case 'PROFESSOR':
          this.router.navigate(['/professor']);
          break;
        case 'INSTITUICAO':
          this.router.navigate(['/institution']);
          break;
        default:
          this.router.navigate(['/login']);
          break;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro ao fazer login. Verifique suas credenciais!');
    }
  }
}

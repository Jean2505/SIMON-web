import { Component } from '@angular/core';  
import { FormsModule } from '@angular/forms';  
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';  
import { Router } from '@angular/router';  
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../service/auth.service';

/**
 * Componente de login responsável por autenticar usuários e redirecioná-los conforme seu role.
 */
@Component({
  selector: 'app-login',                // Seletor HTML para usar este componente
  standalone: true,                     // Componente standalone sem necessidade de NgModule externo
  imports: [FormsModule],               // Módulo para formulários necessários no template
  templateUrl: './login.component.html',// Caminho para o template HTML
  styleUrls: ['./login.component.scss'],// Caminho para os estilos SCSS
})
export class LoginComponent {
  /** Email digitado pelo usuário. */
  enteredEmail: string = '';

  /** Senha digitada pelo usuário. */
  enteredPassword: string = '';

  /**
   * Construtor do componente.
   * @param auth   - Serviço de autenticação do Firebase para login.
   * @param http   - Serviço de requisições HTTP para comunicação com o backend.
   * @param router - Serviço Router para navegação programática após login.
   */
  constructor(
    private auth: Auth,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Método acionado ao submeter o formulário de login.
   * Autentica via Firebase Auth, obtém custom claims e redireciona conforme role.
   */
  async onSubmit(): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        this.enteredEmail,
        this.enteredPassword
      );
      console.log('Login efetuado com sucesso!', userCredential.user);

      // Atualiza token para garantir disponibilidade de custom claims
      const idTokenResult = await userCredential.user.getIdTokenResult(true);
      const role = idTokenResult.claims['role'] || '';
      console.log('Role do usuário:', role);

      if (role === 'ALUNO' || role === 'MONITOR') {
        // Obtém o ID do aluno
        const uid = this.auth.currentUser?.uid;
        console.log('ID do aluno:', uid);

        // Faz uma requisição para obter os dados do aluno
        this.http.post('http://localhost:3000/getStudent', { uid }).subscribe({
          next: async (response: any) => {
            const result = JSON.parse(response.payload);
            console.log('Dados do aluno:', result);
            await this.authService.updateDisplayName(result.nome);
            // Armazena os dados do aluno no localStorage
            localStorage.setItem('studentData', JSON.stringify(result));
          },
          error: (error) => {
            console.error('Erro ao obter dados do aluno:', error);
          }
        });
      } else if (role === 'PROFESSOR') {
        // Obtém o ID do professor
        const uid = this.auth.currentUser?.uid;
        console.log('ID do professor:', uid);

        // Faz uma requisição para obter os dados do professor
        this.http.post('http://localhost:3000/getProfessor', { uid }).subscribe({
          next: async (response: any) => {
            const result = JSON.parse(response.payload);
            console.log('Dados do professor:', result);
            await this.authService.updateDisplayName(result.nome);
            // Armazena os dados do professor no localStorage
            localStorage.setItem('professorData', JSON.stringify(result));
          },
          error: (error) => {
            console.error('Erro ao obter dados do professor:', error);
          }
        });
      } else if (role === 'INSTITUICAO') {
        await this.authService.updateDisplayName('PUC Campinas');
      }

      // Redireciona de acordo com o role
      switch (role) {
        case 'ALUNO':
          this.router.navigate(['/student']);
          break;
        case 'MONITOR':
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

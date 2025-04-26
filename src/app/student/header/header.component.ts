import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';

/**
 * Componente de header do estudante.
 * Fornece ações de navegação e logout para a área do aluno.
 */
@Component({
  selector: 'app-student-header',        // Seletor HTML para usar este componente
  standalone: true,                      // Componente standalone sem NgModule externo
  imports: [RouterModule],               // Importa RouterModule para navegação programática
  templateUrl: './header.component.html',// Caminho para template HTML
  styleUrls: ['./header.component.scss'] // Caminho para estilos SCSS
})
export class StudentHeaderComponent {
  /**
   * Construtor do componente.
   * @param router - Serviço Router para navegação programática.
   * @param auth   - Serviço de autenticação do Firebase para logout.
   */
  constructor(
    private router: Router,
    private auth: Auth
  ) { }

  /**
   * Efetua logout do usuário autenticado.
   * Limpa o console, registra sucesso e redireciona para '/login'.
   */
  logout(): void {
    signOut(this.auth)
      .then(() => {
        console.clear();           // Limpa o console antes de registrar
        console.log('Logout realizado com sucesso!');
        this.router.navigate(['/login']); // Redireciona para tela de login
      })
      .catch(error => {
        console.error('Erro ao fazer logout:', error);
      });
  }

  /**
   * Navega para a página inicial do estudante.
   * Registra o resultado e limpa o console.
   */
  goHome(): void {
    this.router.navigate(['/student/home'])
      .then(success => {
        console.log('Navegação realizada:', success);
        console.clear();           // Limpa o console após navegação bem-sucedida
      })
      .catch(error => console.error('Erro na navegação:', error));
  }
}
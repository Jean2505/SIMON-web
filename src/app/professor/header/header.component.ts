import { Component } from '@angular/core';  
import { Router, RouterModule } from '@angular/router';  
import { Auth, signOut } from '@angular/fire/auth';  

/**
 * Header do professor contendo ações de navegação e logout.
 */
@Component({
  selector: 'app-header',            // Seletor HTML para este componente
  standalone: true,                  // Componente standalone sem necessidade de NgModule
  imports: [RouterModule],           // Importa RouterModule para navegação
  templateUrl: './header.component.html',  // Caminho para template HTML
  styleUrls: ['./header.component.scss']   // Caminho para estilos SCSS
})
export class ProfessorHeaderComponent {
  /**
   * Construtor do componente.
   * @param router - Serviço de roteamento para navegação programática.
   * @param auth   - Serviço de autenticação do Firebase para logout.
   */
  constructor(
    private router: Router,         
    private auth: Auth              
  ) { }

  /**
   * Efetua logout do usuário autenticado.
   * Chama signOut do Firebase e, em sucesso, redireciona para /login.
   */
  logout(): void {
    signOut(this.auth)
      .then(() => {
        console.log('Logout realizado com sucesso!');
        this.router.navigate(['/login']);  // Redireciona para tela de login
      })
      .catch(error => {
        console.error('Erro ao fazer logout:', error);
      });
  }

  /**
   * Navega para a página inicial do professor.
   */
  goHome(): void {
    this.router.navigate(['/professor/home'])
      .then(success => console.log('Navegação realizada:', success))
      .catch(error => console.error('Erro na navegação:', error));
  }
}
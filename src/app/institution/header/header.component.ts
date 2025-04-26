import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-inst-header',            // Nome do seletor HTML para usar este componente
  standalone: true,                       // Marca este componente como standalone (não precisa de NgModule)
  imports: [RouterModule],                // Módulos importados (aqui, apenas RouterModule para navegar)
  templateUrl: './header.component.html', // Caminho para o template HTML
  styleUrls: ['./header.component.scss']  // Caminho para o(s) stylesheet(s)
})
export class InstitutionHeaderComponent {
  /**
   * Construtor do componente.
   * @param router - Injeção do serviço de roteamento do Angular para navegação programática.
   * @param auth   - Injeção do serviço de autenticação do Firebase.
   */
  constructor(
    private router: Router,
    private auth: Auth
  ) { }

  /**
   * Método de logout.
   * Chama o método signOut do Firebase Auth e, em caso de sucesso,
   * registra no console e redireciona o usuário para a rota de login.
   * Em caso de erro, exibe o log de erro no console.
   */
  logout(): void {
    signOut(this.auth)
      .then(() => {
        console.log('Logout realizado com sucesso!');
        // Após deslogar, navega para a rota '/login'
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('Erro ao fazer logout:', error);
      });
  }

  /**
   * Método para navegar para a tela inicial da instituição.
   * Usa o Router.navigate e registra no console se a navegação foi bem-sucedida ou não.
   */
  goHome(): void {
    this.router.navigate(['/institution/home'])
      .then(success => console.log('Navegação realizada:', success))
      .catch(error => console.error('Erro na navegação:', error));
  }
}

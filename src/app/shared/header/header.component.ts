import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { SessionStorageService } from '../../core/services/session-storage.service';

@Component({
  selector: 'app-inst-header', // Nome do seletor HTML para usar este componente
  standalone: true, // Marca este componente como standalone (não precisa de NgModule)
  imports: [RouterModule], // Módulos importados (aqui, apenas RouterModule para navegar)
  templateUrl: './header.component.html', // Caminho para o template HTML
  styleUrls: ['./header.component.scss'], // Caminho para o(s) stylesheet(s)
})
export class HeaderComponent {
  /**
   * Variável para armazenar o nome do usuário logado.
   * @type {string}
   */
  nome!: string;

  user!: any;

  /**
   * Construtor do componente.
   * @param router - Injeção do serviço de roteamento do Angular para navegação programática.
   * @param auth   - Injeção do serviço de autenticação do Firebase.
   */
  constructor(
    /** Injeção do serviço de roteamento do Angular @type {Router} */
    private router: Router,
    /** Injeção do serviço de autenticação do Firebase @type {Auth} */
    private auth: Auth,
    /** Referência ao serviço de rota ativa @type {ActivatedRoute} */
    private route: ActivatedRoute,
    /** Referência ao serviço de armazenamento de sessão @type {SessionStorageService} */
    private sessionStorage: SessionStorageService
  ) {
    this.user = this.sessionStorage.getData();
    console.log(this.user);
    // Inicializa o nome do usuário logado com o valor armazenado no sessionStorage
    this.nome = this.user.nome;
  }

  /**
   * Método para navegar para a tela inicial da instituição.
   * Usa o Router.navigate e registra no console se a navegação foi bem-sucedida ou não.
   */
  goHome(): void {
    this.router
      .navigate(['home'], { relativeTo: this.route.pathFromRoot[1] })
      .then((success) => console.log('Navegação realizada:', success))
      .catch((error) => console.error('Erro na navegação:', error));
  }

  /**
   * Método para navegar para a tela de gerenciamento de perfil.
   * Usa o Router.navigate e registra no console se a navegação foi bem-sucedida ou não.
   */
  goManageProfile(): void {
    if (this.user.role === 'MONITOR') {
      this.router
        .navigate(['manage-profile'], { relativeTo: this.route.pathFromRoot[1] })
        .then((success) => console.log('Navegação realizada:', success))
        .catch((error) => console.error('Erro na navegação:', error));
    }
  }

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
        // Limpa os dados do usuário armazenados na sessão
        this.sessionStorage.clearAllData();
        // Após deslogar, navega para a rota '/login'
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Erro ao fazer logout:', error);
      });
  }
}

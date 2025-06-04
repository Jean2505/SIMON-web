import {
  ChangeDetectorRef,
  Component,
  Input,
  input,
  OnChanges,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  UrlSegment,
} from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { SessionStorageService } from '../../core/services/session-storage.service';
import { HeaderService } from '../../core/services/header.service';

@Component({
  selector: 'app-inst-header', // Nome do seletor HTML para usar este componente
  standalone: true, // Marca este componente como standalone (não precisa de NgModule)
  imports: [RouterModule], // Módulos importados (aqui, apenas RouterModule para navegar)
  templateUrl: './header.component.html', // Caminho para o template HTML
  styleUrls: ['./header.component.scss'], // Caminho para o(s) stylesheet(s)
})
export class HeaderComponent {
  /**
   * Variável para armazenar o usuário logado.
   * @type {any}
   */
  user!: any;
  /**
   * Variável para armazenar o papel (role) do usuário logado.
   * @type {string}
   */
  role!: string;

  /**
   * Título do componente, usado para exibir o nome da instituição ou outra informação relevante.
   * Ele deve ser alterado dinamicamente conforme a navegação, enviado pelo serviço de cabeçalho.
   * @type {string}
   */
  headerTitle!: string;

  /**
   * Construtor do componente.
   * @param router          - Injeção do serviço de roteamento do Angular para navegação programática.
   * @param auth            - Injeção do serviço de autenticação do Firebase.
   * @param route           - Referência ao serviço de rota ativa do Angular, usado para acessar informações da rota atual.
   * @param sessionStorage  - Referência ao serviço de armazenamento de sessão, usado para gerenciar dados temporários do usuário.
   */
  constructor(
    /** Injeção do serviço de roteamento do Angular @type {Router} */
    private router: Router,
    /** Injeção do serviço de autenticação do Firebase @type {Auth} */
    private auth: Auth,
    /** Referência ao serviço de rota ativa @type {ActivatedRoute} */
    private route: ActivatedRoute,
    /** Referência ao serviço de armazenamento de sessão @type {SessionStorageService} */
    private sessionStorage: SessionStorageService,
    /** Referência ao ChangeDetectorRef para detectar mudanças no componente @type {ChangeDetectorRef} */
    private cdr: ChangeDetectorRef,
    /** Referência ao serviço de cabeçalho para manipulação do título @type {HeaderService} */
    private headerService: HeaderService
  ) {
    this.user = this.sessionStorage.getAllDataFromKey('user');
    this.role = this.sessionStorage.getData('role', 'role');
    console.log('Usuário:', this.user);
    console.log('Role:', this.role);
  }

  setHeaderTitle(title: string): void {
    this.cdr.detectChanges();
    // Inscreve-se no serviço de cabeçalho para receber atualizações do título
    this.headerTitle = title;
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
    if (this.role === 'MONITOR') {
      this.router
        .navigate([`/student/tutor-profile`])
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

  getFirstName(name: String){
    return name.split(' ')[0];
  }
}

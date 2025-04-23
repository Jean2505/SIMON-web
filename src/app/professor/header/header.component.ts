import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class ProfessorHeaderComponent {
  constructor(private router: Router, private auth: Auth) {}

  logout(): void {
    signOut(this.auth)
      .then(() => {
        console.log('Logout realizado com sucesso!');
        // Redirecione para a tela de login ou outra rota de sua preferência
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('Erro ao fazer logout:', error);
      });
  }

  goHome(): void {
    this.router.navigate(['/student/home'])
      .then(success => console.log('Navegação realizada:', success))
      .catch(error => console.error('Erro na navegação:', error));
  }

}

import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-student-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class StudentHeaderComponent {
  constructor(private router: Router, private auth: Auth) { }

  logout(): void {
    signOut(this.auth)
      .then(() => {
        console.clear();
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
      .then(success => {
        console.log('Navegação realizada:', success);
        console.clear();
      })
      .catch(error => console.error('Erro na navegação:', error));
  }
}
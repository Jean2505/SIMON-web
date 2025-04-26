import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inst-home',               // Seletor HTML para usar este componente
  standalone: true,                        // Marca o componente como standalone (não requer NgModule)
  imports: [CommonModule],                 // Módulos necessários (aqui, CommonModule para diretivas básicas)
  templateUrl: './home.component.html',    // Caminho para o template HTML deste componente
  styleUrls: ['./home.component.scss']     // Caminho para o(s) stylesheet(s) deste componente
})
export class InstitutionHomeComponent {
  /**
   * Construtor do componente.
   * @param router - Instância do Router do Angular para navegação programática dentro da aplicação.
   */
  constructor(
    private router: Router
  ) { }

  /**
   * Método para navegar até a página de gerenciamento de disciplinas da instituição.
   * Utiliza Router.navigate e registra no console se a navegação foi bem-sucedida ou não.
   */
  goManageSubjects(): void {
    this.router.navigate(['/institution/manage-subjects'])
      .then(success => console.log('Navegação realizada:', success))
      .catch(error => console.error('Erro na navegação:', error));
  }

  /**
   * Método para navegar até a página de gerenciamento de monitores da instituição.
   * Utiliza Router.navigate e registra no console se a navegação foi bem-sucedida ou não.
   */
  goManageTutors(): void {
    this.router.navigate(['/institution/manage-tutors'])
      .then(success => console.log('Navegação realizada:', success))
      .catch(error => console.error('Erro na navegação:', error));
  }
}

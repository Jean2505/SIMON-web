import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Componente da página inicial do professor.
 * Permite navegação para disciplinas, monitores e inscrição à monitoria.
 */
@Component({
  selector: 'student-home',              // Seletor HTML para usar este componente
  standalone: true,                     // Componente standalone sem NgModule externo
  imports: [CommonModule],              // CommonModule para diretivas comuns do Angular
  templateUrl: './home.component.html', // Caminho para o template HTML
  styleUrls: ['./home.component.scss']  // Caminho para os estilos SCSS
})
export class ProfessorHomeComponent {
  /**
   * Construtor do componente.
   * @param router - Serviço Router para navegação programática.
   */
  constructor(private router: Router) { }

  /**
   * Navega para a tela de disciplinas do professor.
   */
  goSubjects(): void {
    this.router.navigate(['/professor/subjects'])
      .then(success => {
        console.log('Navegação realizada:', success);
        console.clear(); // Limpa o console após navegação bem-sucedida
      })
      .catch(error => console.error('Erro na navegação:', error));
  }

  /**
   * Navega para a tela de monitores do professor.
   */
  goTutors(): void {
    this.router.navigate(['/professor/tutors'])
      .then(success => {
        console.log('Navegação realizada:', success);
        console.clear(); // Limpa o console após navegação bem-sucedida
      })
      .catch(error => console.error('Erro na navegação:', error));
  }

  /**
   * Navega para a página de candidatura à monitoria.
   */
  goEnlist(): void {
    this.router.navigate(['/professor/enlist'])
      .then(success => {
        console.log('Navegação realizada:', success);
        console.clear(); // Limpa o console após navegação bem-sucedida
      })
      .catch(error => console.error('Erro na navegação:', error));
  }
}

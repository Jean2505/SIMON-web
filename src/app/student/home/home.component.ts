import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Componente da página inicial do estudante.
 * Permite navegação para disciplinas e candidatura à monitoria.
 */
@Component({
  selector: 'student-home', // Seletor HTML para usar este componente
  standalone: true, // Componente standalone sem NgModule externo
  imports: [CommonModule], // Importa CommonModule para diretivas comuns do Angular
  templateUrl: './home.component.html', // Caminho para o template HTML
  styleUrls: ['./home.component.scss'], // Caminho para os estilos SCSS
})
export class StudentHomeComponent {
  /**
   * Construtor do componente.
   * @param router - Serviço Router para navegação programática.
   */
  constructor(private router: Router) {}

  /**
   * Navega para a tela de disciplinas do estudante.
   * Registra o resultado e limpa o console após sucesso.
   */
  goSubjects(): void {
    this.router
      .navigate(['/student/subjects'])
      .then((success) => {
        console.log('Navegação realizada:', success);
        console.clear(); // Limpa console após navegação bem-sucedida
      })
      .catch((error) => console.error('Erro na navegação:', error));
  }

  /**
   * Navega para a tela de candidatura à monitoria.
   * Registra o resultado e limpa o console após sucesso.
   */
  goEnlist(): void {
    this.router
      .navigate(['/student/enlist'])
      .then((success) => {
        console.log('Navegação realizada:', success);
        console.clear(); // Limpa console após navegação bem-sucedida
      })
      .catch((error) => console.error('Erro na navegação:', error));
  }

  /**
   * Navega para a tela de matérias monitoradas.
   */
  goTutorSubjects(): void {
    this.router
      .navigate(['/student/tutor-subjects'])
      .then((success) => {
        console.log('Navegação realizada:', success);
        console.clear(); // Limpa console após navegação bem-sucedida
      })
      .catch((error) => console.error('Erro na navegação:', error));
  }
}

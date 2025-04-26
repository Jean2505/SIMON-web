import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'student-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class ProfessorHomeComponent {
  constructor(private router: Router) { }

  goSubjects(): void {
    this.router.navigate(['/professor/subjects'])
      .then(success => {
        console.log('Navegação realizada:', success);
        console.clear();
      })
      .catch(error => console.error('Erro na navegação:', error));
  }

  goMonitors(): void {
    this.router.navigate(['/professor/monitors'])
      .then(success => {
        console.log('Navegação realizada:', success);
        console.clear();
      })
      .catch(error => console.error('Erro na navegação:', error));
  }

  goEnlist(): void {
    this.router.navigate(['/professor/enlist'])
      .then(success => {
        console.log('Navegação realizada:', success);
        console.clear();
      })
      .catch(error => console.error('Erro na navegação:', error));
  }
}

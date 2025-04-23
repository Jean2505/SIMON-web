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
export class StudentHomeComponent {
  constructor(private router: Router) { }

  goSubjects(): void {
    this.router.navigate(['/student/subjects'])
      .then(success => console.log('Navegação realizada:', success))
      .catch(error => console.error('Erro na navegação:', error));
  }

  goEnlist(): void {
    this.router.navigate(['/student/enlist'])
      .then(success => console.log('Navegação realizada:', success))
      .catch(error => console.error('Erro na navegação:', error));
  }
}

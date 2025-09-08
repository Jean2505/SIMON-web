import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

  @Input({ required: true }) notification: any;

  /**
   * Construtor do componente.
   * @param router - Serviço Router para navegação programática.
   */
  constructor(private router: Router) {}

  goEnlist(): void{
    this.router
      .navigate(['/student/enlist'])
      .then((success) => {
        console.log('Navegação realizada:', success);
        console.clear(); // Limpa console após navegação bem-sucedida
      })
      .catch((error) => console.error('Erro na navegação:', error));
  }
}

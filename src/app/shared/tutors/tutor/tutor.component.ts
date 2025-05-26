import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { type AvailableTime, type Tutor } from '../../../models/tutor.model';

/**
 * Componente de exibição de informações de um monitor.
 */
@Component({
  selector: 'app-tutor',
  standalone: true,
  imports: [],
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.scss'],
})
export class TutorComponent implements OnInit {
  /** Monitor a ser exibido */
  @Input({ required: true }) tutor!: Tutor;

  /**
   * Construtor do componente TutorComponent.
   * @param router - Serviço de roteamento para navegação.
   * @param route - Serviço de rota ativa para acessar parâmetros da rota.
   */
  constructor(
    /** Serviço de roteamento para navegação @type {Router} */
    private router: Router,
    /** Serviço de rota ativa para acessar parâmetros da rota @type {ActivatedRoute} */
    private route: ActivatedRoute
  ) {}

  /**
   * Hook chamado após a inicialização do componente
   */
  ngOnInit(): void {
    console.log('TutorComponent criado com tutor:', this.tutor.uid);
  }

  /**
   * Navega para o perfil do monitor
   */
  goTutor(): void {
    console.log('Navegando para o perfil do monitor:', this.tutor.uid);
    this.router.navigate(['tutor', this.tutor.uid], {
      relativeTo: this.route.pathFromRoot[1],
    });
  }

  /**
   * Método para obter o próximo horário disponível do monitor.
   * @returns {string} O próximo horário disponível no formato "Dia HH:MM"
   */
  nextAvailableTime(): string {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const todayIndex = new Date().getDay();

    // Ordena os dias a partir de hoje (cíclico na semana)
    const orderedDays = [...Array(7)].map((_, i) => (todayIndex + i) % 7);

    try {
      for (const dayIndex of orderedDays) {
        const dayName = days[dayIndex];

        const availabilityForDay = this.tutor.horarioDisponivel.find(
          (item) => item.day === dayName
        );

        if (availabilityForDay && availabilityForDay.time.length > 0) {
          // Pega o menor horário do dia (menor valor no array)
          const sortedTimes = availabilityForDay.time.sort((a, b) => a - b);
          const nextTime = sortedTimes[0];

          return `${dayName} ${nextTime.toString().padStart(2, '0')}:00`;
        }
      }
    } catch (error) {
      return 'sem horários disponíveis';
    }
    return 'sem horários disponíveis';
  }
}

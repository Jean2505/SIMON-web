import { Component, OnInit } from '@angular/core';
import { BackButtonComponent } from "../buttons/back-button/back-button.component";
import { NotificationComponent } from "./notification/notification.component";
import { HttpClient } from '@angular/common/http';
import { SessionStorageService } from '../../core/services/session-storage.service';

@Component({
  selector: 'app-notifications',
  imports: [BackButtonComponent, NotificationComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit{

  notifications: any [] = [];

  loadingNotifications = true;

  user: any;

    /**
   * Construtor do componente.
   * @param {HttpClient} http - HttpClient para requisições HTTP.
   * @param {SessionStorageService} sessionStorage - Serviço para gerenciar dados na sessão.
   */
  constructor(
    /** Cliente HTTP para comunicação com o backend @type {HttpClient} */
    private http: HttpClient,
    /** Serviço para gerenciar dados na sessão @type {SessionStorageService} */
    private sessionStorage: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.user = this.sessionStorage.getAllDataFromKey('user');
    this.loadNotifications(this.user.uid);
  }

  loadNotifications(uid: string) {
    this.http.post('http://localhost:3000/getNotifications', { studentUid: uid })
      .subscribe({
        next: (response: any) => {
          this.notifications = JSON.parse(response);
          console.log(this.notifications);
        },
        error: error => {
          console.error('Erro ao carregar notificações', error);
          return;
        }
      }
    );
  }
}

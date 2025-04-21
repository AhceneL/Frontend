import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';  // Importez le service
import { AuthService } from '../../services/auth.service';  // Importez le service AuthService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Importation de FormsModule pour ngModel

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Déclaration des imports requis pour un composant standalone
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications: any[] = [];  // Tableau pour stocker les notifications
  userEmail: string = '';  // Email de l'utilisateur connecté

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService  // Injection du service AuthService
  ) { }

  ngOnInit(): void {
    this.loadUserEmail();  // Charger l'email de l'utilisateur au démarrage
  }

  // Charger l'email de l'utilisateur à partir du token JWT
  loadUserEmail(): void {
    const email = this.authService.getTokenEmail();  // Récupérer l'email du JWT
    if (email) {
      this.userEmail = email;  // Stocker l'email de l'utilisateur
      this.loadNotifications();  // Charger les notifications
    } else {
      console.error('Utilisateur non authentifié');
    }
  }

  // Charger les notifications de l'utilisateur
  loadNotifications(): void {
    this.notificationService.getNotificationsForUser(this.userEmail).subscribe(
      (data) => {
        this.notifications = data;  // Stocker les notifications reçues
      },
      (error) => {
        console.error('Erreur lors de la récupération des notifications', error);
      }
    );
  }

  // Marquer une notification comme lue
  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe(
      () => {
        const notification = this.notifications.find(notif => notif.id === notificationId);
        if (notification) {
          notification.isRead = true;  // Mettre à jour localement l'état de la notification
        }
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la notification', error);
      }
    );
  }

  // Effacer toutes les notifications de l'utilisateur
  clearNotifications(): void {
    this.notificationService.clearNotificationsForUser(this.userEmail).subscribe(
      () => {
        this.notifications = [];  // Effacer les notifications localement
      },
      (error) => {
        console.error('Erreur lors de l\'effacement des notifications', error);
      }
    );
  }
}

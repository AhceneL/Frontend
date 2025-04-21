import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';  // Importez le service
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

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    const userId = 2;  // Remplacez par l'ID réel de l'utilisateur connecté
    this.notificationService.getNotificationsForUser(userId).subscribe(
      (data) => {
        this.notifications = data;  // Stocker les notifications reçues
      },
      (error) => {
        console.error('Erreur lors de la récupération des notifications', error);
      }
    );
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe(
      () => {
        // Mettre à jour l'état de la notification localement
        const notification = this.notifications.find(notif => notif.id === notificationId);
        if (notification) {
          notification.isRead = true;  // Marquer comme lue localement
        }
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la notification', error);
      }
    );
  }
}

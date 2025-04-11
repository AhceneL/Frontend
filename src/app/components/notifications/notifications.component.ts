import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  notifications = [
    { message: 'Nouvelle tâche assignée.', time: 'il y a 3 minutes' },
    { message: 'Commentaire ajouté sur une tâche.', time: 'il y a 1 heure' },
    { message: 'Avancement signalé sur un projet.', time: 'il y a 2 heures' }
  ];

  clearNotifications() {
    this.notifications = [];
  }
}

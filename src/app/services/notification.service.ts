import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:8080/api/notifications';  // L'URL de votre backend pour les notifications

  constructor(private http: HttpClient) { }

  // Méthode pour récupérer toutes les notifications d'un utilisateur
  getNotificationsForUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Méthode pour récupérer les notifications non lues d'un utilisateur
  getUnreadNotificationsForUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}/unread`);
  }

  // Méthode pour marquer une notification comme lue
  markAsRead(notificationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${notificationId}`, {});
  }

  // Méthode pour effacer toutes les notifications d'un utilisateur
  clearNotificationsForUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${userId}`);
  }
}

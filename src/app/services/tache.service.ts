import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  private apiUrl = 'http://localhost:8080/api/taches';

  constructor(private http: HttpClient) {}

  // ✅ Récupère toutes les tâches d’un projet donné
  getAllByProjet(projetId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projet/${projetId}`);
  }

  // ✅ Crée une tâche (assigneeEmail, projetId, etc.)
  create(tache: any): Observable<any> {
    console.log("📤 Envoi de la tâche au backend :", tache);
    return this.http.post<any>(this.apiUrl, tache);
  }

  // ✅ Modifie une tâche
  update(id: number, tache: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, tache);
  }

  // ✅ Supprime une tâche
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

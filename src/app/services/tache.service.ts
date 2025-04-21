import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  private apiUrl = 'http://localhost:8080/api/taches';

  constructor(private http: HttpClient) {}

  // ✅ Récupère toutes les tâches d’un projet donné
  getAllByProjet(projetId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projet/${projetId}`).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération des tâches:', err);
        alert('⚠️ Erreur lors de la récupération des tâches.');
        return throwError(err);
      })
    );
  }
  getTachesParMembre(projetId: number, email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projet/${projetId}/membre/${email}`).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération des tâches pour le membre:', err);
        alert('⚠️ Erreur lors de la récupération des tâches.');
        return throwError(err);
      })
    );
  }
  // ✅ Crée une tâche
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
  // ✅ Récupère une tâche par son ID
  getTacheById(tacheId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${tacheId}`).pipe(
      catchError(this.handleError)  // Gérer les erreurs
    );
}
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur inconnue est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur: ${error.status}, Message: ${error.message}`;
    }
    console.error('Erreur:', errorMessage);
    return throwError(errorMessage);  // Propage l'erreur
  }}

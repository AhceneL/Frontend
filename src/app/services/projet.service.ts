import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  private apiUrl = 'http://localhost:8080/api/projets';

  constructor(private http: HttpClient) {}

  // 🔄 Récupérer tous les projets (optionnel)
  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // ✅ Récupérer les projets du créateur connecté
  getMesProjets(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mes-projets`);
  }

  // ➕ Créer un projet
  create(projet: any): Observable<any> {
    return this.http.post(this.apiUrl, projet);
  }

  // 🔍 Obtenir un projet par ID
  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // ✏️ Modifier un projet
  update(id: number, projet: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, projet);
  }

  // ❌ Supprimer un projet
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

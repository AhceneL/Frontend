import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
  // Nouvelle méthode pour récupérer le profil de l'utilisateur
  getUserProfile(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/${email}`);
  }

  // Nouvelle méthode pour mettre à jour le profil de l'utilisateur
  updateUserProfile(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, user);
  }
}

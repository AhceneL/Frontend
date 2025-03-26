import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  login(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      const cachedUsers = JSON.parse(localStorage.getItem('users') || 'null');
      this.isAuthenticatedSubject.next(true);
      if (cachedUsers && Array.isArray(cachedUsers)) {
        this.processLogin(cachedUsers, email, password, observer);
      } else {
        this.http.get<any[]>('assets/users.json').subscribe({
          next: (fichierUsers) => {
            console.log('📁 Données chargées depuis users.json :', fichierUsers);
            localStorage.setItem('users', JSON.stringify(fichierUsers));
            this.processLogin(fichierUsers, email, password, observer);
          },
          error: (error) => {
            console.error('❌ Erreur lors du chargement de users.json', error);
            observer.error(error);
          }
        });
      }
    });
    
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  private processLogin(users: any[], email: string, password: string, observer: any) {
    console.log('🧪 Vérification identifiants :', email, password);
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      console.log('✅ Utilisateur trouvé :', user);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('currentUser', JSON.stringify(user));

      // ✅ Gestionnaire ou membre
      if (user.role === 'membre') {
        this.http.get<any[]>('assets/membres.json').subscribe({
          next: (membres) => {
            localStorage.setItem('membres', JSON.stringify(membres));
            console.log('📦 Données membres chargées.');
            observer.next(user);
            observer.complete();
          },
          error: (err) => {
            console.error('❌ Erreur chargement membres.json', err);
            observer.error(err);
          }
        });
      } else if (user.role === 'gestionnaire') {
        this.http.get<any[]>('assets/gestionnaires.json').subscribe({
          next: (gestionnaires) => {
            localStorage.setItem('gestionnaires', JSON.stringify(gestionnaires));
            console.log('📦 Données gestionnaires chargées.');
            observer.next(user);
            observer.complete();
          },
          error: (err) => {
            console.error('❌ Erreur chargement gestionnaires.json', err);
            observer.error(err);
          }
        });
      } else {
        // Rôle inconnu, mais valide quand même
        observer.next(user);
        observer.complete();
      }
    } else {
      console.warn('❌ Aucune correspondance email/mot de passe');
      observer.next(null);
      observer.complete();
      
    }

  }

  logout() {
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('users');
    localStorage.removeItem('membres');
    localStorage.removeItem('gestionnaires');
    
  }
}

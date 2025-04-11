import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const role = localStorage.getItem('userRole');
    console.log('AuthGuard - Rôle détecté:', role); //  Debug pour voir si un rôle est détecté

    if (role) {
      return true;  // Si un rôle est trouvé, autoriser l'accès
    } else {
      console.warn('AuthGuard - Aucun rôle détecté, redirection vers /403');
      this.router.navigate(['/403']);  // Redirige vers la page 403 si aucun rôle
      return false;
    }
  }
}

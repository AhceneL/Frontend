import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    if (!this.email || !this.password) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // ✅ Stockage du token et du rôle
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', response.user?.role || 'inconnu');

        alert('✅ Connexion réussie !');

        // ✅ Redirection selon le rôle
        if (response.user?.role === 'gestionnaire') {
          this.router.navigate(['/dashboard/gestionnaire']);
        } else if (response.user?.role === 'membre') {
          this.router.navigate(['/dashboard/membre']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        console.error('❌ Erreur lors de la connexion :', err);
        alert("❌ Email ou mot de passe incorrect.");
      }
    });
  }

  onRegister() {
    this.router.navigate(['/register']);
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // adapte le chemin si besoin

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  nom: string = '';
  prenom: string = '';
  email: string = '';
  password: string = '';
  role: string = 'membre';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const newUser = {
      email: this.email,
      nom: this.nom,
      prenom: this.prenom,
      password: this.password,
      role: this.role
    };

    this.authService.register(newUser).subscribe({
      next: () => {
        alert('✅ Inscription réussie !');
        this.router.navigate(['/auth']);
      },
      error: (err) => {
        console.error('❌ Erreur inscription :', err);
        alert('❌ Une erreur est survenue lors de l’inscription.');
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/auth']);
  }
}

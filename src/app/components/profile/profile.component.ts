import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';  // Importer AuthService
import { UserService } from '../../services/user.service';  // Importer UserService

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  originalUser: any = null;
  email: string = ''; // Pour stocker l'email de l'utilisateur

  // Liste des avatars disponibles
  avatars: string[] = [

    'assets/avatars/gestionnaire.jpg',
    'assets/avatars/membre.jpg',
    'assets/avatars/téléchargement (1).jpg',
    'assets/avatars/téléchargement (2).jpg'
  ];

  constructor(private router: Router,
              private authService: AuthService,
              private userService: UserService) {}

  ngOnInit(): void {
    const email = this.authService.getTokenEmail();

    if (email) {
      this.userService.getUserProfile(email).subscribe({
        next: (data) => {
          this.user = data;
          this.originalUser = { ...this.user }; // Pour restaurer en cas d'annulation

          // Vérifiez ici que l'avatar est bien dans la réponse
          console.log('Avatar récupéré:', this.user.avatar);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération du profil:', err);
          alert("❌ Impossible de récupérer le profil.");
          this.router.navigate(['/auth']);
        }
      });
    } else {
      alert("❌ Aucun utilisateur connecté.");
      this.router.navigate(['/auth']);
    }
  }


  saveChanges(): void {
    // Envoi des données mises à jour au backend via l'API
    this.userService.updateUserProfile(this.user).subscribe({
      next: (data) => {
        alert('✅ Profil mis à jour avec succès !');
        localStorage.setItem('currentUser', JSON.stringify(this.user));  // Mettre à jour les données dans localStorage
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du profil:', err);
        alert("❌ Erreur lors de la mise à jour du profil.");
      }
    });
  }

  cancel(): void {
    this.user = { ...this.originalUser }; // Restaurer les valeurs initiales
    this.router.navigate(['dashboard/' + localStorage.getItem('userRole')]);
  }

  logout(): void {
    this.authService.logout();
  }

  // Méthode pour changer l'avatar
  changeAvatar(avatar: string): void {
    this.user.avatar = avatar; // Mettre à jour l'avatar dans le profil
  }
}

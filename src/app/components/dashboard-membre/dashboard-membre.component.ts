import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjetService } from '../../services/projet.service';
import { TacheService } from '../../services/tache.service'; // Importer TacheService
import { AuthService } from '../../services/auth.service'; // Importer AuthService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-membre',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importer FormsModule et CommonModule pour utiliser ngFor et autres directives
  templateUrl: './dashboard-membre.component.html',
  styleUrls: ['./dashboard-membre.component.css']
})
export class DashboardMembreComponent implements OnInit {
  membreData: any = null;
  projets: any[] = [];

  constructor(
    private router: Router,
    private projetService: ProjetService,
    private tacheService: TacheService, // Injection du service TacheService
    private authService: AuthService // Injection du service AuthService
  ) {}

  ngOnInit(): void {
    // Utiliser AuthService pour récupérer l'email de l'utilisateur connecté
    const email = this.authService.getTokenEmail();  // Méthode personnalisée pour obtenir l'email du token
    console.log("Email récupéré depuis AuthService :", email);  // Log pour vérifier l'email

    if (!email) {
      console.error("⚠️ L'email est manquant ou l'utilisateur n'est pas connecté.");
      alert("Vous devez être connecté pour accéder à vos projets.");
      this.router.navigate(['/auth']);  // Redirige vers la page de connexion si l'email est manquant
      return;
    }

    // Charger les projets du membre connecté
    this.projetService.getProjetsParMembre(email).subscribe({
      next: (projets) => {
        if (projets && projets.length > 0) {
          this.projets = projets;
          console.log("Projets récupérés :", this.projets);

          // Pour chaque projet, récupérer les tâches assignées au membre et calculer leur nombre
          this.projets.forEach(projet => {
            this.tacheService.getTachesParMembre(projet.id, email).subscribe({
              next: (taches) => {
                projet.nombreDeTaches = taches.length; // Ajouter le nombre de tâches assignées à chaque projet
              },
              error: (err) => {
                console.error('Erreur lors de la récupération des tâches pour le membre:', err);
              }
            });
          });
        } else {
          console.warn('🔍 Aucun projet trouvé pour cet utilisateur.');
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des projets :', err);
        alert("⚠️ Impossible de charger les projets. Veuillez réessayer.");
      }
    });
  }

  // Méthode pour vérifier si une valeur est un tableau
  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  // Méthode pour récupérer le statut d'un projet pour un membre
  getStatutProjetPourMembre(taches: any[]): string {
    if (!Array.isArray(taches) || taches.length === 0) return 'Pas commencé';

    const total = taches.length;
    const terminees = taches.filter(t => t.statut?.toLowerCase() === 'terminé').length;

    if (terminees === total) return 'Terminé';
    if (terminees === 0) return 'Pas commencé';
    return 'En cours';
  }

  // Méthode pour récupérer la classe CSS basée sur le statut
  getClassForStatut(statut: string): string {
    switch (statut.toLowerCase()) {
      case 'terminé':
        return 'completed';
      case 'en cours':
        return 'in-progress';
      case 'pas commencé':
        return 'not-started';
      default:
        return 'unknown';
    }
  }

  // Méthode pour aller aux détails d'un projet
  goToDetailProjet(projectName: string) {
    this.router.navigate(['/dashboard/membre/detail-projet'], {
      queryParams: { projet: projectName }
    });
  }

  // Méthode pour suivre le projet par son nom
  trackByNom(index: number, projet: any): string {
    return projet.nom;
  }

  // Méthode pour gérer la navigation vers le profil de l'utilisateur
  goToProfil() {
    this.router.navigate(['/profil/edit']);
  }

  // Méthode pour voir le profil en mode consultation
  goToProfilView() {
    this.router.navigate(['/profil']);
  }
}

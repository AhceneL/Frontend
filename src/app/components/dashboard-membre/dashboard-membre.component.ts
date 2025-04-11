import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-membre',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-membre.component.html',
  styleUrls: ['./dashboard-membre.component.css']
})
export class DashboardMembreComponent implements OnInit {
  membreData: any = null;
  projets: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const data = localStorage.getItem('membres');
    const userId = localStorage.getItem('userId');

    if (data && userId) {
      try {
        const membres = JSON.parse(data);
        this.membreData = membres.find((m: any) => m.id === userId);

        // ✅ Ajouter avatar par défaut si manquant
        if (this.membreData && !this.membreData.avatar) {
          this.membreData.avatar = 'assets/avatar-par-defaut.jpg';
        }

        if (this.membreData && Array.isArray(this.membreData.projets)) {
          this.projets = this.membreData.projets;
        } else {
          console.warn('🔍 Aucun projet trouvé pour ce membre.');
          this.projets = [];
        }
      } catch (e) {
        console.error('❌ Erreur lors de la lecture du fichier membres.json :', e);
        this.projets = [];
      }
    } else {
      console.warn('⚠ Données utilisateur ou membres non trouvées dans localStorage.');
      this.projets = [];
    }
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  getStatutProjetPourMembre(taches: any[]): string {
    if (!Array.isArray(taches) || taches.length === 0) return 'Pas commencé';

    const total = taches.length;
    const terminees = taches.filter(t => t.statut?.toLowerCase() === 'terminé').length;

    if (terminees === total) return 'Terminé';
    if (terminees === 0) return 'Pas commencé';
    return 'En cours';
  }

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

  goToDetailProjet(projectName: string) {
    this.router.navigate(['/dashboard/membre/detail-projet'], {
      queryParams: { projet: projectName }
    });
  }

  goToProfil() {
    this.router.navigate(['/profil/edit']);
  }

  goToProfilView() {
    this.router.navigate(['/profil']);
  }

  trackByNom(index: number, projet: any): string {
    return projet.nom;
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjetService } from '../../services/projet.service';
import { TacheService } from '../../services/tache.service'; // Importer TacheService
import { AuthService } from '../../services/auth.service'; // Importer AuthService
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-projet-membre',
  standalone: true,
  templateUrl: './detail-projet-membre.component.html',
  styleUrls: ['./detail-projet-membre.component.css'],
  imports: [CommonModule, TitleCasePipe, FormsModule]
})
export class DetailProjetMembreComponent implements OnInit {
  membreData: any = null;
  projets: any[] = [];
  projetSelectionneNom: string = '';
  filtreActif: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projetService: ProjetService,
    private tacheService: TacheService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const email = this.authService.getTokenEmail();

    if (!email) {
      console.error("⚠️ L'email est manquant ou l'utilisateur n'est pas connecté.");
      alert("Vous devez être connecté pour accéder à vos projets.");
      this.router.navigate(['/auth']);
      return;
    }

    console.log("Email récupéré du token:", email);

    this.projetService.getProjetsParMembre(email).subscribe({
      next: (projets) => {
        console.log("Projets récupérés depuis le backend:", projets);
        if (projets && projets.length > 0) {
          this.projets = projets;

          const projetParam = this.route.snapshot.queryParamMap.get('projet');
          this.projetSelectionneNom = projetParam || this.projets[0]?.nom || '';

          console.log("Nom du projet sélectionné:", this.projetSelectionneNom);

          this.projets.forEach(projet => {
            console.log("Récupération des tâches pour le projet:", projet.nom);
            this.tacheService.getTachesParMembre(projet.id, email).subscribe({
              next: (taches) => {
                console.log("Tâches récupérées pour le projet", projet.nom, ":", taches);
                projet.nombreDeTaches = taches.length;
                projet.taches = taches;
              },
              error: (err) => {
                console.error('Erreur lors de la récupération des tâches pour le projet:', projet.nom, err);
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

  get projetSelectionne(): any {
    return this.projets.find((p: any) => p.nom === this.projetSelectionneNom);
  }

  getTachesFiltrees(): any[] {
    const projet = this.projetSelectionne;
    if (!projet || !projet.taches) {
      console.log("Aucune tâche à afficher pour le projet:", projet?.nom);
      return [];
    }

    const taches = projet.taches;
    console.log("Toutes les tâches du projet:", taches);

    if (this.filtreActif === 'enAttente') {
      return taches.filter((t: any) => t.statut?.toLowerCase() === 'en attente');
    } else if (this.filtreActif === 'enCours') {
      return taches.filter((t: any) => t.statut?.toLowerCase() === 'en cours');
    } else if (this.filtreActif === 'termine') {
      return taches.filter((t: any) => t.statut?.toLowerCase() === 'terminé');
    }
    return taches;  // Afficher toutes les tâches par défaut
  }

  setFiltre(val: string) {
    this.filtreActif = val;
    console.log("Filtre actif changé à:", val);
  }

  goToDetailTache(taskId: string) {
    console.log("Navigation vers les détails de la tâche avec ID:", taskId);
    this.router.navigate(['/dashboard/membre/detail-tache'], {
      queryParams: { taskId: taskId }  // Utilisation de taskId dans l'URL
    });
  }


  goToDashboard() {
    console.log("Retour au tableau de bord.");
    this.router.navigate(['/dashboard/membre']);
  }

  trackByNom(index: number, item: any) {
    return item.nom;
  }
}

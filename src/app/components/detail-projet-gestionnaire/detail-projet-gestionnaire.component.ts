import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjetService } from '../../services/projet.service';
import { TacheService } from '../../services/tache.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-detail-projet-gestionnaire',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './detail-projet-gestionnaire.component.html',
  styleUrls: ['./detail-projet-gestionnaire.component.css']
})
export class DetailProjetGestionnaireComponent implements OnInit {
  projectName: string = '';
  projet: any = null;
  taches: any[] = [];
  membreEmail: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projetService: ProjetService,
    private tacheService: TacheService
  ) {}

  ngOnInit(): void {
    // Récupérer le nom du projet depuis les queryParams et charger le projet
    this.route.queryParams.subscribe(params => {
      this.projectName = params['projet'];
      this.chargerProjetDepuisAPI();
    });
  }

  // Charger le projet depuis l'API avec le nom du projet
  chargerProjetDepuisAPI() {
    this.projetService.getAll().subscribe({
      next: (projets: any[]) => {
        // Rechercher le projet correspondant au nom
        this.projet = projets.find((p: any) => p.nom === this.projectName);
        if (this.projet) {
          this.chargerTaches(this.projet.id);  // Charger les tâches du projet
        } else {
          alert('❌ Projet non trouvé.');
        }
        console.log('Projet chargé :', this.projet);  // Debug pour vérifier les membres
      },
      error: () => {
        alert('❌ Impossible de charger les projets depuis le backend.');
      }
    });
  }

  // Charger les tâches du projet
  chargerTaches(projetId: number) {
    this.tacheService.getAllByProjet(projetId).subscribe({
      next: (data: any[]) => {
        console.log("Données des tâches reçues :", data);  // Vérification des données
        this.taches = data;
      },
      error: () => {
        alert('⚠️ Erreur lors du chargement des tâches.');
      }
    });
  }


  // Ajouter une tâche au projet
  addTask() {
    const titre = prompt('Nom de la tâche :');
    const dateLimite = prompt("Date limite (AAAA-MM-JJ) :", new Date().toISOString().split('T')[0]);
    const assigneeEmail = prompt("Email du membre assigné :");

    if (titre && assigneeEmail) {
      const assigneeId = this.getAssigneeIdByEmail(assigneeEmail);
      if (!assigneeId) {
        alert("❌ Aucun membre trouvé avec cet email dans ce projet.");
        return;
      }

      const tache = {
        titre,
        statut: 'en_attente',
        dateLimite,
        projetId: this.projet.id,
        assigneeId // ✅ c'est ce que le backend attend
      };

      console.log('Tâche à créer:', tache); // Log pour vérifier les données envoyées

      this.tacheService.create(tache).subscribe({
        next: () => {
          alert('✅ Tâche ajoutée avec succès !');
          this.chargerTaches(this.projet.id);
        },
        error: (err: any) => {
          alert(err.error?.message || 'Erreur lors de l’ajout de la tâche.');
        }
      });
    }
  }

  goToCreateTache() {
    this.router.navigate(['/dashboard/gestionnaire/detail-projet/creation-tache'], {
      queryParams: { projetId: this.projet.id }  // Passer l'ID du projet comme paramètre
    });
  }

  // Trouver l'ID du membre à partir de son email
  getAssigneeIdByEmail(email: string): number | null {
    if (!this.projet || !this.projet.membresEmails) {
      console.log("Les membres du projet ne sont pas encore définis.");
      return null;
    }
    const membreEmail = this.projet.membresEmails.find((emailInList: string) => emailInList === email);
    if (membreEmail) {
      // Assurez-vous que les membres sont chargés et associés correctement
      const membre = this.projet.membres.find((m: any) => m.email === email);
      return membre ? membre.id : null;
    }
    return null;
  }


  // Ajouter un membre au projet
  addMember() {
    const email = prompt("Email du membre à ajouter :");
    if (!email) return;

    if (!this.projet.membresEmails) this.projet.membresEmails = [];

    if (this.projet.membresEmails.includes(email)) {
      alert("⚠️ Ce membre est déjà assigné au projet.");
      return;
    }

    // Appel API pour ajouter un membre au projet
    this.projetService.addMemberToProject(this.projet.id, email).subscribe({
      next: () => {
        alert(`✅ Membre ${email} ajouté avec succès.`);
        this.chargerProjetDepuisAPI();  // Recharger le projet pour mettre à jour la liste des membres
      },
      error: (err) => {
        alert(err.error?.message || 'Erreur lors de l’ajout du membre.');
      }
    });
  }

  // Supprimer le projet
  deleteProject() {
    if (!this.projet?.id) return;

    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
    if (!confirmation) return;

    // Appel API pour supprimer le projet
    this.projetService.delete(this.projet.id).subscribe({
      next: () => {
        alert("🚮 Projet supprimé.");
        this.router.navigate(['/dashboard/gestionnaire']);  // Rediriger vers le dashboard
      },
      error: () => {
        alert("❌ Échec de la suppression du projet.");
      }
    });
  }

  // Aller aux détails de la tâche
  goToDetailTache(task: any) {
    this.router.navigate(['/dashboard/gestionnaire/detail-tache'], {
      queryParams: { taskId: task.id }
    });
  }

  // Aller à la modification de la tâche
  goToModificationTache(task: any) {
    this.router.navigate(['/dashboard/gestionnaire/modification-tache'], {
      queryParams: {
        id: task.id,
        titre: task.titre,
        dateLimite: task.dateLimite
      }
    });
  }

  // Aller au tableau de bord des gestionnaires
  goToDashboard() {
    this.router.navigate(['/dashboard/gestionnaire']);
  }

  // Se déconnecter
  logout() {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }
}

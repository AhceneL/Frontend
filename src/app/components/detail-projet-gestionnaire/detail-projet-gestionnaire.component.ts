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
    this.route.queryParams.subscribe(params => {
      this.projectName = params['projet'];
      this.chargerProjetDepuisAPI();
    });
  }

  chargerProjetDepuisAPI() {
    this.projetService.getAll().subscribe({
      next: (projets: any[]) => {
        this.projet = projets.find((p: any) => p.nom === this.projectName);
        if (this.projet) {
          this.chargerTaches(this.projet.id);
        }
      },
      error: () => {
        alert('❌ Impossible de charger les projets depuis le backend.');
      }
    });
  }

  chargerTaches(projetId: number) {
    this.tacheService.getAllByProjet(projetId).subscribe({
      next: (data: any[]) => {
        this.taches = data;
      },
      error: () => {
        alert('⚠️ Erreur lors du chargement des tâches.');
      }
    });
  }

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

  // ✅ Trouver l’ID du membre à partir de son email
  getAssigneeIdByEmail(email: string): number | null {
    if (!this.projet || !this.projet.membres) return null;
    const membre = this.projet.membres.find((m: any) => m.email === email);
    return membre ? membre.id : null;
  }

  addMember() {
    const email = prompt("Email du membre à ajouter :");
    if (!email) return;

    if (!this.projet.membresEmails) this.projet.membresEmails = [];

    if (this.projet.membresEmails.includes(email)) {
      alert("⚠️ Ce membre est déjà assigné au projet.");
      return;
    }

    this.projet.membresEmails.push(email);

    this.projetService.update(this.projet.id, this.projet).subscribe({
      next: () => {
        alert(`✅ Membre ${email} ajouté avec succès.`);
      },
      error: (err) => {
        alert(err.error?.message || 'Erreur lors de l’ajout du membre.');
      }
    });
  }

  deleteProject() {
    if (!this.projet?.id) return;

    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
    if (!confirmation) return;

    this.projetService.delete(this.projet.id).subscribe({
      next: () => {
        alert("🚮 Projet supprimé.");
        this.router.navigate(['/dashboard/gestionnaire']);
      },
      error: () => {
        alert("❌ Échec de la suppression du projet.");
      }
    });
  }

  goToDetailTache(task: any) {
    this.router.navigate(['/dashboard/gestionnaire/detail-tache'], {
      queryParams: { taskId: task.id }
    });
  }

  goToModificationTache(task: any) {
    this.router.navigate(['/dashboard/gestionnaire/modification-tache'], {
      queryParams: {
        id: task.id,
        titre: task.titre,
        dateLimite: task.dateLimite
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard/gestionnaire']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }
}

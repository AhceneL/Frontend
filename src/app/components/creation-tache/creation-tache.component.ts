import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Importation de FormsModule
import { CommonModule } from '@angular/common';  // Module commun pour les directives de base
import { ProjetService } from '../../services/projet.service';
import { TacheService } from '../../services/tache.service';

@Component({
  selector: 'app-creation-tache',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Ajout de FormsModule pour ngModel
  templateUrl: './creation-tache.component.html',
  styleUrls: ['./creation-tache.component.css']
})
export class CreationTacheComponent {
  taskTitle: string = '';
  taskDescription: string = '';
  assignedMember: string = '';
  taskStatus: string = 'En attente';

  members: string[] = []; // Liste des membres du projet
  projetId: number = 1;  // ID du projet (vous pouvez ajuster cela selon votre logique)

  constructor(
    private router: Router,
    private projetService: ProjetService,
    private tacheService: TacheService
  ) {}

  ngOnInit(): void {
    this.loadMembers();  // Charger les membres lors de l'initialisation
  }

  // Charger dynamiquement les membres assignables au projet depuis l'API
  loadMembers() {
    if (!this.projetId) {
      console.log("Aucun projet ID trouvé.");
      return;
    }

    console.log("Récupération des membres pour le projet ID :", this.projetId);

    this.projetService.getAll().subscribe({
      next: (projets: any[]) => {
        console.log("Projets récupérés :", projets);  // Log pour afficher tous les projets récupérés
        const projet = projets.find(p => p.id === this.projetId);  // Utiliser l'ID du projet pour filtrer
        if (projet) {
          console.log("Projet trouvé :", projet);  // Log pour afficher le projet trouvé
          if (projet.membresEmails && projet.membresEmails.length > 0) {
            this.members = projet.membresEmails;  // Suppose que 'membresEmails' contient les emails des membres
            console.log("Membres récupérés :", this.members);  // Log pour afficher les membres récupérés
          } else {
            alert('⚠️ Aucun membre trouvé pour ce projet.');
            console.log("Aucun membre trouvé pour le projet ID", this.projetId);
          }
        } else {
          alert('⚠️ Projet non trouvé avec cet ID.');
          console.log('Aucun projet trouvé avec cet ID :', this.projetId);
        }
      },
      error: (err) => {
        alert('⚠️ Impossible de récupérer les membres du projet.');
        console.error("Erreur lors de la récupération des projets :", err);  // Log pour afficher l'erreur
      }
    });
  }

  // Ajouter une tâche et sauvegarder dans le backend
  addTask() {
    if (this.taskTitle.trim() === '' || this.assignedMember.trim() === '') {
      alert('❌ Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Vérification de l'ID du membre assigné
    const assigneeId = this.getAssigneeIdByEmail(this.assignedMember);
    if (assigneeId === null) {
      alert('❌ Le membre assigné est invalide.');
      return;
    }

    const tache = {
      titre: this.taskTitle,
      description: this.taskDescription,
      statut: this.taskStatus,
      projetId: this.projetId,  // Assurez-vous de récupérer l'ID du projet
      assigneeId  // Trouver l'ID du membre
    };

    console.log("📤 Envoi de la tâche au backend :", tache);

    this.tacheService.create(tache).subscribe({
      next: () => {
        alert('✅ Tâche ajoutée avec succès !');
        this.router.navigate(['/dashboard/gestionnaire/detail-projet']);
      },
      error: (err) => {
        console.error("Erreur lors de l’ajout de la tâche :", err);  // Log détaillé de l'erreur
        alert(err.error?.message || 'Erreur lors de l’ajout de la tâche.');
      }
    });
  }

  // Trouver l'ID du membre à partir de son email
  getAssigneeIdByEmail(email: string): number | null {
    const membre = this.members.find((emailInList: string) => emailInList === email);
    return membre ? this.members.indexOf(membre) : null;
  }

  // Annuler et revenir aux détails du projet sans ajouter de tâche
  cancel() {
    this.router.navigate(['/dashboard/gestionnaire/detail-projet']);
  }

  // Retour au tableau de bord des gestionnaires
  goToDashboard() {
    this.router.navigate(['/dashboard/gestionnaire']);
  }
}

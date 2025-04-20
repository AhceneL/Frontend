import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';  // Ajoutez ActivatedRoute
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
export class CreationTacheComponent implements OnInit {
  taskTitle: string = '';
  taskDescription: string = '';
  assignedMember: string = '';  // L'email du membre assigné
  taskStatus: string = 'En attente';
  taskDateLimite: string = '';  // Date limite de la tâche

  members: string[] = []; // Liste des membres du projet (emails)
  projetId: number = 0;  // ID du projet (initialisé à 0, sera mis à jour via l'URL)

  constructor(
    private router: Router,
    private projetService: ProjetService,
    private tacheService: TacheService,
    private route: ActivatedRoute  // Injection d'ActivatedRoute pour accéder aux paramètres de l'URL
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du projet depuis les paramètres de l'URL
    this.projetId = Number(this.route.snapshot.queryParamMap.get('projetId'));  // Utilisation de queryParamMap
    console.log("ID du projet récupéré depuis l'URL :", this.projetId);

    // Si l'ID du projet est valide, charger les membres
    if (this.projetId > 0) {
      this.loadMembers();  // Charger les membres du projet
    } else {
      alert('❌ L\'ID du projet est manquant ou incorrect.');
    }
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
    if (this.taskTitle.trim() === '' || this.assignedMember.trim() === '' || this.taskDateLimite.trim() === '') {
      alert('❌ Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Envoi de la tâche avec l'email assigné et la date limite
    const tache = {
      titre: this.taskTitle,
      description: this.taskDescription,
      statut: this.taskStatus,
      projetId: this.projetId,  // Assurez-vous de récupérer l'ID du projet
      assigneeEmail: this.assignedMember,  // L'email du membre assigné
      dateLimite: this.taskDateLimite  // La date limite de la tâche
    };

    console.log("📤 Envoi de la tâche au backend :", tache);

    this.tacheService.create(tache).subscribe({
      next: () => {
        alert('✅ Tâche ajoutée avec succès !');
        // Revenir à la page des détails du projet en ajoutant un paramètre de query
        this.router.navigate(['/dashboard/gestionnaire/detail-projet'], {
          queryParams: { projet: `projet ${this.projetId}` }
        });
      },
      error: (err) => {
        console.error("Erreur lors de l’ajout de la tâche :", err);  // Log détaillé de l'erreur
        alert(err.error?.message || 'Erreur lors de l’ajout de la tâche.');
      }
    });
  }

  // Annuler et revenir aux détails du projet sans ajouter de tâche
  cancel() {
    this.router.navigate(['/dashboard/gestionnaire/detail-projet'], {
      queryParams: { projet: `projet ${this.projetId}` }
    });
  }

  // Retour au tableau de bord des gestionnaires
  goToDashboard() {
    this.router.navigate(['/dashboard/gestionnaire']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';  // Assurez-vous que ActivatedRoute est importé ici
import { ProjetService } from '../../services/projet.service';
import { TacheService } from '../../services/tache.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-creation-tache',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './creation-tache.component.html',
  styleUrls: ['./creation-tache.component.css']
})
export class CreationTacheComponent implements OnInit {
  taskTitle: string = '';
  taskDescription: string = '';
  assignedMember: string = '';
  taskStatus: string = 'En attente';
  taskDateLimite: string = '';
  today: string = '';

  members: string[] = [];
  projetId: number = 0;
  projets: any[] = [];

  constructor(
    private router: Router,
    private projetService: ProjetService,
    private tacheService: TacheService,
    private route: ActivatedRoute  // Activation de ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Initialiser la variable today à la date d'aujourd'hui au format 'YYYY-MM-DD'
    const todayDate = new Date();
    this.today = todayDate.toISOString().split('T')[0];  // Format 'YYYY-MM-DD'

    this.projetId = Number(this.route.snapshot.queryParamMap.get('projetId'));
    console.log('ID du projet récupéré depuis l\'URL :', this.projetId);

    if (this.projetId > 0) {
      this.loadMembers();
      this.loadProjects();
    } else {
      alert('❌ L\'ID du projet est manquant ou incorrect.');
    }
  }

  loadMembers() {
    if (!this.projetId) {
      console.log('Aucun projet ID trouvé.');
      return;
    }

    console.log('Récupération des membres pour le projet ID :', this.projetId);

    this.projetService.getAll().subscribe({
      next: (projets: any[]) => {
        console.log('Projets récupérés :', projets);
        const projet = projets.find((p) => p.id === this.projetId);
        if (projet) {
          console.log('Projet trouvé :', projet);
          if (projet.membresEmails && projet.membresEmails.length > 0) {
            this.members = projet.membresEmails;
            console.log('Membres récupérés :', this.members);
          } else {
            alert('⚠️ Aucun membre trouvé pour ce projet.');
            console.log('Aucun membre trouvé pour le projet ID', this.projetId);
          }
        } else {
          alert('⚠️ Projet non trouvé avec cet ID.');
          console.log('Aucun projet trouvé avec cet ID :', this.projetId);
        }
      },
      error: (err) => {
        alert('⚠️ Impossible de récupérer les membres du projet.');
        console.error('Erreur lors de la récupération des projets :', err);
      }
    });
  }

  loadProjects() {
    this.projetService.getAll().subscribe({
      next: (data) => {
        this.projets = data;
        console.log('Projets récupérés pour le gestionnaire :', this.projets);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des projets :', err);
        alert('⚠️ Impossible de charger les projets.');
      }
    });
  }

  addTask() {
    if (this.taskTitle.trim() === '' || this.assignedMember.trim() === '' || this.taskDateLimite.trim() === '') {
      alert('❌ Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const tache = {
      titre: this.taskTitle,
      description: this.taskDescription,
      statut: this.taskStatus,
      projetId: this.projetId,
      assigneeEmail: this.assignedMember,
      dateLimite: this.taskDateLimite
    };

    console.log('📤 Envoi de la tâche au backend :', tache);

    this.tacheService.create(tache).subscribe({
      next: () => {
        alert('✅ Tâche ajoutée avec succès !');
        const projet = this.projets.find((p) => p.id === this.projetId);
        const projectName = projet ? projet.nom : 'Nom du projet inconnu';
        this.router.navigate(['/dashboard/gestionnaire/detail-projet'], {
          queryParams: { projet: projectName }
        });
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la tâche :', err);
        alert(err.error?.message || 'Erreur lors de l\'ajout de la tâche.');
      }
    });
  }

  cancel() {
    const projet = this.projets.find((p) => p.id === this.projetId);
    const projectName = projet ? projet.nom : 'Nom du projet inconnu';
    this.router.navigate(['/dashboard/gestionnaire/detail-projet'], {
      queryParams: { projet: projectName }
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard/gestionnaire']);
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TacheService } from '../../services/tache.service'; // Assurez-vous que ce service est bien importé
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-tache-membre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-tache-membre.component.html',
  styleUrls: ['./detail-tache-membre.component.css']
})
export class DetailTacheMembreComponent implements OnInit {
  taskId: string = '';  // ID de la tâche récupéré depuis l'URL
  taskData: any = null;  // Détails de la tâche
  comments: string = '';  // Commentaires de la tâche
  file: File | null = null;  // Fichier ajouté à la tâche
  status: string = '';  // Statut de la tâche
  dueDate: string = '';  // Date d'échéance de la tâche
  assignedTo: string = '';  // Personne assignée à la tâche
  description: string = '';  // Description de la tâche

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tacheService: TacheService  // Service pour récupérer la tâche
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.taskId = params['taskId'] || '';  // Vérification de la récupération du taskId

      if (!this.taskId) {
        console.error("❌ L'ID de la tâche est manquant.");
        alert("Aucune tâche trouvée pour ce nom.");
        return;
      }

      // Charger la tâche à partir de l'API
      this.chargerTache(Number(this.taskId));
    });
  }

  // Charger les détails de la tâche via l'API
  chargerTache(taskId: number) {
    this.tacheService.getTacheById(taskId).subscribe({
      next: (data: any) => {
        if (data) {
          this.taskData = data;  // Récupérer les détails de la tâche
          this.status = this.taskData.statut || '';  // Initialiser le statut
          this.dueDate = this.taskData.dateLimite || '';  // Initialiser la date d'échéance
          this.assignedTo = this.taskData.assigneeEmail || '';  // Initialiser l'assignation
          this.description = this.taskData.description || '';  // Initialiser la description
        } else {
          alert("❌ Tâche introuvable.");
        }
      },
      error: (err) => {
        console.error("Erreur lors du chargement de la tâche:", err);
        alert("❌ Impossible de charger la tâche. Erreur: " + err);
      }
    });
  }

  // Mettre à jour le statut de la tâche
  updateStatus(newStatus: string) {
    this.status = newStatus;
  }

  // Ajouter un commentaire à la tâche
  addComment() {
    if (this.comments.trim()) {
      if (!this.taskData.commentaires) this.taskData.commentaires = [];
      this.taskData.commentaires.push(this.comments.trim());
      this.comments = '';
      this.enregistrer();
      alert('💬 Commentaire ajouté avec succès !');
    } else {
      alert('❗ Veuillez entrer un commentaire.');
    }
  }

  // Gérer le téléchargement de fichier
  handleFileInput(event: any) {
    if (event.target.files.length > 0) {
      const fichier = event.target.files[0];
      if (this.taskData && fichier) {
        this.file = fichier;
        this.taskData.fichier = fichier.name;  // Mettre à jour le fichier
        this.enregistrer();
        alert(`📎 Fichier "${fichier.name}" ajouté à la tâche.`);
      }
    } else {
      alert('Aucun fichier sélectionné.');
    }
  }

  saveTask() {
    if (this.taskData) {
      // Met à jour les propriétés de la tâche
      this.taskData.statut = this.status;
      this.taskData.dateEcheance = this.dueDate;
      this.taskData.assigneeEmail = this.assignedTo;
      this.taskData.description = this.description;

      // Vérifie si un commentaire est ajouté
      if (this.comments.trim()) {
        if (!this.taskData.commentaires) this.taskData.commentaires = [];
        this.taskData.commentaires.push(this.comments.trim());
        this.comments = '';
      }

      // Vérifie si un fichier a été ajouté
      if (this.file) {
        this.taskData.fichier = this.file.name;
      }

      // Enregistre les changements via l'API
      this.enregistrer();

      alert('✅ Tâche mise à jour et sauvegardée avec succès.');
    } else {
      alert('❌ Erreur : aucune tâche à mettre à jour.');
    }
  }

  enregistrer() {
    console.log("Enregistrement de la tâche mise à jour:", this.taskData);

    // Enregistrer la tâche dans le backend via l'API
    this.tacheService.update(this.taskData.id, this.taskData).subscribe({
      next: (data) => {
        console.log("Tâche mise à jour avec succès :", data);
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour de la tâche", err);
        alert("❌ Erreur lors de la mise à jour de la tâche");
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard/membre']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }
}

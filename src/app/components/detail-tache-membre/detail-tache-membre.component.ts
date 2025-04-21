import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TacheService } from '../../services/tache.service';  // Assurez-vous que ce service est bien importé
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
    // Récupérer l'ID de la tâche depuis les query params
    this.route.queryParams.subscribe(params => {
      this.taskId = params['taskId'] || '';  // Vérification de la récupération du taskId
      console.log("taskId récupéré : ", this.taskId);  // Affichage pour vérifier l'ID de la tâche

      // Vérifier si l'ID de la tâche est présent
      if (!this.taskId) {
        console.error("❌ L'ID de la tâche est manquant.");
        alert("Aucune tâche trouvée pour ce nom.");
        return;
      }

      // Appeler l'API pour récupérer les détails de la tâche
      console.log("Appel API pour récupérer la tâche avec l'ID:", this.taskId);
      this.chargerTache(Number(this.taskId));  // Convertir taskId en nombre et charger la tâche
    });
  }

  // Charger les détails de la tâche via l'API
  chargerTache(taskId: number) {
    console.log('Appel de l\'API pour récupérer la tâche avec l\'ID:', taskId);

    this.tacheService.getTacheById(taskId).subscribe({
      next: (data: any) => {
        console.log('Données récupérées de l\'API:', data);

        if (data) {
          this.taskData = data;  // Récupérer les détails de la tâche
          this.status = this.taskData.statut || '';  // Initialiser le statut
          this.dueDate = this.taskData.dateLimite || '';  // Initialiser la date d'échéance
          this.assignedTo = this.taskData.assigneeEmail || '';  // Initialiser l'assignation
          this.description = this.taskData.description || '';  // Initialiser la description

          console.log("Tâche trouvée : ", this.taskData);
        } else {
          console.log('Aucune tâche trouvée pour l\'ID:', taskId);
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
    console.log("Mise à jour du statut : ", newStatus);  // Log de la mise à jour du statut
    if (this.taskData) {
      this.taskData.statut = newStatus;
      alert(`✅ Statut mis à jour : ${newStatus}`);
    }
  }

  // Ajouter un commentaire à la tâche
  addComment() {
    if (this.comments.trim()) {
      console.log("Ajout du commentaire : ", this.comments);  // Log du commentaire ajouté
      if (!this.taskData.commentaires) {
        this.taskData.commentaires = [];
      }

      // Vérification pour éviter les doublons
      if (!this.taskData.commentaires.includes(this.comments.trim())) {
        this.taskData.commentaires.push(this.comments.trim());
        alert(`💬 Commentaire ajouté avec succès : ${this.comments}`);
      } else {
        alert('❗ Ce commentaire a déjà été ajouté.');
      }

      this.comments = '';
      this.enregistrer();
    } else {
      alert('❗ Veuillez entrer un commentaire.');
    }
  }

  // Gérer le téléchargement de fichier
  handleFileInput(event: any) {
    if (event.target.files.length > 0) {
      console.log("Fichier sélectionné : ", event.target.files[0]);  // Log du fichier sélectionné
      this.file = event.target.files[0];
    }
  }

  saveTask() {
    // Vérification si la tâche existe dans le composant
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
        this.comments = ''; // Réinitialiser après ajout
      }

      // Vérifie si un fichier a été ajouté
      if (this.file) {
        this.taskData.fichier = this.file.name;
      }

      // Enregistrer les modifications via l'API
      this.enregistrer();

      alert('✅ Tâche mise à jour et sauvegardée avec succès.');
      console.log("Données envoyées au backend:", {
        id: this.taskData.id,
        statut: this.taskData.statut,
        dateEcheance: this.taskData.dateEcheance,
        assigneA: this.taskData.assigneA,
        description: this.taskData.description,
        commentaires: this.taskData.commentaires,
        fichier: this.taskData.fichier
      });
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
    console.log('Retour au tableau de bord');
    this.router.navigate(['/dashboard/membre']);
  }

  logout() {
    console.log('Déconnexion...');
    localStorage.clear();
    this.router.navigate(['/auth']);
  }
}

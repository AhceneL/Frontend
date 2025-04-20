import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TacheService } from '../../services/tache.service'; // Assurez-vous que ce service est correctement importé
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-detail-tache-gest',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './detail-tache-gest.component.html',
  styleUrls: ['./detail-tache-gest.component.css']
})
export class DetailTacheGestComponent implements OnInit {
  taskName: string = '';
  dueDate: string = '';
  assignedTo: string = '';
  description: string = '';
  status: string = '';
  comments: string = '';
  file: File | null = null;

  gestionnaireId: string = '';
  gestionnaireData: any = null;
  projetParent: any = null;
  tache: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tacheService: TacheService // Injecter le service pour récupérer les données de l'API
  ) {}

  ngOnInit(): void {
    console.log('Chargement du composant...');

    this.route.queryParams.subscribe(params => {
      const taskId = params['taskId'];  // Récupérer l'ID de la tâche depuis l'URL
      console.log('taskId récupéré:', taskId);

      if (taskId) {
        // Convertir taskId en nombre
        const taskIdNumber = Number(taskId);
        console.log('taskId converti en nombre:', taskIdNumber);

        if (!isNaN(taskIdNumber)) {
          this.chargerTache(taskIdNumber);  // Charger la tâche via l'API
        } else {
          alert("❌ L'ID de la tâche n'est pas valide !");
        }
      } else {
        alert("❌ L'ID de la tâche est manquant !");
      }
    });
  }

  chargerTache(taskId: number) {
    console.log('Appel de l\'API pour récupérer la tâche avec l\'ID:', taskId);

    this.tacheService.getTacheById(taskId).subscribe({
      next: (data: any) => {
        console.log('Données récupérées de l\'API:', data);

        if (data) {
          this.tache = data;  // Récupérer les détails de la tâche
          this.status = this.tache.statut;
          this.dueDate = this.tache.dateLimite;
          this.assignedTo = this.tache.assigneA || '';
          this.description = this.tache.description || '';
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

  updateStatus(newStatus: string) {
    this.status = newStatus;
  }

  addComment() {
    if (this.comments.trim()) {
      if (!this.tache.commentaires) this.tache.commentaires = [];
      this.tache.commentaires.push(this.comments.trim());
      this.comments = '';
      this.enregistrer();
      alert('💬 Commentaire ajouté avec succès !');
    } else {
      alert('❗ Veuillez entrer un commentaire.');
    }
  }

  handleFileInput(event: any) {
    if (event.target.files.length > 0) {
      const fichier = event.target.files[0];
      if (this.tache && fichier) {
        this.file = fichier;
        this.tache.fichier = fichier.name;
        this.enregistrer();
        alert(`📎 Fichier "${fichier.name}" ajouté à la tâche.`);
      }
    } else {
      alert('Aucun fichier sélectionné.');
    }
  }

  saveTask() {
    if (this.tache) {
      // Met à jour les propriétés de la tâche
      this.tache.statut = this.status;
      this.tache.dateEcheance = this.dueDate;
      this.tache.assigneA = this.assignedTo;
      this.tache.description = this.description;

      // Vérifie si un commentaire est ajouté
      if (this.comments.trim()) {
        if (!this.tache.commentaires) this.tache.commentaires = [];
        this.tache.commentaires.push(this.comments.trim());
        this.comments = '';
      }

      // Vérifie si un fichier a été ajouté
      if (this.file) {
        this.tache.fichier = this.file.name;
      }

      // Enregistre les changements via l'API
      this.enregistrer();

      alert('✅ Tâche mise à jour et sauvegardée avec succès.');
    } else {
      alert('❌ Erreur : aucune tâche à mettre à jour.');
    }
  }

  enregistrer() {
    console.log("Enregistrement de la tâche mise à jour:", this.tache);

    // Enregistrer la tâche dans le backend via l'API
    this.tacheService.update(this.tache.id, this.tache).subscribe({
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
    this.router.navigate(['/dashboard/gestionnaire']);
  }

  logout() {
    console.log('Déconnexion...');
    localStorage.clear();
    this.router.navigate(['/auth']);
  }
}

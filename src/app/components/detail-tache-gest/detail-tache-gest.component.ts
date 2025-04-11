import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-tache-gest',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-tache-gest.component.html',
  styleUrls: ['./detail-tache-gest.component.css']
})
export class DetailTacheGestComponent {
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

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.taskName = params['task'];
      this.gestionnaireId = localStorage.getItem('userId') || '';
      this.chargerTache();
    });
  }

  chargerTache() {
    const data = localStorage.getItem('gestionnaires');
    if (!data || !this.gestionnaireId || !this.taskName) return;

    const gestionnaires = JSON.parse(data);
    this.gestionnaireData = gestionnaires.find((g: any) => g.id === this.gestionnaireId);
    if (!this.gestionnaireData) return;

    for (let projet of this.gestionnaireData.projets) {
      const tacheTrouvee = projet.taches.find((t: any) => t.nom === this.taskName);
      if (tacheTrouvee) {
        this.projetParent = projet;
        this.tache = tacheTrouvee;
        this.status = this.tache.statut;
        this.dueDate = this.tache.dateEcheance;
        this.assignedTo = this.tache.assigneA || '';
        this.description = this.tache.description || '';
        break;
      }
    }
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

      // Vérifie si commentaire non vide
      if (this.comments.trim()) {
        if (!this.tache.commentaires) this.tache.commentaires = [];
        this.tache.commentaires.push(this.comments.trim());
        this.comments = '';
      }

      // Vérifie si un fichier a été ajouté
      if (this.file) {
        this.tache.fichier = this.file.name;
      }

      // Enregistre les changements dans le localStorage
      this.enregistrer();

      alert('✅ Tâche mise à jour et sauvegardée avec succès.');
    } else {
      alert('❌ Erreur : aucune tâche à mettre à jour.');
    }
  }

  enregistrer() {
    const allGestionnaires = JSON.parse(localStorage.getItem('gestionnaires') || '[]');
    const index = allGestionnaires.findIndex((g: any) => g.id === this.gestionnaireId);
    if (index !== -1) {
      allGestionnaires[index] = this.gestionnaireData;
      localStorage.setItem('gestionnaires', JSON.stringify(allGestionnaires));
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard/gestionnaire']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }
}

import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modification-tache',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modification-tache.component.html',
  styleUrls: ['./modification-tache.component.css']
})
export class ModificationTacheComponent {
  taskTitle: string = '';
  taskDescription: string = '';
  taskStatus: string = 'En attente';

  gestionnaireId: string = '';
  gestionnaireData: any = null;
  projetParent: any = null;
  tache: any = null;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      const taskName = params['title'];
      this.gestionnaireId = localStorage.getItem('userId') || '';
      this.chargerTache(taskName);
    });
  }

  chargerTache(taskName: string) {
    const data = localStorage.getItem('gestionnaires');
    if (!data || !this.gestionnaireId || !taskName) return;

    const gestionnaires = JSON.parse(data);
    this.gestionnaireData = gestionnaires.find((g: any) => g.id === this.gestionnaireId);

    if (!this.gestionnaireData) return;

    for (let projet of this.gestionnaireData.projets) {
      const tacheTrouvee = projet.taches.find((t: any) => t.nom === taskName);
      if (tacheTrouvee) {
        this.tache = tacheTrouvee;
        this.projetParent = projet;

        this.taskTitle = this.tache.nom;
        this.taskDescription = this.tache.description || '';
        this.taskStatus = this.tache.statut;
        break;
      }
    }
  }

  saveTask() {
    if (this.tache) {
      this.tache.nom = this.taskTitle;
      this.tache.description = this.taskDescription;
      this.tache.statut = this.taskStatus;

      this.enregistrer();
      alert('✅ Tâche modifiée avec succès.');
      this.router.navigate(['/dashboard/gestionnaire/detail-projet'], {
        queryParams: { projet: this.projetParent?.nom }
      });
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

  cancel() {
    this.router.navigate(['/dashboard/gestionnaire/detail-projet'], {
      queryParams: { projet: this.projetParent?.nom }
    });
  }
}

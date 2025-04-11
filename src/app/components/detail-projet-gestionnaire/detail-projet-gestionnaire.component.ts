import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-projet-gestionnaire',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-projet-gestionnaire.component.html',
  styleUrls: ['./detail-projet-gestionnaire.component.css']
})
export class DetailProjetGestionnaireComponent {
  projectName: string = '';
  projet: any = null;
  gestionnaireId: string = '';
  gestionnaireData: any = null;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.projectName = params['projet'];
      this.gestionnaireId = localStorage.getItem('userId') || '';
      this.chargerProjet();
    });
  }

  chargerProjet() {
    const data = localStorage.getItem('gestionnaires');
    if (!data || !this.gestionnaireId) return;

    const gestionnaires = JSON.parse(data);
    this.gestionnaireData = gestionnaires.find((g: any) => g.id === this.gestionnaireId);

    if (this.gestionnaireData && this.gestionnaireData.projets) {
      this.projet = this.gestionnaireData.projets.find((p: any) => p.nom === this.projectName);
    }
  }

  addTask() {
    const taskName = prompt('Nom de la tâche :');
    if (taskName && this.projet) {
      const nouvelleTache = {
        nom: taskName,
        statut: 'pas commencé',
        priorite: 'moyenne',
        dateEcheance: '2025-04-01',
        assigneA: this.projet.membres?.[0] || null
      };

      if (!this.projet.taches) this.projet.taches = [];
      this.projet.taches.push(nouvelleTache);
      this.enregistrerProjet();
      alert('✅ Tâche ajoutée avec succès !');
    }
  }

  addMember() {
    const email = prompt("Email du membre à ajouter :");
    if (email && !this.projet.membres.includes(email)) {
      this.projet.membres.push(email);
      this.enregistrerProjet();
      alert(`✅ Membre ${email} ajouté.`);
    }
  }

  deleteProject() {
    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
    if (!confirmation || !this.gestionnaireData) return;

    this.gestionnaireData.projets = this.gestionnaireData.projets.filter((p: any) => p.nom !== this.projectName);
    const allGestionnaires = JSON.parse(localStorage.getItem('gestionnaires') || '[]');
    const index = allGestionnaires.findIndex((g: any) => g.id === this.gestionnaireId);
    allGestionnaires[index] = this.gestionnaireData;

    localStorage.setItem('gestionnaires', JSON.stringify(allGestionnaires));
    alert("🚮 Projet supprimé.");
    this.router.navigate(['/dashboard/gestionnaire']);
  }

  enregistrerProjet() {
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

  goToDetailTache(task: any) {
    this.router.navigate(['/dashboard/gestionnaire/detail-tache'], {
      queryParams: { task: task.nom }
    });
  }

  goToModificationTache(task: any) {
    this.router.navigate(['/dashboard/gestionnaire/modification-tache'], {
      queryParams: {
        title: task.nom,
        dueDate: task.dateEcheance
      }
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }
}

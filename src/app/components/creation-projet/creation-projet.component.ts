import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creation-projet',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './creation-projet.component.html',
  styleUrls: ['./creation-projet.component.css']
})
export class CreationProjetComponent {
  projectName: string = '';
  projectDescription: string = '';
  startDate: string = '';
  endDate: string = '';
  members: string = ''; // tu pourras améliorer ça plus tard avec une vraie liste

  constructor(private router: Router) {}

  saveProject() {
    const userId = localStorage.getItem('userId');
    const gestionnairesRaw = localStorage.getItem('gestionnaires');

    if (!userId || !gestionnairesRaw) {
      alert('❌ Impossible de récupérer les données du gestionnaire.');
      return;
    }

    const gestionnaires = JSON.parse(gestionnairesRaw);
    const gestionnaire = gestionnaires.find((g: any) => g.id === userId);

    if (!gestionnaire) {
      alert('❌ Gestionnaire non trouvé.');
      return;
    }

    const nouveauProjet = {
      nom: this.projectName,
      description: this.projectDescription,
      dateDebut: this.startDate,
      dateEcheance: this.endDate,
      membres: this.members.split(',').map(m => m.trim()),
      taches: [] // Projet vide au départ
    };

    // Ajout dans les projets du gestionnaire
    if (!gestionnaire.projets) gestionnaire.projets = [];
    gestionnaire.projets.push(nouveauProjet);

    // Sauvegarde
    localStorage.setItem('gestionnaires', JSON.stringify(gestionnaires));

    alert('✅ Projet enregistré avec succès !');
    this.router.navigate(['/dashboard/gestionnaire']);
  }

  cancel() {
    this.router.navigate(['/dashboard/gestionnaire']);
  }
}

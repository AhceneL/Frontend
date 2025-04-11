import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
<<<<<<< HEAD
import { ProjetService } from '../../services/projet.service';
=======
>>>>>>> 7047c9b5da60729fa291f5c66c6944c665dc067b

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
<<<<<<< HEAD
  members: string = ''; // chaîne avec des emails séparés par virgule

  constructor(private router: Router, private projetService: ProjetService) {}

  saveProject() {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('❌ Vous n’êtes pas connecté.');
      return;
    }

    const membresEmails: string[] = this.members
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);
=======
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
>>>>>>> 7047c9b5da60729fa291f5c66c6944c665dc067b

    const nouveauProjet = {
      nom: this.projectName,
      description: this.projectDescription,
      dateDebut: this.startDate,
<<<<<<< HEAD
      dateFin: this.endDate,
      membresEmails: membresEmails
    };

    // 🔍 Affiche le JSON envoyé pour debug
    console.log('📦 JSON envoyé au backend :', JSON.stringify(nouveauProjet, null, 2));

    this.projetService.create(nouveauProjet).subscribe({
      next: () => {
        alert('✅ Projet enregistré avec succès !');
        this.router.navigate(['/dashboard/gestionnaire']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la création du projet', err);
        alert(err.error?.message || 'Erreur lors de la création du projet. Vérifie les champs ou les membres.');
      }
    });
=======
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
>>>>>>> 7047c9b5da60729fa291f5c66c6944c665dc067b
  }

  cancel() {
    this.router.navigate(['/dashboard/gestionnaire']);
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjetService } from '../../services/projet.service';

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

    const nouveauProjet = {
      nom: this.projectName,
      description: this.projectDescription,
      dateDebut: this.startDate,
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
  }

  cancel() {
    this.router.navigate(['/dashboard/gestionnaire']);
  }
}

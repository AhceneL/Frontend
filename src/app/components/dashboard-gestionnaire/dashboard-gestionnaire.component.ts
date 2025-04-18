import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjetService } from '../../services/projet.service';

@Component({
  selector: 'app-dashboard-gestionnaire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-gestionnaire.component.html',
  styleUrls: ['./dashboard-gestionnaire.component.css']
})
export class DashboardGestionnaireComponent implements OnInit {
  projets: any[] = [];
  gestionnaireEmail: string = '';
  avatar: string = 'assets/avatar-par-defaut.jpg';

  constructor(private router: Router, private projetService: ProjetService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('❌ Aucun token trouvé, utilisateur non connecté.');
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    this.gestionnaireEmail = payload.sub; // 📧 Email du gestionnaire connecté

    this.projetService.getAll().subscribe({
      next: (data) => {
        // ⚙️ Filtrer les projets du gestionnaire connecté
        this.projets = data
          .filter((p: any) => p.createurEmail === this.gestionnaireEmail)
          .map((projet: any) => ({
            ...projet,
            statut: this.calculerStatutProjet(projet)
          }));
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement des projets', err);
      }
    });
  }

  calculerStatutProjet(projet: any): string {
    if (!projet.taches || projet.taches.length === 0) {
      return 'Aucune tâche';
    }

    const total = projet.taches.length;
    const terminees = projet.taches.filter((t: any) => t.statut === 'terminé').length;
    const pourcentage = Math.round((terminees / total) * 100);

    if (pourcentage === 100) return '✅ Terminé à 100%';
    if (pourcentage === 0) return '⏳ Pas commencé';
    return `🛠 En cours (${pourcentage}%)`;
  }

  goToCreationProjet(): void {
    this.router.navigate(['/dashboard/gestionnaire/creation-projet']);
  }

  goToSuiviProgression(): void {
    this.router.navigate(['/dashboard/gestionnaire/suivi']);
  }

  goToDetailProjet(projectName: string): void {
    this.router.navigate(['/dashboard/gestionnaire/detail-projet'], {
      queryParams: { projet: projectName }
    });
  }

  goToProfil(): void {
    this.router.navigate(['/profil']);
  }

  goToProfilEdit(): void {
    this.router.navigate(['/profil/edit']);
  }

  showForm = false;
  newMemberName = '';
  newMemberEmail = '';

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.newMemberName = '';
      this.newMemberEmail = '';
    }
  }

  addMember(): void {
    if (!this.newMemberName.trim() || !this.newMemberEmail.trim()) {
      alert("❌ Veuillez entrer un nom et une adresse e-mail valides.");
      return;
    }

    const emailData = {
      to: this.newMemberEmail,
      subject: 'Bienvenue dans l\'équipe!',
      body: `Bonjour ${this.newMemberName},\n\nBienvenue dans l'équipe! Nous sommes ravis de vous avoir avec nous.\n\nCordialement,\nL'équipe.`
    };

    const blob = new Blob([JSON.stringify(emailData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `email_${this.newMemberName}.json`;
    a.click();

    URL.revokeObjectURL(url);
    alert('📩 Simulation d\'envoi d\'email réussie!');
    this.toggleForm();
  }
}

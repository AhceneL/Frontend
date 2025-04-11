import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-gestionnaire',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './dashboard-gestionnaire.component.html',
  styleUrls: ['./dashboard-gestionnaire.component.css']
})
export class DashboardGestionnaireComponent implements OnInit {
  gestionnaireData: any = null;
  projets: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const data = localStorage.getItem('gestionnaires');
    const userId = localStorage.getItem('userId');

    if (data && userId) {
      try {
        const gestionnaires = JSON.parse(data);
        this.gestionnaireData = gestionnaires.find((g: any) => g.id === userId);

        if (this.gestionnaireData) {
          // Assigner un avatar par défaut s'il est manquant
          if (!this.gestionnaireData.avatar) {
            this.gestionnaireData.avatar = 'assets/avatar-par-defaut.jpg';
          }

          if (Array.isArray(this.gestionnaireData.projets)) {
            this.projets = this.gestionnaireData.projets.map((projet: any) => ({
              ...projet,
              statut: this.calculerStatutProjet(projet)
            }));
          } else {
            this.projets = [];
            console.warn('⚠️ Aucun projet trouvé pour ce gestionnaire.');
          }
        } else {
          console.warn('⚠️ Gestionnaire non trouvé.');
        }
      } catch (e) {
        console.error('❌ Erreur lors du parsing de gestionnaires.json :', e);
      }
    } else {
      console.warn('❌ Données de session manquantes pour le gestionnaire.');
    }
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
  
  showForm = false; // To toggle between form and button
  newMemberName = ''; // For storing the name of the new member
  newMemberEmail = ''; // For storing the email of the new member

  // Function to toggle form visibility
  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      // Reset the fields when form is hidden
      this.newMemberName = '';
      this.newMemberEmail = '';
    }
  }

  // Function to handle member addition
  addMember(): void {
    if (!this.newMemberName.trim() || !this.newMemberEmail.trim()) {
      alert("❌ Veuillez entrer un nom et une adresse e-mail valides.");
      return;
    }

    // Simulate sending an email with member data
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

    // Hide the form after adding the member
    this.toggleForm();
  }

}

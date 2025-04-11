import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-suivi-progression',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './suivi-progression.component.html',
  styleUrls: ['./suivi-progression.component.css']
})
export class SuiviProgressionComponent implements OnInit {
  projets: any[] = [];

  ngOnInit(): void {
    const data = localStorage.getItem('gestionnaires');
    const userId = localStorage.getItem('userId');

    if (data && userId) {
      try {
        const gestionnaires = JSON.parse(data);
        const gestionnaire = gestionnaires.find((g: any) => g.id === userId);

        if (gestionnaire?.projets) {
          this.projets = gestionnaire.projets.map((projet: any) => {
            const total = projet.taches?.length || 0;
            const terminees = projet.taches?.filter((t: any) => this.estTacheTerminee(t)).length || 0;
            const progression = total > 0 ? Math.round((terminees / total) * 100) : 0;
            return { ...projet, progression };
          });
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement des projets :', error);
      }
    }
  }

  estTacheTerminee(tache: any): boolean {
    return tache?.statut?.toLowerCase() === 'terminé';
  }

  getStatutClass(statut: string): string {
    const statutLower = statut?.toLowerCase() || '';
    if (statutLower === 'terminé') return 'termine';
    if (statutLower === 'en cours') return 'encours';
    if (statutLower === 'pas commencé') return 'pascommence';
    return '';
  }
}

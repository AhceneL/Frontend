import { Component, OnInit } from '@angular/core';
import { ProjetService } from '../../services/projet.service';
import { TacheService } from '../../services/tache.service'; // Assurez-vous que ce service est importé
import { CommonModule } from '@angular/common'; // Importer CommonModule pour les directives Angular

@Component({
  selector: 'app-suivi-progression',
  standalone: true,
  imports: [CommonModule],  // Assurez-vous que CommonModule est bien importé
  templateUrl: './suivi-progression.component.html',
  styleUrls: ['./suivi-progression.component.css']
})
export class SuiviProgressionComponent implements OnInit {
  projets: any[] = [];

  constructor(
    private projetService: ProjetService,
    private tacheService: TacheService
  ) {}

  ngOnInit(): void {
    this.projetService.getMesProjets().subscribe({
      next: (projets) => {
        console.log('Projets récupérés :', projets);
        this.projets = projets;

        // Pour chaque projet, récupérer les tâches et calculer la progression
        this.projets.forEach((projet: any) => {
          this.tacheService.getAllByProjet(projet.id).subscribe({
            next: (taches) => {
              const total = taches.length;
              const terminees = taches.filter((t: any) => this.estTacheTerminee(t)).length;
              const progression = total > 0 ? Math.round((terminees / total) * 100) : 0;

              projet.taches = taches;
              projet.progression = progression;
            },
            error: (err) => {
              console.error('Erreur lors de la récupération des tâches :', err);
            }
          });
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des projets :', err);
      }
    });
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

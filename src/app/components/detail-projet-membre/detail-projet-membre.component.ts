import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-projet-membre',
  standalone: true,
  templateUrl: './detail-projet-membre.component.html',
  styleUrls: ['./detail-projet-membre.component.css'],
  imports: [CommonModule, TitleCasePipe, FormsModule]
})
export class DetailProjetMembreComponent implements OnInit {
  membreData: any = null;
  projets: any[] = [];
  projetSelectionneNom: string = '';
  filtreActif: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const data = localStorage.getItem('membres');
    const userId = localStorage.getItem('userId');

    if (data && userId) {
      const membres = JSON.parse(data);
      this.membreData = membres.find((m: any) => m.id === userId);

      if (this.membreData && Array.isArray(this.membreData.projets)) {
        this.projets = this.membreData.projets;

        const projetParam = this.route.snapshot.queryParamMap.get('projet');
        this.projetSelectionneNom = projetParam || this.projets[0]?.nom || '';
      }
    }
  }

  // Getter pour retourner l'objet projet sélectionné
  get projetSelectionne(): any {
    return this.projets.find((p: any) => p.nom === this.projetSelectionneNom);
  }

  // Filtrer les tâches selon le filtre actif
  getTachesFiltrees(): any[] {
    const projet = this.projetSelectionne;
    if (!projet || !projet.taches) return [];

    const taches = projet.taches;

    switch (this.filtreActif) {
      case 'prioritaire':
        return taches.filter((t: any) => t.priorite?.toLowerCase() === 'haute');
      case 'semaine':
        const today = new Date();
        const in7days = new Date(today);
        in7days.setDate(today.getDate() + 7);
        return taches.filter((t: any) => {
          const date = new Date(t.dateEcheance);
          return date >= today && date <= in7days;
        });
      case 'termine':
        return taches.filter((t: any) =>
          t.statut?.toLowerCase() === 'terminé' || t.statut?.toLowerCase() === 'termine'
        );
      default:
        return taches;
    }
  }

  // Définir le filtre actif
  setFiltre(val: string) {
    this.filtreActif = val;
  }

  // Aller vers les détails d'une tâche
  goToDetailTache(titre: string) {
    this.router.navigate(['/dashboard/membre/detail-tache'], {
      queryParams: { task: titre }
    });
  }

  // Revenir au tableau de bord
  goToDashboard() {
    this.router.navigate(['/dashboard/membre']);
  }

  // Utilisé pour *ngFor trackBy
  trackByNom(index: number, item: any) {
    return item.nom;
  }
}

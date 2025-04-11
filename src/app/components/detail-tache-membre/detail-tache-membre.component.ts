import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-tache-membre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-tache-membre.component.html',
  styleUrls: ['./detail-tache-membre.component.css']
})
export class DetailTacheMembreComponent implements OnInit {
  taskName: string = '';
  taskData: any = null;
  comments: string = '';
  file: File | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.taskName = params['task'] || '';
      const membresData = localStorage.getItem('membres');
      const userId = localStorage.getItem('userId');

      if (membresData && userId) {
        const membres = JSON.parse(membresData);
        const membre = membres.find((m: any) => m.id === userId);

        if (membre && Array.isArray(membre.projets)) {
          for (const projet of membre.projets) {
            const tache = projet.taches?.find((t: any) => t.nom === this.taskName);
            if (tache) {
              this.taskData = {
                ...tache,
                projet: projet.nom // utile pour affichage
              };
              break;
            }
          }
        }
      }
    });
  }

  updateStatus(newStatus: string) {
    if (this.taskData) {
      this.taskData.statut = newStatus;
      alert(`✅ Statut mis à jour : ${newStatus}`);
    }
  }

  addComment() {
    if (this.comments.trim()) {
      if (!this.taskData.commentaires) {
        this.taskData.commentaires = [];
      }
      this.taskData.commentaires.push(this.comments.trim());
      alert(`💬 Commentaire ajouté : ${this.comments}`);
      this.comments = '';
    } else {
      alert('Veuillez entrer un commentaire.');
    }
  }


  handleFileInput(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  saveTask() {
    const membresData = localStorage.getItem('membres');
    const userId = localStorage.getItem('userId');

    if (!membresData || !userId) {
      alert('❌ Données non trouvées. Reconnectez-vous.');
      return;
    }

    const membres = JSON.parse(membresData);
    const membreIndex = membres.findIndex((m: any) => m.id === userId);

    if (membreIndex === -1) {
      alert('❌ Membre introuvable.');
      return;
    }

    const projets = membres[membreIndex].projets || [];
    const projet = projets.find((p: any) =>
      p.nom === this.taskData.projet &&
      p.taches?.some((t: any) => t.nom === this.taskName)
    );

    if (!projet) {
      alert('❌ Projet introuvable pour cette tâche.');
      return;
    }

    const tacheIndex = projet.taches.findIndex((t: any) => t.nom === this.taskName);
    if (tacheIndex !== -1) {
      projet.taches[tacheIndex] = { ...this.taskData }; // mise à jour réelle
      localStorage.setItem('membres', JSON.stringify(membres));
      alert('💾 Tâche sauvegardée avec succès.');
      this.goToDashboard();
    } else {
      alert('❌ Tâche non trouvée dans le projet.');
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard/membre/detail-projet']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }
}

<<<<<<< HEAD
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

  constructor(private router: Router, private projetService: ProjetService) {}

  saveProject() {
    const nouveauProjet = {
      nom: this.projectName,
      description: this.projectDescription,
      dateDebut: this.startDate,
      dateFin: this.endDate
    };

    this.projetService.create(nouveauProjet).subscribe({
      next: () => {
        alert('✅ Projet enregistré avec succès !');
        this.router.navigate(['/dashboard/gestionnaire']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la création du projet', err);
        alert('Erreur serveur. Veuillez réessayer plus tard.');
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard/gestionnaire']);
  }
}
=======
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationProjetComponent } from './creation-projet.component';

describe('CreationProjetComponent', () => {
  let component: CreationProjetComponent;
  let fixture: ComponentFixture<CreationProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationProjetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
>>>>>>> 7047c9b5da60729fa291f5c66c6944c665dc067b

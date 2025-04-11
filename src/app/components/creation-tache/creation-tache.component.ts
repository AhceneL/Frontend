import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Ajouté pour ngModel

@Component({
  selector: 'app-creation-tache',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Modules nécessaires
  templateUrl: './creation-tache.component.html',
  styleUrls: ['./creation-tache.component.css']
})
export class CreationTacheComponent {
  taskTitle: string = '';
  taskDescription: string = '';
  assignedMember: string = '';
  taskStatus: string = 'En attente';

  members: string[] = []; // ✅ Liste des membres du projet

  constructor(private router: Router) {
    this.loadMembers(); // ✅ Charger les membres existants
  }

  /**
   * 📌 Charger dynamiquement les membres assignables au projet depuis `localStorage`
   */
  loadMembers() {
    const savedMembers = localStorage.getItem('projectMembers');
    if (savedMembers) {
      this.members = JSON.parse(savedMembers);
    } else {
      // ✅ Ajout d'un membre par défaut pour éviter les erreurs
      this.members = ['Membre par défaut'];
      localStorage.setItem('projectMembers', JSON.stringify(this.members));
    }
  }

  /**
   * 📌 Ajouter une tâche et sauvegarder dans le `localStorage`
   */
  addTask() {
    if (this.taskTitle.trim() === '' || this.assignedMember.trim() === '') {
      alert('❌ Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // 🔹 Récupérer les tâches existantes ou initialiser un tableau vide
    let taskList: any[] = JSON.parse(localStorage.getItem('taskList') || '[]');

    // 🔹 Création d'une nouvelle tâche avec une date d'échéance
    const newTask = {
      title: this.taskTitle,
      description: this.taskDescription,
      assignedMember: this.assignedMember,
      status: this.taskStatus,
      dueDate: new Date().toISOString().split('T')[0] // 📌 Date actuelle par défaut
    };

    // ✅ Ajouter la tâche et sauvegarder dans le stockage local
    taskList.push(newTask);
    localStorage.setItem('taskList', JSON.stringify(taskList));

    alert('✅ Tâche ajoutée avec succès !');

    // 🔹 Redirection vers les détails du projet après l'ajout de la tâche
    this.router.navigate(['/dashboard/gestionnaire/detail-projet']);
  }

  /**
   * 📌 Annuler et revenir aux détails du projet sans ajouter de tâche
   */
  cancel() {
    this.router.navigate(['/dashboard/gestionnaire/detail-projet']);
  }

  /**
   * 📌 Retour au tableau de bord des gestionnaires
   */
  goToDashboard() {
    this.router.navigate(['/dashboard/gestionnaire']);
  }
}

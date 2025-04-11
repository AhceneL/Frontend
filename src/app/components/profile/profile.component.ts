import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Correct import


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  originalUser: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const data = localStorage.getItem('currentUser');
    if (data) {
      this.user = JSON.parse(data);
      this.originalUser = { ...this.user }; // pour restaurer en cas d’annulation
    } else {
      alert("Aucun utilisateur connecté.");
      this.router.navigate(['/auth']);
    }
  }

  saveChanges(): void {
    localStorage.setItem('currentUser', JSON.stringify(this.user));
    alert('✅ Profil mis à jour avec succès !');
  }

  cancel(): void {
    this.router.navigate(['dashboard/'+localStorage.getItem('userRole')]);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }
}

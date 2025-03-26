import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  user: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const data = localStorage.getItem('currentUser');
    if (data) {
      this.user = JSON.parse(data);
    } else {
      alert("Aucun utilisateur connecté.");
      this.router.navigate(['/auth']);
    }
  }

  goToEditProfile(): void {
    this.router.navigate(['/profil/edit']);
  }
}

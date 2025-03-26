import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent {
  constructor(private router: Router) {}

  goToLogin(): void {
    this.router.navigateByUrl('/auth'); // Utilise navigateByUrl pour rediriger vers la page de connexion
  }
}

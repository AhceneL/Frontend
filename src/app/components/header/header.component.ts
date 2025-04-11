import { Component, Input, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  isAuthenticated$: Observable<boolean>;
  LastRoute: string ='au';

  constructor(private authService: AuthService, private router: Router) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    
  }
  


  goToDashboard() {
    this.router.navigate(['dashboard/'+localStorage.getItem('userRole')]);
    
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }

  goToProfile() {
    this.router.navigate(['/profil']);
  }

  goToLogin() {
    this.router.navigate(['/auth']);
    this.LastRoute='rg'
  }

  goToRegister(){
    this.router.navigate(['/register'])
    this.LastRoute='au'

  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}

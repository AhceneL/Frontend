import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {  // ✅ Utilise "AuthGuard" avec une majuscule
  let authGuard: AuthGuard;
  let routerSpy = { navigate: jasmine.createSpy('navigate') }; // Simule le Router

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, { provide: Router, useValue: routerSpy }]
    });
    authGuard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();  // ✅ Vérifie que le guard est bien créé
  });

  it('should allow access if userRole is set', () => {
    localStorage.setItem('userRole', 'membre'); // Simule un utilisateur connecté
    expect(authGuard.canActivate()).toBeTrue(); // ✅ L'accès doit être autorisé
  });

  it('should redirect to auth if userRole is missing', () => {
    localStorage.removeItem('userRole'); // Simule un utilisateur non connecté
    expect(authGuard.canActivate()).toBeFalse(); // ❌ L'accès doit être refusé
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth']); // ✅ Vérifie la redirection
  });
});

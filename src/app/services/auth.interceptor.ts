import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    console.log('✅ Token trouvé, ajout du header Authorization');
    return next(req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }));
  }

  console.warn('⚠️ Aucun token trouvé, requête envoyée sans Authorization');
  return next(req);
};

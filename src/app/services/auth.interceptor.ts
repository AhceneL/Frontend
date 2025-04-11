<<<<<<< HEAD
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    console.log('✅ Token trouvé, ajout du header Authorization');

    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(clonedRequest);
  } else {
    console.warn('⚠️ Aucun token trouvé, requête envoyée sans Authorization');
    return next(req);
  }
};
=======
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      console.log('✅ Token trouvé, ajout de l\'Authorization header');
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedReq);
    } else {
      console.warn('⚠️ Aucun token trouvé, requête envoyée sans authentification');
      return next.handle(req);
    }
  }
}
>>>>>>> 7047c9b5da60729fa291f5c66c6944c665dc067b

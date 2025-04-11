import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
<<<<<<< HEAD
import { provideHttpClient, withInterceptors } from '@angular/common/http';
=======
import { provideHttpClient } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
>>>>>>> 7047c9b5da60729fa291f5c66c6944c665dc067b
import { AuthInterceptor } from './app/services/auth.interceptor';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
<<<<<<< HEAD
    provideHttpClient(withInterceptors([AuthInterceptor])), // ✅ C'est correct ici
    ...appConfig.providers
  ]
}).catch(err => console.error(err));
=======
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    ...appConfig.providers,
  ],
}).catch((err) => console.error(err));
>>>>>>> 7047c9b5da60729fa291f5c66c6944c665dc067b

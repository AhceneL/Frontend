import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardMembreComponent } from './components/dashboard-membre/dashboard-membre.component';
import { DashboardGestionnaireComponent } from './components/dashboard-gestionnaire/dashboard-gestionnaire.component';
import { DetailProjetMembreComponent } from './components/detail-projet-membre/detail-projet-membre.component';
import { DetailProjetGestionnaireComponent } from './components/detail-projet-gestionnaire/detail-projet-gestionnaire.component';
import { CreationProjetComponent } from './components/creation-projet/creation-projet.component';
import { DetailTacheMembreComponent } from './components/detail-tache-membre/detail-tache-membre.component';
import { CreationTacheComponent } from './components/creation-tache/creation-tache.component';
import { DetailTacheGestComponent } from './components/detail-tache-gest/detail-tache-gest.component';
import { ModificationTacheComponent } from './components/modification-tache/modification-tache.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ProfileComponent } from './components/profile/profile.component'; // ✅ Décommenté pour le profil
import { ProfileViewComponent } from './components/profile-view/profile-view.component';
import { AuthGuard } from './guards/auth.guard'; // ✅ Import du Guard
import  { SuiviProgressionComponent } from './components/suivi-progression/suivi-progression.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PageForbiddenComponent } from './components/page-forbidden/page-forbidden.component';
export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'register', component: RegisterComponent },

  //  Routes protégées pour les membres
  {
    path: 'dashboard/membre',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardMembreComponent },
      { path: 'detail-projet', component: DetailProjetMembreComponent },
      { path: 'detail-tache', component: DetailTacheMembreComponent }
    ]
  },

  //  Routes protégées pour les gestionnaires
  {
    path: 'dashboard/gestionnaire',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardGestionnaireComponent },
      { path: 'detail-projet', component: DetailProjetGestionnaireComponent },
      { path: 'detail-projet/creation-tache', component: CreationTacheComponent },
      { path: 'detail-tache', component: DetailTacheGestComponent },
      { path: 'modification-tache', component: ModificationTacheComponent },
      { path: 'creation-projet', component: CreationProjetComponent }
    ]
  },

  //  Autres routes protégées
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'profil/edit', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'profil', component: ProfileViewComponent, canActivate: [AuthGuard] }, // Editable profile page
  { path: 'dashboard/gestionnaire/suivi', component: SuiviProgressionComponent },
  //  Redirection pour toute route inconnue
  { path: '403', component: PageForbiddenComponent },
  { path: '', redirectTo: 'auth' , pathMatch:`full` },
  { path: '**', component: PageNotFoundComponent , title: 'Page introuvable' }

];

import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent)
  },
  {
    path: 'cinemas',
    loadComponent: () => import('./pages/cinemas/cinemas.component').then((m) => m.CinemasComponent)
  },
  {
    path: 'movies',
    loadComponent: () => import('./pages/movies/movies.component').then((m) => m.MoviesComponent)
  },
  {
    path: '**',
    component: AppComponent // TODO: Handle 404 with a NotFoundComponent
  }
];

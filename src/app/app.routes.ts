import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { NewCinemaModalComponent } from './pages/cinemas/new-cinema-modal/new-cinema-modal.component';
import { NewMovieModalComponent } from './pages/movies/new-movie-modal/new-movie-modal.component';
import { NewScreenModalComponent } from './pages/cinemas/cinema/new-screen-modal/new-screen-modal.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent)
  },
  {
    path: 'cinemas',
    loadComponent: () => import('./pages/cinemas/cinemas.component').then((m) => m.CinemasComponent),
    children: [
      {
        path: 'new',
        component: NewCinemaModalComponent,
      }
    ]
  },
  {
    path: 'cinemas/:id',
    loadComponent: () => import('./pages/cinemas/cinema/cinema.component').then((m) => m.CinemaComponent),
    children: [
      {
        path: 'new',
        component: NewScreenModalComponent,
      }
    ]
  },
  {
    path: 'movies',
    loadComponent: () => import('./pages/movies/movies.component').then((m) => m.MoviesComponent),
    children: [
      {
        path: 'new',
        component: NewMovieModalComponent,
      }
    ]
  },
  {
    path: '**',
    component: AppComponent // TODO: Handle 404 with a NotFoundComponent
  }
];

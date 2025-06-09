import { Routes } from '@angular/router';

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
        loadComponent: () => import('./pages/cinemas/new-cinema-modal/new-cinema-modal.component').then((m) => m.NewCinemaModalComponent),
      }
    ]
  },
  {
    path: 'cinemas/:id',
    loadComponent: () => import('./pages/cinemas/cinema/cinema.component').then((m) => m.CinemaComponent),
    children: [
      {
        path: 'new',
        loadComponent: () => import('./pages/cinemas/cinema/new-screen-modal/new-screen-modal.component').then((m) => m.NewScreenModalComponent),
      }
    ]
  },
  {
    path: 'cinemas/:cinemaId/screenings/:screenId',
    loadComponent: () => import('./pages/cinemas/cinema/screenings/screenings.component').then((m) => m.ScreeningsComponent),
    children: [
      {
        path: 'new',
        loadComponent: () => import('./pages/cinemas/cinema/screenings/new-screening-modal/new-screening-modal.component').then((m) => m.NewScreeningModalComponent),
      }
    ]
  },
  {
    path: 'movies',
    loadComponent: () => import('./pages/movies/movies.component').then((m) => m.MoviesComponent),
    children: [
      {
        path: 'new',
        loadComponent: () => import('./pages/movies/new-movie-modal/new-movie-modal.component').then((m) => m.NewMovieModalComponent),
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/page-not-found/page-not-found.component').then((m) => m.PageNotFoundComponent)
  }
];

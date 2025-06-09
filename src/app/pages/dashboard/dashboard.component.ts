import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '@/app/shared/components/page-header/page-header.component';
import { MatCardModule } from '@angular/material/card';
import { CinemasService } from '../cinemas/cinemas.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ErrorComponent } from '@/app/shared/components/error/error.component';
import { LoadingComponent } from '@/app/shared/components/loading/loading.component';
import { MoviesService } from '../movies/movies.service';
import { BookingsService } from '../../shared/services/bookings.service';

interface Metric {
  title: string;
  count: number;
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
  disabled?: boolean;
  route: string[];
};

@Component({
  selector: 'app-dashboard',
  imports: [MatButtonModule, RouterModule, MatIconModule, PageHeaderComponent, MatCardModule, ErrorComponent, LoadingComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly cinemasService = inject(CinemasService);
  protected readonly cinemas = injectQuery(() => this.cinemasService.cinemas(0, 100));
  private readonly moviesService = inject(MoviesService);
  protected readonly movies = injectQuery(() => this.moviesService.movies());
  private readonly bookingsService = inject(BookingsService);
  protected readonly bookings = injectQuery(() => this.bookingsService.bookings());

  readonly screenCount = computed(() => {
    const cinemasData = this.cinemas.data();

    // While this does work, it's far from the perfect solution.
    // Ideally metrics like this would be exposed through a seperate endpoint and handled server side.
    return cinemasData?.content.reduce((total, cinema) => {
      total += cinema.screens.length;
      return total;
    }, 0) ?? 0;
  });

  readonly metrics = computed<Metric[]>(() => {
    const cinemasData = this.cinemas.data();
    const moviesData = this.movies.data();
    const bookingsData = this.bookings.data();

    return [
      {
        title: 'Cinemas',
        route: ['cinemas'],
        count: cinemasData?.totalElements ?? 0,
        isLoading: this.cinemas.isLoading(),
        isError: this.cinemas.isError(),
        retry: () => this.cinemas.refetch()
      },
      {
        title: 'Screens',
        route: ['cinemas'],
        count: this.screenCount(),
        isLoading: this.cinemas.isLoading(),
        isError: this.cinemas.isError(),
        retry: () => this.cinemas.refetch()
      },
      {
        title: 'Movies',
        route: ['movies'],
        count: moviesData?.totalElements ?? 0,
        isLoading: this.movies.isLoading(),
        isError: this.movies.isError(),
        retry: () => this.movies.refetch()
      },
      {
        title: 'Bookings',
        route: ['bookings'],
        count: bookingsData?.totalElements ?? 0,
        isLoading: this.bookings.isLoading(),
        isError: this.bookings.isError(),
        retry: () => this.bookings.refetch(),
        disabled: true
      },
    ];
  });
}

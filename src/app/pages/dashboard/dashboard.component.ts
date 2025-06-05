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

@Component({
  selector: 'app-dashboard',
  imports: [MatButtonModule, RouterModule, MatIconModule, PageHeaderComponent, MatCardModule, ErrorComponent, LoadingComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly cinemasService = inject(CinemasService);
  protected readonly cinemas = injectQuery(() => this.cinemasService.cinemas());
  private readonly moviesService = inject(MoviesService);
  protected readonly movies = injectQuery(() => this.moviesService.movies());

  readonly metrics = computed(() => {
    const cinemasData = this.cinemas.data();
    const moviesData = this.movies.data();

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
        title: 'Movies',
        route: ['movies'],
        count: moviesData?.totalElements ?? 0,
        isLoading: this.movies.isLoading(),
        isError: this.movies.isError(),
        retry: () => this.movies.refetch()
      },
    ];
  });
}

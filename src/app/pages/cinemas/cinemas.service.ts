import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { environment } from '@/environments/environments';
import { Movie } from '../movies/movies.service';
import { Data } from '@/app/shared/types/api.types';

export interface Screen extends NewScreen {
  id: number;
};

export interface NewScreen {
  name: string;
};

export interface Cinema extends NewCinema {
  id: number;
  screens: Screen[];
};

export interface NewCinema {
  name: string;
};

export interface Screening {
  id: number;
  cinemaName: string;
  screenName: string;
  start: string;
  movie: Movie;
};

export interface NewScreening {
  startTime: string;
  movieId: number;
};

@Injectable({
  providedIn: 'root'
})
export class CinemasService {
  private readonly http = inject(HttpClient);

  cinemas(page?: number, pageSize?: number) {
    const url = new URL(`${environment.api}/cinemas`);

    if (page !== undefined) url.searchParams.append('page', page.toString());
    if (pageSize !== undefined) url.searchParams.append('size', pageSize.toString());

    return queryOptions({
      queryKey: ['cinemas', page, pageSize],
      queryFn: () =>
        lastValueFrom(
          this.http.get<Data<Cinema[]>>(url.toString()),
        )
    });
  }

  newCinema(cinema: NewCinema) {
    const url = new URL(`${environment.api}/cinemas`);

    return lastValueFrom(
      this.http.put<NewCinema>(url.toString(),
        cinema
      )
    );
  }

  newScreen(cinemaId: number, screen: NewScreen) {
    const url = new URL(`${environment.api}/cinemas/${cinemaId}/screens`);

    return lastValueFrom(
      this.http.put<NewScreen>(url.toString(),
        screen
      )
    );
  }

  screenings(cinemaId: number, page?: number, pageSize?: number) {
    const url = new URL(`${environment.api}/cinemas/${cinemaId}/screenings`);

    if (page !== undefined) url.searchParams.append('page', page.toString());
    if (pageSize !== undefined) url.searchParams.append('size', pageSize.toString());

    return queryOptions({
      queryKey: ['screenings', cinemaId, page, pageSize],
      queryFn: () =>
        lastValueFrom(
          this.http.get<Data<Screening[]>>(url.toString()),
        )
    })
  }

  newScreening(cinemaId: number, screenId: number, screening: NewScreening) {
    const url = new URL(`${environment.api}/cinemas/${cinemaId}/screens/${screenId}/screenings`);

    return lastValueFrom(
      this.http.put<NewScreening>(url.toString(),
        screening
      )
    );
  }
}

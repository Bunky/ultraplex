import { inject, Injectable } from '@angular/core';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { environment } from '@/environments/environments';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Data } from '@/app/shared/types/api.types';

export interface Movie extends Omit<NewMovie, 'runtime'> {
  id: number;
  runtime: number | null;
};

export interface NewMovie {
  name: string;
  runtime: number;
};

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private readonly http = inject(HttpClient);

  movies(page?: number, pageSize?: number) {
    const url = new URL(`${environment.api}/movies`);

    if (page !== undefined) url.searchParams.append('page', page.toString());
    if (pageSize !== undefined) url.searchParams.append('size', pageSize.toString());

    return queryOptions({
      queryKey: ['movies', page, pageSize],
      queryFn: () =>
        lastValueFrom(
          this.http.get<Data<Movie[]>>(
            `${environment.api}/movies`,
          ),
        ),
    })
  }

  newMovie(movie: NewMovie) {
    const url = new URL(`${environment.api}/movies`);

    return lastValueFrom(
      this.http.put<NewMovie>(
        url.toString(),
        movie
      ),
    );
  }
}

import { inject, Injectable } from '@angular/core';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { Data } from '../cinemas/cinemas.service';
import { environment } from '@/environments/environments';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export interface Movie {
  id: number;
  name: string;
  runtime: number | null;
}

export interface NewMovie {
  name: string;
  runtime: number;
}

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private readonly http = inject(HttpClient);

  movies(page?: number, pageSize?: number) {
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
    return  lastValueFrom(
      this.http.put<NewMovie>(
        `${environment.api}/movies`,
        movie
      ),
    );
  }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { environment } from '@/environments/environments';

export interface Data<T> {
  content: T;
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface Screen {
  id: number;
  name: string;
}

export interface NewScreen {
  name: string;
}

export interface Cinema {
  id: number;
  name: string;
  screens: Screen[];
}

export interface NewCinema {
  name: string;
}

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
    })
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
}

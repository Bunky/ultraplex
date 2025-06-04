import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';

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

export interface Cinema {
  id: number;
  name: string;
  screens: Screen[];
}

@Injectable({
  providedIn: 'root'
})
export class CinemasService {
  private readonly http = inject(HttpClient);

  cinemas(page?: number, pageSize?: number) {
    return queryOptions({
      queryKey: ['cinemas', page, pageSize],
      queryFn: () =>
        lastValueFrom(
          this.http.get<Data<Cinema[]>>(
            'https://ultraplex-solutions.poc.iov42.net/api/v1/cinemas',
          ),
        ),
    })
  }
}


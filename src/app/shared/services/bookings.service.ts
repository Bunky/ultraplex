import { environment } from '@/environments/environments';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { queryOptions } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { Data } from '../types/api.types';

export interface Booking extends NewBooking {
  id: string;
};

export interface NewBooking {
  movie: string;
  cinema: string;
  screen: string;
};

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private readonly http = inject(HttpClient);

  bookings(page?: number, pageSize?: number) {
    const url = new URL(`${environment.api}/bookings`);

    if (page !== undefined) url.searchParams.append('page', page.toString());
    if (pageSize !== undefined) url.searchParams.append('size', pageSize.toString());

    return queryOptions({
      queryKey: ['bookings', page, pageSize],
      queryFn: () =>
        lastValueFrom(
          this.http.get<Data<Booking[]>>(
            `${environment.api}/bookings`,
          ),
        ),
    })
  }

  newBooking(booking: NewBooking) {
    const url = new URL(`${environment.api}/bookings`);

    return lastValueFrom(
      this.http.put<NewBooking>(
        url.toString(),
        booking
      ),
    );
  }
}

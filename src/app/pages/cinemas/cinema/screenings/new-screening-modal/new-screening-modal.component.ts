import { AsyncButtonComponent } from '@/app/shared/components/async-button/async-button.component';
import { FieldErrorMessagesPipe } from '@/app/shared/pipes/field-error-messages.pipe';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QueryClient, injectMutation, injectQuery } from '@tanstack/angular-query-experimental';
import { Cinema, CinemasService, NewScreening, Screen } from '../../../cinemas.service';
import { Movie, MoviesService } from '@/app/pages/movies/movies.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { dateTimeInFuture, validateMovie } from '@/app/shared/directives/validators.directive';
import { FormErrorMessagesPipe } from '@/app/shared/pipes/form-error-messages.pipe';

interface Properties {
  cinema: Cinema;
  screen: Screen;
};

@Component({
  selector: 'app-new-screening-modal',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FieldErrorMessagesPipe,
    FormErrorMessagesPipe,
    AsyncButtonComponent,
    MatAutocompleteModule,
    MatTimepickerModule,
    MatDatepickerModule
  ],
  templateUrl: './new-screening-modal.component.html',
  styleUrl: './new-screening-modal.component.scss'
})
export class NewScreeningModalComponent {
  constructor() {
    this.form.controls.movie.valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
        this.movieInput.set(value);
      }
    });

    effect(() => {
      const movies = this.movies.data()?.content ?? [];

      if (movies.length > 0) {
        this.form.controls.movie.setValidators([
          Validators.required,
          validateMovie(movies ?? [])
        ]);
        this.form.controls.movie.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  private readonly queryClient = inject(QueryClient);
  private readonly service = inject(CinemasService);
  private readonly moviesService = inject(MoviesService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialogRef = inject(MatDialogRef);
  private readonly data = inject(MAT_DIALOG_DATA) as Properties;

  private readonly movies = injectQuery(() => this.moviesService.movies(0, 100));
  private readonly movieInput = signal<string>('');
  protected readonly filteredMovies = computed(() =>
    this.movies.data()?.content.filter((m) =>
      m.name.toLowerCase().includes(this.movieInput().toLowerCase())
    ) ?? []
  );

  protected readonly mutation = injectMutation(() => ({
    mutationFn: (screening: NewScreening) => this.service.newScreening(this.data.cinema.id, this.data.screen.id, screening),
    onError: () => {
      this.snackBar.open('Failed to add new screening', 'Close');
    },
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['screenings'] });
      this.snackBar.open('Successfully added new screening', 'Close');
      this.dialogRef.close();
    }
  }))

  protected readonly form = new FormGroup({
    movie: new FormControl<Movie | null>(null, {
      validators: [
        Validators.required,
        validateMovie(this.movies.data()?.content ?? [])
      ]
    }),
    date: new FormControl<Date | null>(null, {
      validators: [Validators.required]
    }),
    time: new FormControl<Date | null>(null, {
      validators: [Validators.required]
    })
  }, {
    validators: [
      dateTimeInFuture(),
      // overlappingScreening()
    ]
  });

  protected onSubmit(): void {
    if (this.form.valid && this.form.value.date && this.form.value.time) {
      const startTime = new Date(
        this.form.value.date.getFullYear(),
        this.form.value.date.getMonth(),
        this.form.value.date.getDate(),
        this.form.value.time.getHours(),
        this.form.value.time.getMinutes()
      );

      this.mutation.mutate({
        movieId: this.form.value.movie?.id ?? 0,
        startTime: startTime.toISOString(),
      });
    }
  }

  protected displayMovieName(movie: Movie): string {
    return movie?.name ?? '';
  }
}

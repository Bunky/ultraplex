import { Movie } from "@/app/pages/movies/movies.service";
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

interface DateTimeFormValue {
  date: Date | null;
  time: Date | null;
};

export function validateMovie(movies: Movie[] | null): ValidatorFn {
  return (control: AbstractControl<Movie | null>): ValidationErrors | null => {
    if (!movies) return null;

    const { value } = control;
    return movies.find((movie) => movie?.id === value?.id) ? null : { movieNotFound: true };
  };
};

const getFormDateTime = (form: FormGroup): Date | null => {
  const { date, time } = form.value as DateTimeFormValue;
  if (!date || !time) return null;

  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes());
};

export function dateTimeInFuture(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const form = control as FormGroup;

    const dateTime = getFormDateTime(form);
    return dateTime && (dateTime < new Date() ? { dateTimeInFuture: true } : null);
  };
};

// export function overlappingScreening(screenings: Screening[]): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     const form = control as FormGroup;
//     const startTime = getFormDateTime(form);
//     const movieRuntime = form.value.movie.runtime;

//     // Loop over screenings check to see if the suggested startTime and the movie runtime overrun with other screenings
//     return null;
//   };
// };

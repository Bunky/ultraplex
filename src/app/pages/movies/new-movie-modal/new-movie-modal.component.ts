import { Component, inject } from '@angular/core';
import { MoviesService, NewMovie } from '../movies.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QueryClient, injectMutation } from '@tanstack/angular-query-experimental';
import { FormErrorMessagesPipe } from '@/app/shared/pipes/form-error-messages.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AsyncButtonComponent } from '@/app/shared/components/async-button/async-button.component';

@Component({
  selector: 'app-new-movie-modal',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormErrorMessagesPipe,
    AsyncButtonComponent
  ],
  templateUrl: './new-movie-modal.component.html',
  styleUrl: './new-movie-modal.component.scss'
})
export class NewMovieModalComponent {
  readonly queryClient = inject(QueryClient);
  private readonly service = inject(MoviesService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef);

  readonly mutation = injectMutation(() => ({
    mutationFn: (movie: NewMovie) => this.service.newMovie(movie),
    onError: () => {
      this.snackBar.open('Failed to add new movie', 'Close');
    },
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['movies'] });
      this.snackBar.open('Successfully added new movie', 'Close');
      this.dialogRef.close();
    }
  }))

  form = new FormGroup({
    name: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]
    }),
    runtime: new FormControl(0, {
      validators: [
        Validators.required,
        Validators.min(1),
        Validators.max(1000),
        Validators.pattern('^[0-9]*$')
      ]
    })
  });

  onSubmit() {
    if (this.form.valid) {
      this.mutation.mutate(this.form.value as NewMovie);
    }
  }
}

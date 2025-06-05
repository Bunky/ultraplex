import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { CinemasService, NewCinema } from '../cinemas.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormErrorMessagesPipe } from '@pipes/form-error-messages.pipe';
import { AsyncButtonComponent } from '@/app/shared/components/async-button/async-button.component';

@Component({
  selector: 'app-new-cinema-modal',
  imports: [MatButtonModule, MatDialogModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, FormErrorMessagesPipe, AsyncButtonComponent],
  templateUrl: './new-cinema-modal.component.html',
  styleUrl: './new-cinema-modal.component.scss'
})
export class NewCinemaModalComponent {
  readonly queryClient = inject(QueryClient);
  private readonly service = inject(CinemasService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef);

  readonly mutation = injectMutation(() => ({
    mutationFn: (cinema: NewCinema) => this.service.newCinema(cinema),
    onError: () => {
      this.snackBar.open('Failed to add new cinema', 'Close');
    },
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['cinemas'] });
      this.snackBar.open('Successfully added new cinema', 'Close');
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
  });

  onSubmit() {
    if (this.form.valid) {
      this.mutation.mutate(this.form.value as NewCinema);
    }
  }
}

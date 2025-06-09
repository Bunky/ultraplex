import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QueryClient, injectMutation } from '@tanstack/angular-query-experimental';
import { CinemasService, NewScreen } from '../../cinemas.service';
import { AsyncButtonComponent } from '@/app/shared/components/async-button/async-button.component';
import { FieldErrorMessagesPipe } from '@/app/shared/pipes/field-error-messages.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-new-screen-modal',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FieldErrorMessagesPipe,
    AsyncButtonComponent
  ],
  templateUrl: './new-screen-modal.component.html',
  styleUrl: './new-screen-modal.component.scss'
})
export class NewScreenModalComponent {
  private readonly queryClient = inject(QueryClient);
  private readonly service = inject(CinemasService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialogRef = inject(MatDialogRef);
  private readonly cinemaId = inject(MAT_DIALOG_DATA) as number;

  protected readonly mutation = injectMutation(() => ({
    mutationFn: (screen: NewScreen) => this.service.newScreen(this.cinemaId, screen),
    onError: () => {
      this.snackBar.open('Failed to add new screen', 'Close');
    },
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['cinemas'] });
      this.snackBar.open('Successfully added new screen', 'Close');
      this.dialogRef.close();
    }
  }))

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]
    })
  });

  protected onSubmit(): void {
    if (this.form.valid) {
      this.mutation.mutate(this.form.value as NewScreen);
    }
  }
}

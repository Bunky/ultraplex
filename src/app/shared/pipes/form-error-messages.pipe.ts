import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Pipe({
  name: 'formErrorMessages',
  pure: false
})
export class FormErrorMessagesPipe implements PipeTransform {
  transform(control: AbstractControl | null, label = 'This field'): string | undefined {
    if (!control || !control.errors || !(control.touched || control.dirty)) return undefined;

    if (control.errors['required']) {
      return `${label} is required.`;
    }
    if (control.errors['minlength']) {
      return `${label} must be at least ${control.errors['minlength'].requiredLength} characters.`;
    }
    if (control.errors['maxlength']) {
      return `${label} cannot be more than ${control.errors['maxlength'].requiredLength} characters.`;
    }

    return undefined;
  }
}

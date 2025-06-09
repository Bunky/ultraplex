import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'formErrorMessages',
  pure: false
})
export class FormErrorMessagesPipe implements PipeTransform {
  transform(control: AbstractControl | null): string | undefined {
    const form = control as FormGroup;

    if (form.errors?.['dateTimeInFuture']) {
      return 'The datetime should be in the future.';
    }

    return undefined;
  }
}

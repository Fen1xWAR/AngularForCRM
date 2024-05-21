import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (control.get('password')?.value === control.get('confirmPassword')?.value) {
    return null;
  } else {
    return {PasswordNoMatch: true}
  }
}

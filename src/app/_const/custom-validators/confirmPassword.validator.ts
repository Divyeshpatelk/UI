import { FormControl } from '@angular/forms';
export class PasswordValidation {

  static MatchPassword(formControl: FormControl) {
    const password = formControl.get('password').value; // to get value in input tag
    const confirmPassword = formControl.get('confirmPassword').value; // to get value in input tag

    if (password !== confirmPassword) {
      formControl.get('confirmPassword').setErrors({ matchPassword: true });

    } else {
      return null;
    }
  }
}


import { FormControl } from '@angular/forms';

export class PreventWhitespace {
  static noWhitespaceValidator(control: FormControl) {
    // check for datepicker control if it is object then return else check for whitespace
    if (typeof control.value === 'object') {
      return;
    } else {
      const isWhitespace = (control.value.trim().length === 0) ? true : false;
      return isWhitespace ? { 'whitespace': true } : null;
    }
  }
}

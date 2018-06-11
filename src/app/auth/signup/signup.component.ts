import { environment } from '../../../environments/environment';

import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { Account } from './../../_models/account';
import { ValidatorLengths } from '../../_const/validation.lengths';
import { ValidationPattern } from '../../_const/validation.pattern';
import { PreventWhitespace } from './../../_const/custom-validators/preventWhitespace.validator';
import { SignupService } from './signup.service';
import { AuthenticationService } from '../../core/services';

@Component({
  selector: 'pdg-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public staticContentPath: string;

  /**
   * FormGroup instance for signUpForm
   * @type {FormGroup}
   */
  signUpForm: FormGroup;

  /**
   * String variable to store datestring
   * @type {string}
   */
  dateString: string;

  /**
   * Object declaration for signupJson
   * @type {Object}
   */
  signupJson: Object = {};

  /**
   * Initialize flag for loader
   * @type {boolean}
   */
  loading = false;

  /**
   * Initialize flag for success
   * @type {boolean}
   */
  success = false;

  /**
   * Initialize flag for error
   * @type {boolean}
   */
  error = false;

  /**
   * Set max and min date for Datepicker before five year from current year
   *
   */
  currentDate = new Date();
  minDate = { year: 1950, month: 1, day: 1 };
  maxDate = {
    year: this.currentDate.getFullYear() - 5,
    month: this.currentDate.getMonth(),
    day: this.currentDate.getDate()
  };

  /**
   * Decorator to get the first element matching the selector from DOM
   */
  @ViewChild('datepicker') datepicker;

  /**
   * Creates an instance of SignupComponent.
   * @param {Router} router
   * @param {FormBuilder} formBuilder
   * @param {SignupService} signupService
   * @param {NotificationsService} notifyService
   * @param {TranslateService} translator
   */
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private signupService: SignupService,
    private notifyService: NotificationsService,
    private translator: TranslateService,
    private authService: AuthenticationService
  ) {
    this.staticContentPath = environment.staticContentPath;
  }

  ngOnInit() {
    // Create fields for formBuilder object before view init
    this.signUpForm = this.formBuilder.group({
      firstname: [
        '',
        [
          Validators.required,
          Validators.minLength(ValidatorLengths.FIRST_NAME_MIN),
          Validators.maxLength(ValidatorLengths.FIRST_NAME_MAX),
          Validators.pattern(ValidationPattern.FIRST_NAME),
          PreventWhitespace.noWhitespaceValidator
        ]
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.minLength(ValidatorLengths.LAST_NAME_MIN),
          Validators.maxLength(ValidatorLengths.LAST_NAME_MAX),
          Validators.pattern(ValidationPattern.LAST_NAME),
          PreventWhitespace.noWhitespaceValidator
        ]
      ],
      dob: ['', [Validators.required, PreventWhitespace.noWhitespaceValidator]],
      gender: ['', Validators.required],
      countrycode: ['+91'],
      mobilenumber: ['', [Validators.required, Validators.minLength(ValidatorLengths.MOBILE_MIN)]],
      email: ['', [Validators.required, Validators.maxLength(ValidatorLengths.EMAIL_MAX), Validators.email]],
      terms: [false, Validators.pattern('true')]
    });
  }

  /**
   * Decorator to listen to document click event of host element and execute decorated method
   *
   */
  @HostListener('document:click', ['$event'])
  closeDatepickerOnclick(event) {
    if (event.target.offsetParent !== null && event.target.offsetParent.tagName !== 'NGB-DATEPICKER') {
      this.datepicker.close();
    }
  }

  /**
   * Method to check user's Email Id is available in database
   */
  isEmailAvailable() {
    if (this.signUpForm.controls['email'].valid) {
      this.loading = true;
      this.success = false;
      this.error = false;
      const email = this.signUpForm.controls['email'].value;
      this.signupService.checkEmailAvailability(email).subscribe(
        (response) => {
          this.loading = false;
          this.error = false;
          this.success = true;
        },
        (error) => {
          this.loading = false;
          this.error = true;
          this.success = false;
          this.signUpForm.controls['email'].setErrors({ unavailable: true });
          // Show error notification
          this.notifyService.error(this.translator.instant('EMAIL_EXIST'), '', { clickToClose: false });
        }
      );
    }
  }

  /**
   * Method call to reset signUpForm
   */
  resetForm() {
    this.signUpForm.reset();
  }

  /**
   * Method to hide loader on focus of email field
   */
  focusInFunction() {
    this.loading = false;
    this.error = false;
    this.success = false;
  }

  /**
   * Method to trim the given value
   * @param value
   */
  trimString(value: string) {
    const trimmedValue = value.trim();
    return trimmedValue;
  }

  /**
   * Method to toggle datepicker
   * @param event
   */
  toggleDatePicker(event) {
    this.datepicker.toggle();
    event.stopPropagation();
  }

  /**
   * Method to convert date into yyyy-mm-dd format add leading 0 to month and day
   * @param dateObject
   */
  convertDateObjecttoString(dateObject) {
    const month = dateObject.month < 10 ? `0${dateObject.month}` : dateObject.month;
    const day = dateObject.day < 10 ? `0${dateObject.day}` : dateObject.day;
    this.dateString = `${dateObject.year}-${month}-${day}`;
    return this.dateString;
  }

  /**
   * Method call on submit of signUpForm
   * @param signupForm
   */
  signUp(signupForm) {
    const dateOfBirth = this.convertDateObjecttoString(signupForm.dob);
    const password = 'Pedagogy@123';
    // TODO : Remove country code when ui finalized
    if (signupForm.mobilenumber === '') {
      this.signupJson = {
        firstname: this.trimString(signupForm.firstname),
        lastname: this.trimString(signupForm.lastname),
        dob: this.trimString(dateOfBirth),
        gender: signupForm.gender,
        email: this.trimString(signupForm.email),
        password: password
      };
    } else {
      this.signupJson = {
        firstname: this.trimString(signupForm.firstname),
        lastname: this.trimString(signupForm.lastname),
        dob: this.trimString(dateOfBirth),
        gender: signupForm.gender,
        countrycode: 91,
        mobilenumber: +signupForm.mobilenumber,
        email: this.trimString(signupForm.email),
        password: password
      };
    }
    this.signupService.signup(this.signupJson).subscribe(
      (response) => {
        // Show success notification
        this.notifyService.success(this.translator.instant('REGISTRATION_SUCCESS'));
        this.focusInFunction();
        this.resetForm();
        // this.router.navigate(['/login']);
        this.router.navigate(['/']);
      },
      (error: HttpErrorResponse) => {
        // Show error notification
        this.notifyService.error(this.translator.instant('REGISTRATION_FAILED'), '', { clickToClose: false });
      }
    );
  }

  signInWithGoogle(): void {
    this.authService.signInWithGoogle().subscribe(null, null, () => {
      this.router.navigate(['/']);
    });
  }

  signInWithFB(): void {
    this.authService.signInWithFB().subscribe(null, null, () => {
      this.router.navigate(['/']);
    });
  }
}

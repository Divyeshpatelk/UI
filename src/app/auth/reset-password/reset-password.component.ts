import { environment } from './../../../environments/environment';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../../core/services/';

import { ValidationPattern, ValidatorLengths } from '../../_const/';
import { PasswordValidation } from '../../_const/';
import { User } from '../../_models/user';

/**
 * Component class for reset password screen.
 *
 * @export
 * @class ResetPasswordComponent
 * @implements {OnInit}
 * @version 1.0
 * @author
 */
@Component({
  selector: 'pdg-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public staticContentPath: string;

  /**
   * Email Address passed to the Reset Password Screen
   * @type {string}
   */
  email: string;

  /**
   * Token passed to the reset password screen for validation
   * @type {string}
   */
  token: string;

  /**
   * Variable to store token validation result
   * @type {boolean}
   */
  isTokenValid: boolean;

  /**
   * FormGroup instance for ResetPassword Form
   * @type {FormGroup}
   */
  resetPasswordForm: FormGroup;

  /**
   * Creates an instance of ResetPasswordComponent.
   *
   * @param {FormBuilder} formBuilder
   * @param {ActivatedRoute} activatedRoute
   * @param {Router} router
   * @param {AuthenticationService} authService
   * @param {NotificationsService} notifyService
   * @param {TranslateService} translator
   */
  constructor(private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private notifyService: NotificationsService,
    private translator: TranslateService) {
    this.staticContentPath = environment.staticContentPath;
  }

  /**
   * Overridden method invoked when component is loaded
   */
  ngOnInit() {
    this.activatedRoute.data.subscribe((data: { valid: boolean }) => {
      this.isTokenValid = data.valid;
    });
    this.email = this.activatedRoute.snapshot.queryParams['email'];
    this.token = this.activatedRoute.snapshot.queryParams['token'];

    this.resetPasswordForm = this.formBuilder.group({
      'password': ['', [Validators.required,
      Validators.minLength(ValidatorLengths.PASSWORD_MIN),
      Validators.maxLength(ValidatorLengths.PASSWORD_MAX),
      Validators.pattern(ValidationPattern.PASSWORD)]],
      'confirmPassword': ['', [Validators.required,
      Validators.minLength(ValidatorLengths.PASSWORD_MIN),
      Validators.maxLength(ValidatorLengths.PASSWORD_MAX),
      Validators.pattern(ValidationPattern.PASSWORD)]]
    }, {
        validator: PasswordValidation.MatchPassword
      });
  }

  /**
   * Method invoked on submit button click on Set Password Screen
   */
  resetPassword(): void {
    const password = this.resetPasswordForm.value.password;
    this.authService.resetPassword({ 'email': this.email, 'password': password, 'token': this.token })
      .subscribe((data: User) => {
        this.router.navigate(['/login']);
        this.notifyService.success(this.translator.instant('SET_PASSWORD_SUCCESS'));

      }, (error: HttpErrorResponse) => {
        let message;
        if (error.status === 200) {
          message = error.error.responseMessage;
        } else {
          message = error.error.error_description;
        }
        this.notifyService.error(this.translator.instant('SET_PASSWORD_FAILED'), message, {
          clickToClose: false
        });
        this.resetPasswordForm.reset();
      });
  }
}

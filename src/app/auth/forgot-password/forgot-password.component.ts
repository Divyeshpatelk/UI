import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../../core/services';
import { ValidationPattern } from '../../_const';

/**
 * Component class for Forgot Password component. User enters valid email address and on submit calls the auth service forgot password API.
 *
 * @export
 * @class ForgotPasswordComponent
 * @implements {OnInit}
 * @version 1.0
 * @author
 */
@Component({
  selector: 'pdg-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  /**
   * FormGroup Instance for Forgot Password Form
   * @type {FormGroup}
   */
  forgotPasswordForm: FormGroup;

  /**
   * Creates an instance of ForgotPasswordComponent.
   * @param {FormBuilder} formBuilder
   * @param {NgbActiveModal} activeModal
   * @param {AuthenticationService} authService
   * @param {NotificationsService} notifyService
   * @param {TranslateService} translator
   */
  constructor(private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private authService: AuthenticationService,
    private notifyService: NotificationsService,
    private translator: TranslateService) { }


  /**
   * Overridden method invoked when component is loaded.
   */
  ngOnInit() {
    this.forgotPasswordForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Method invoked on submit button click
   */
  forgotPassword() {
    const email = this.forgotPasswordForm.value.email;
    this.authService.forgotPassword(email).subscribe(data => {
      this.activeModal.close();
      this.notifyService.success(this.translator.instant('EMAIL_SENT_WITH_PWD_LINK'));

    }, (errorResponse: HttpErrorResponse) => {
      let message;
      if (errorResponse.status === 200) {
        message = errorResponse.error.responseMessage;

      } else {
        message = errorResponse.error.error_description;
      }

      this.notifyService.error('', message, {
        clickToClose: false
      });
    });
  }
}

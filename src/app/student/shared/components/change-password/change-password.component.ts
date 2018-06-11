import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidationPattern, ValidatorLengths, PasswordValidation } from '../../../../_const/';
import { AuthenticationService } from '../../../../core/services';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'pdg-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  public staticContentPath: string;
  changePasswordForm: FormGroup;
  isSubmitBtnDisable = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private notifyService: NotificationsService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {
    this.staticContentPath = environment.staticContentPath;
  }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group(
      {
        oldPassword: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(ValidatorLengths.PASSWORD_MIN),
            Validators.maxLength(ValidatorLengths.PASSWORD_MAX),
            Validators.pattern(ValidationPattern.PASSWORD)
          ]
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(ValidatorLengths.PASSWORD_MIN),
            Validators.maxLength(ValidatorLengths.PASSWORD_MAX),
            Validators.pattern(ValidationPattern.PASSWORD)
          ]
        ]
      },
      {
        validator: PasswordValidation.MatchPassword
      }
    );
  }

  changePassword() {
    if (!this.changePasswordForm.valid) {
      return;
    }
    const data = {
      oldPassword: this.changePasswordForm.get('oldPassword').value,
      newPassword: this.changePasswordForm.get('confirmPassword').value
    };
    this.isSubmitBtnDisable = true;
    this.authService.changePassword(data).subscribe(
      (response) => {
        this.authService.logout().subscribe(() => {
          location.reload();
        });
      },
      (error) => {
        this.isSubmitBtnDisable = false;
        this.notifyService.error('', error.error.responseMessage);
      }
    );
  }
}

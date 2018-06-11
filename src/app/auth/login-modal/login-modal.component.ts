import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthenticationService } from '../../core/services';
import { environment } from '../../../environments/environment';
import { ForgotPasswordComponent } from '..';

@Component({
  selector: 'pdg-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  public staticContentPath: string;

  /**
   * FormGroup Instance for Login Form
   * @type {FormGroup}
   */
  loginForm: FormGroup;

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
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  /**
   * Method invoked on Login Form Submit Action
   */
  login() {
    const loginData = this.loginForm.value;
    this.authService.login(loginData).subscribe(
      (data) => {
        this.activeModal.close(true);
      },
      (error: HttpErrorResponse) => {
        this.loginForm.controls['password'].reset();
      }
    );
  }

  /**
   * Method invoked on Forgot Password Link Cick. This initiates the Forgot Password Screen.
   */
  open() {
    const modalRef = this.modalService.open(ForgotPasswordComponent);
  }

  signInWithGoogle(): void {
    this.authService.signInWithGoogle().subscribe(null, null, () => {
      this.activeModal.close();
    });
  }

  signInWithFB(): void {
    this.authService.signInWithFB().subscribe(null, null, () => {
      this.activeModal.close();
    });
  }

  signup() {
    this.activeModal.close();
    this.router.navigate(['/signup']);
  }
}

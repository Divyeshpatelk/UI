// Default Angular Libraries
import { environment } from '../../../environments/environment';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

// Third Party Components
import { NotificationsService } from 'angular2-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Custom Components
import { AuthenticationService } from '../../core/services';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

/**
 * Component Class for Login Screen
 *
 * @export
 * @class LoginComponent
 * @implements {OnInit}
 * @version 1.0
 * @author
 */
@Component({
  selector: 'pdg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public staticContentPath: string;

  /**
   * FormGroup Instance for Login Form
   * @type {FormGroup}
   */
  loginForm: FormGroup;

  /**
   * Creates an instance of LoginComponent.
   * @param {FormBuilder} formBuilder
   * @param {Router} router
   * @param {AuthenticationService} authService
   * @param {NotificationsService} notifyService
   * @param {NgbModal} modalService
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private notifyService: NotificationsService,
    private modalService: NgbModal
  ) {
    this.staticContentPath = environment.staticContentPath;
  }

  /**
   * Overriden Method from OnInit Interface.
   * Component Lifecycle first method invoked on Component Initialization
   *
   * @memberof LoginComponent
   */
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
        this.router.navigate(['/']);
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
    this.authService.signInWithGoogle().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  signInWithFB(): void {
    this.authService.signInWithFB().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

}

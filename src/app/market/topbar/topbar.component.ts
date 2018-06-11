import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from '../../_models';
import { environment } from '../../../environments/environment';
import { LoginModalComponent } from '../../auth/login-modal/login-modal.component';
import { AuthenticationService } from '../../core/services';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Component class for Partner Vertical TopBar.
 *
 * @export
 * @class TopbarComponent
 * @implements {OnInit}
 * @version 1.0
 * @author
 */
@Component({
  selector: 'pdg-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  public staticContentPath: string;

  /**
   * User details Object
   * @type {User}
   */
  user: User;

  /**
   * Variable for Navbar Collapsible
   */
  navbarCollapsed = true;

  isLoggedIn = false;

  /**
   * Creates an instance of TopbarComponent.
   * @param {AuthenticationService} authService
   * @param {Router} router
   */
  constructor(private modalService: NgbModal, public authService: AuthenticationService, private router: Router) {
    this.staticContentPath = environment.staticContentPath;
  }

  /**
   * Overridden method invoked when component is loaded.
   */
  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService._userDetail.subscribe((data) => {
      this.user = data;
    });
  }

  /**
   * Method invoked on Logout button click.
   */
  showLogin() {
    const modalRef = this.modalService.open(LoginModalComponent);
    modalRef.result.then(
      (result) => {
        location.reload();
      },
      (reason) => {
        // todo on cancel
      }
    );
  }

  /**
   * Method invoked on Logout button click.
   */
  logout() {
    this.authService.logout().subscribe(
      (data) => {
        // this.router.navigate(['/']);
        location.reload();
      },
      (errorResponse: HttpErrorResponse) => {
        // TODO: Handle Error scenario
      }
    );
  }
}

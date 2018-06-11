import { environment } from '../../../../../environments/environment';

import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { User, UploadContent } from '../../../../_models';
import { AuthenticationService } from '../../../../core/services';
import { UploadContentService } from '../../../services';
import { ConfirmComponent } from '../../../../shared/components';

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

  /**
   * Creates an instance of TopbarComponent.
   * @param {AuthenticationService} authService
   * @param {Router} router
   */
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private uploadContentService: UploadContentService,
    private modalService: NgbModal,
    private translator: TranslateService) {
    this.staticContentPath = environment.staticContentPath;
  }

  /**
   * Overridden method invoked when component is loaded.
   */
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('current_user'));
  }

  /**
   * Method invoked on Logout button click.
   */
  logout() {
    if (this.uploadContentService.isUploadingInProgress()) {
      const confirmModal = this.modalService.open(ConfirmComponent);
      confirmModal.componentInstance.title = this.translator.instant('WARNING');
      confirmModal.componentInstance.text = this.translator.instant('UPLOAD_CANCEL_CONFIRM_TEXT');
      confirmModal.componentInstance.confirmButtonText = this.translator.instant('YES');

      confirmModal.result.then(result => {
        this.uploadContentService.cancelAllUpload();
        this.authService.logout().subscribe(data => {
          this.router.navigate(['/login']);

        }, (errorResponse: HttpErrorResponse) => {
          // TODO: Handle Error scenario
        });

      }, (reason) => {

      });

    } else {
      this.authService.logout().subscribe(data => {
        this.router.navigate(['/login']);

      }, (errorResponse: HttpErrorResponse) => {
        // TODO: Handle Error scenario
      });
    }
  }
}

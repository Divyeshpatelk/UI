import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../../../../core/services';
import { environment } from '../../../../../environments/environment';
import { User, Course, BrandingInfo } from '../../../../_models';
import { CourseSelectorService } from '../..';
import { NotificationsService } from 'angular2-notifications';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'pdg-user-topbar',
  templateUrl: './user-topbar.component.html',
  styleUrls: ['./user-topbar.component.scss']
})
export class UserTopbarComponent implements OnInit {
  public staticContentPath: string;

  /**
   * Selected Course Object
   * @type {Course}
   */
  public course: Course;

  /**
   * Partner's branding logo url
   * @type {Observable<BrandingInfo>}
   */
  brandinginfo: BrandingInfo;

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
    private notifyService: NotificationsService,
    private courseSelector: CourseSelectorService,
    private modalService: NgbModal,
    private translator: TranslateService
  ) {
    this.staticContentPath = environment.staticContentPath;

  }

  /**
   * Overridden method invoked when component is loaded.
   */
  ngOnInit() {
    // Fetch the user information from LocalStorage
    this.user = JSON.parse(localStorage.getItem('current_user'));

    // navbar collapsed on route change event
    this.router.events.subscribe(url => {
      this.navbarCollapsed = true;
    });

    // Course Change Subscription
    /**
     * If course is null, then take it from localStorage.
     * Course will be null, when user log in and on page refresh
     */
    this.courseSelector.selectedCourse.subscribe((course: Course) => {
      this.course = course;
      if (this.course) {
        localStorage.setItem('course', JSON.stringify(this.course));
      } else {
        this.course = JSON.parse(localStorage.getItem('course'));
      }
    });

    this.courseSelector.brandinginfo.subscribe((brandinginfo: BrandingInfo) =>
      this.brandinginfo = brandinginfo
    );
  }

  routeToPartnerPage() {
    if (this.brandinginfo.logoClickUrl) {
      this.router.navigate([`/${this.brandinginfo.logoClickUrl}`]);
    }
  }

  /**
   * Method invoked on Logout button click.
   */
  logout() {
    this.authService.logout().subscribe(
      (data) => {
        this.router.navigate(['/']);
      },
      (errorResponse: HttpErrorResponse) => {
        // TODO: Handle Error scenario
      }
    );
  }

  /**
   * Method invoked when user clicks on Topbar links (Study / Practice)
   *
   * @param {string} mode Mode selected (Study/Practice)
   */
  selectMode(mode: string) {
    const course = JSON.parse(localStorage.getItem('course'));
    if (course) {
      this.router.navigate(['/student', mode, 'course', course.id]);
    } else {
      this.notifyService.error(
        this.translator.instant('NO_COURSE_SELECTED'),
        this.translator.instant('SELECT_FROM_SUBSCRIBED_COURSES'),
        {
          clickToClose: false
        }
      );
    }
  }

  /**
   * Method to open Change Password Popup
   */
  openChangePassword() {
    const modalRef = this.modalService.open(ChangePasswordComponent);
    modalRef.result.then(
      (result) => { },
      (reason) => {
        // todo on cancel
      }
    );
  }
}

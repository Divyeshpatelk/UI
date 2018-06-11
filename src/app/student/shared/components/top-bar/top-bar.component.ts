import { environment } from '../../../../../environments/environment';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '../../../../core/services/authentication.service';
import { User, Course } from '../../../../_models';

import { CourseSelectorService } from '../../../shared/services';

@Component({
  selector: 'pdg-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  public staticContentPath: string;

  /**
   * Selected Course Object
   * @type {Course}
   */
  public course: Course;

  /**
   * User Object
   * @type {User}
   */
  public user: User;

  /**
   * Variable for Navbar Collapsible
   */
  navbarCollapsed = true;

  /**
   * Creates an instance of TopBarComponent.
   * @param {AuthenticationService} authService AuthenticationService Instance
   * @param {CourseSelectorService} courseSelector CourseSelectorService Instance
   * @param {NotificationsService} notifyService NotificationsService Instance
   * @param {Router} router Router Instance
   * @param {TranslateService} translator TranslateService Instance
   */
  constructor(
    private authService: AuthenticationService,
    private courseSelector: CourseSelectorService,
    private notifyService: NotificationsService,
    private router: Router,
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
  }

  /**
   * Method invoked on Logout button click.
   */
  logout() {
    this.authService.logout().subscribe(data => {
      this.router.navigate(['/login']);

    }, (errorResponse: HttpErrorResponse) => {
      // TODO: Handle Error scenario
    });
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
      this.notifyService.error(this.translator.instant('NO_COURSE_SELECTED'), this.translator.instant('SELECT_FROM_SUBSCRIBED_COURSES'), {
        clickToClose: false
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

import { CourseManagerService } from '../../services';
import { Course, ContentUnitCount } from '../../../_models';

/**
 * Component Class for Partner MyCourses Screen
 * This class will show the My Courses layout with add course button as well.
 * This component will also implement search and filter for my courses page.
 *
 * @export
 * @class MyCoursesComponent
 * @implements {OnInit}
 * @version 1.0
 * @author
 */
@Component({
  selector: 'pdg-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss']
})
export class MyCoursesComponent implements OnInit {

  /**
   * Array of courses created by the user.
   *
   * @type {Array<{ 'course': Course, 'contentUnitCount': ContentUnitCount }>}
   */
  public myCourses: Array<{ 'course': Course, 'contentUnitCount': ContentUnitCount }>;

  /**
   * Course Filter Variable
   */
  public courseFilterArg = 'ALL';

  /**
   * Creates an instance of MyCoursesComponent.
   * @param {CourseManagerService} courseManagerService CourseManagerService Instance
   * @param {NotificationsService} notifyService NotificationsService Instance
   * @param {TranslateService} translator TranslateService Instance
   */
  constructor(
    private courseManagerService: CourseManagerService,
    private notifyService: NotificationsService,
    private translator: TranslateService) { }

  /**
   * Overridden method invoked when component is loaded.
   */
  ngOnInit() {
    this.getCourses();
  }

  getCourses() {
    // Setting it to empty before fetching.
    this.myCourses = [];
    this.courseManagerService.getCourses().subscribe((courses: { 'course': Course, 'contentUnitCount': ContentUnitCount }[]) => {
      this.myCourses = courses;

    }, (error: HttpErrorResponse) => {
      // Commenting this as this is creating issues.
      // this.notifyService.error(this.translator.instant('SOMETHING_WENT_WRONG'), '', {
      //   clickToClose: false
      // });
    });
  }

  /**
   * Callback function called on clicking on delete button on course item.
   * @param {string} courseid Unique Id of the selected course to be deleted
   */
  onCourseDelete(courseid: string) {
    // Call Course delete API
    this.courseManagerService.deleteCourse(courseid).subscribe(data => {
      this.notifyService.success(this.translator.instant('COURSE_DELETE_SUCCESS'));

      // Call GetCourses API after delete course is successful.
      this.getCourses();

    }, (error: HttpErrorResponse) => {
      this.notifyService.error(this.translator.instant('COURSE_DELETE_FAILED'), '', {
        clickToClose: false
      });
    });
  }

  filterCourses(param: string) {
    this.courseFilterArg = param;
  }
}

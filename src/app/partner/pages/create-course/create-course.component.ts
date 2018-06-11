import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

import { CourseManagerService } from '../../services';
import { Course, StaticPage } from '../../../_models';
import { ValidatorLengths } from '../../../_const';

/**
 * Component class for Create course screen
 * This page displays the courses list offered by the platform. Also gives an option to create a new course by providing
 * Course Name and description. New course will be created with the template / offered course selected by the user.
 *
 * @export
 * @class CreateCourseComponent
 * @implements {OnInit}
 * @version 1.0
 * @author
 */
@Component({
  selector: 'pdg-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit {

  /**
   * FormGroup Instance for Create Course Form
   * @type {FormGroup}
   */
  createCourseForm: FormGroup;

  /**
   * Array of Offered Courses templates
   * @type {Course[]}
   */
  offeredCourses: Course[];

  /**
   * Variable for Selected Course
   * @type {Course}
   */
  courseSelected: Course;

  /**
   * Variable for Selected Page
   * @type {Page}
   */
  pageSelected: StaticPage;

  /**
   * Static HTML pages URL's.
   * S3 Bucket URL's are converted to SafeResource URL
   * @type {SafeResourceUrl}
   */
  htmlPageUrl: SafeResourceUrl;

  /**
   * Tab Orientation
   */
  currentOrientation = 'vertical';

  /**
   * Creates an instance of CreateCourseComponent.
   *
   * @param {CourseManagerService} courseManager CourseManager Service Instance
   * @param {DomSanitizer} domSanitizer DomSanitizer Instance for Safe URL's
   * @param {FormBuilder} formBuilder FormBuilder Instance
   * @param {NotificationsService} notifyService NotificationsService Instance
   * @param {Router} router Router Instance
   * @param {TranslateService} translator Translate Service Instance
   */
  constructor(private courseManager: CourseManagerService,
    private domSanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private notifyService: NotificationsService,
    private router: Router,
    private translator: TranslateService) { }

  /**
   * Overridden method invoked when component is loaded.
   */
  ngOnInit() {
    this.createCourseForm = this.formBuilder.group({
      'courseName': ['', [
        Validators.required,
        Validators.minLength(ValidatorLengths.COURSE_NAME_MIN),
        Validators.maxLength(ValidatorLengths.COURSE_NAME_MAX)
      ]]
    });

    // GET Offered courses list from server
    this.courseManager.getOfferedCourses().subscribe((courses: Course[]) => {
      this.offeredCourses = courses;

      // setting default selected course template
      this.courseSelected = this.offeredCourses[0];

      // Setting default selected page from selected course template
      this.pageSelected = this.courseSelected.pages[0];

      // Setting Default selected page url
      this.htmlPageUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pageSelected.content);

    }, error => {
      // this.notifyService.error(this.translator.instant('SOMETHING_WENT_WRONG'), '', {
      //   clickToClose: false
      // });
    });
  }

  /**
   * Event fired when tab is selected
   *
   * @param {NgbTabChangeEvent} event
   */
  showTabContent(event: NgbTabChangeEvent) {
    this.pageSelected = this.courseSelected.pages.filter(page => page.title === event.nextId)[0];
    this.htmlPageUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pageSelected.content);
  }

  /**
   * Method invoked on Add Content Button Click.
   */
  createCourse() {
    const createCourseJson = {
      'courseName': this.createCourseForm.value.courseName,
      'description': '',
      'courseTemplateId': this.courseSelected.id
    };
    this.courseManager.createCourse(createCourseJson).subscribe((course: Course) => {
      // Show success notification
      this.notifyService.success(this.translator.instant('CREATE_COURSE_SUCCESS'));

      // Navigate to index page in edit mode with ID of the course created.
      this.router.navigate(['/partner', 'course', course.id, 'edit']);

    }, (error: HttpErrorResponse) => {
      this.notifyService.error(this.translator.instant('CREATE_COURSE_FAILED'), '', {
        clickToClose: false
      });
    });
  }
}

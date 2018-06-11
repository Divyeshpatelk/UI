import { BrandingInfo } from './../../../_models/brandinginfo';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';

import { CourseManagerService } from '../../shared/services/course-manager.service';
import { Course, ContentUnitCount } from '../../../_models/course';
import { CouponRedemptionModalComponent } from './coupon-redemption-modal/coupon-redemption-modal.component';

import { CourseSelectorService } from '../../shared/services';
import { Subject } from '../../../_models';

/**
 * Component class for student my courses screen.
 * Displays all courses subscribed by the student
 *
 * @export
 * @class MyCoursesComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'pdg-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss']
})
export class MyCoursesComponent implements OnInit {

  /**
   * Courses Array
   * @type {Observable<{ 'course': Course, 'contentUnitCount': ContentUnitCount }[]>}
   */
  courses: Observable<{ 'course': Course, 'contentUnitCount': ContentUnitCount }[]>;

  /**
   * Selected Course
   * @type {Course}
   */
  selectedCourse: Course;

  /**
   * Creates an instance of MyCoursesComponent.
   * @param {CourseManagerService} courseManager
   * @param {CourseSelectorService} courseSelector
   * @param {FormBuilder} formBuilder
   * @param {NotificationsService} notification
   * @param {NgbModal} modalService
   * @param {TranslateService} translator
   */
  constructor(
    private courseManager: CourseManagerService,
    private courseSelector: CourseSelectorService,
    private formBuilder: FormBuilder,
    private notification: NotificationsService,
    private modalService: NgbModal,
    private router: Router,
    private translator: TranslateService
  ) { }

  /**
   * Overridden method invoked when component is loaded.
   */
  ngOnInit() {
    // Fetching the Course List from Server
    this.courses = this.courseManager.getCourses();
  }

  /**
   * Method invoked to open coupon code Modal
   */
  openCouponRedemptionModal() {
    const modalRef = this.modalService.open(CouponRedemptionModalComponent);
    modalRef.result.then((result) => {
      this.courses = this.courseManager.getCourses();

    }, (close) => {
      // Nothing to do
    });
  }

  /**
   * Method to select the course
   * @param {Course} course Course Selected
   */
  selectCourse(course: Course) {
    this.selectedCourse = course;
    this.courseManager.getCourseDetails(course.id)
    .subscribe((data: { course: Course; subjects: Subject[]; brandinginfo: BrandingInfo }) => {
      this.courseSelector.selectCourse(data.course);
      this.courseSelector.selectBrandingLogo(data.brandinginfo);
    });
    this.router.navigate(['/student', 'dashboard', course.id]);
  }
}

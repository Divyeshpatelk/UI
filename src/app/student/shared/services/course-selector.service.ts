import { environment } from '../../../../environments/environment';

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Course, BrandingInfo } from '../../../_models';

/**
 * This service handles the Course Selection for Student Module
 *
 * @export
 * @class CourseSelectorService
 */
@Injectable()
export class CourseSelectorService {
  /**
   * Observable Object for Subject
   *
   * @type {BehaviorSubject<Course>}
   * @memberof CourseSelectorService
   */
  public selectedCourse: BehaviorSubject<Course>;

  /**
   * Variable to hold the Static content path
   * @type {string}
   */
  public staticContentPath: string;

  /**
   * Observable Object for brandinglogo
   *
   * @type {BehaviorSubject<BrandingInfo>}
   * @memberof CourseSelectorService
   */
  public brandinginfo: BehaviorSubject<BrandingInfo>;

  /**
   * Creates an instance of CourseSelectorService.
   */
  constructor() {
    this.selectedCourse = new BehaviorSubject<Course>(null);
    this.brandinginfo = new BehaviorSubject<BrandingInfo>(null);
    this.staticContentPath = environment.staticContentPath;
  }

  /**
   * Method invoked when user selects any Course
   *
   * @param {Course} course Selected Course Object
   * @memberof CourseSelectorService
   */
  selectCourse(course: Course) {
    this.selectedCourse.next(course);
  }

  /**
   * Method invoked when user selects any Course
   *
   * @param {Course} logo Selected Course Object
   * @memberof CourseSelectorService
   */
  selectBrandingLogo(brandinginfo: BrandingInfo) {
    this.brandinginfo.next(brandinginfo);
    localStorage.setItem('partner-brandingInfo', JSON.stringify(brandinginfo));
  }

}

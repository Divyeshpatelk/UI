import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Course, ContentUnitCount, Subject, BrandingInfo } from '../../../_models';
import { APIConfig } from '../../../_config/api-config';

/**
 * Student Course Manager Service
 *
 * @export
 * @class CourseManagerService
 */
@Injectable()
export class CourseManagerService {

  /**
   * Creates an instance of CourseManagerService.
   * @param {HttpClient} http
   */
  constructor(private http: HttpClient) { }

  /**
   * This API is used to call Partner Vertical My Courses API.
   * This API will return all the courses created by the user for Student Marketplace.
   *
   * @returns {Observable<{ 'course': Course, 'contentUnitCount': ContentUnitCount }[]>}
   */
  getCourses(): Observable<{ 'course': Course, 'contentUnitCount': ContentUnitCount }[]> {
    return this.http.get<{ 'course': Course, 'contentUnitCount': ContentUnitCount }[]>(APIConfig.STUDENT_GET_MY_COURSES);
  }

  /**
   * This API will call apply coupon code API.
   *
   * @param {string} couponCode unique coupon code
   * @returns {Observable<any>}
   */
  redeemCouponCode(couponCode: string): Observable<any> {
    return this.http.post(APIConfig.STUDENT_COUPON_REDEMPTION, '', {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      params: new HttpParams().set('promotionCode', couponCode)
    });
  }

  /*
   * Returns Course Details of the specified course
   *
   * @param {string} courseId Unique ID of the Course
   * @returns {Observable<{ 'course': Course, 'subjects': Subject[] }>}
   */
  getCourseDetails(courseId: string): Observable<{ 'course': Course, 'subjects': Subject[], 'brandinginfo': BrandingInfo }> {
    return this.http.get<{
      'course': Course, 'subjects': Subject[], 'brandinginfo': BrandingInfo
    }>(`${APIConfig.STUDENT_GET_COURSE_DETAILS}/${courseId}`);
  }
}

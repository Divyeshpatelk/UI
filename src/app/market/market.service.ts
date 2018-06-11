import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Course, ContentUnitCount } from '../_models';
import { APIConfig } from '../_config';

@Injectable()
export class MarketService {
  constructor(private http: HttpClient) {}

  /**
   * This API is used to call Partner Vertical My Courses API.
   * This API will return all the courses created by the user for Student Marketplace.
   *
   * @returns {Observable<{ 'course': Course, 'contentUnitCount': ContentUnitCount }[]>}
   */
  getMyCourses(): Observable<{ course: Course; contentUnitCount: ContentUnitCount }[]> {
    return this.http.get<{ course: Course; contentUnitCount: ContentUnitCount }[]>(APIConfig.STUDENT_GET_MY_COURSES);
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
}

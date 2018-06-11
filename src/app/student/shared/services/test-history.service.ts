import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TestHistory } from './../../../_models/test-result';
import { APIConfig } from './../../../_config/api-config';

/**
 * This service handles the Tests given by Students
 *
 * @export
 * @class TestHistoryService
 */
@Injectable()
export class TestHistoryService {

  /**
   * Creates an instance of TestHistoryService.
   * @param {HttpClient} http
   */
  constructor(private http: HttpClient) { }


  /**
   * This API is used to call Partner Vertical for Practice Tests.
   * This API will return all the practice tests for particular course & subject belonging to logged in user.
   *
   * @returns {Observable<>}
   */
  getPracticeTestHistoryForStudent(courseId: string, subjectId: string, page: number, limit: number) {
    const courses = {'courses': [{'mappingId': courseId, 'subjectid': subjectId}]};
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const httpParams = new HttpParams().set('page', page.toString())
      .set('size', limit.toString())
      .set('sort', 'createdDate,DESC');
    console.log(httpParams);
    return this.http.post<TestHistory>(APIConfig.STUDENT_PRACTICE_TEST_HISTORY, JSON.stringify(courses),
           {params: httpParams, headers: httpHeaders});
  }

  /**
   * This API is used to call Partner Vertical for Praceice Test detail.
   * This API will return the details of practice test for student.
   *
   * @returns {Observable<>}
   */
  getPracticeTestDetailByTestId(testId: string) {
    const httpParams = new HttpParams().set('testId', testId);
    return this.http.get(APIConfig.STUDENT_PRACTICE_TEST_DETAIL, {params: httpParams});
  }

  /**
   * This API is used to call Partner Vertical for Custom Tests.
   * This API will return the list of custom test for student.
   *
   * @returns {Observable<>}
   */
  getCustomTestHistory(courseId: string, page: number, limit: number) {
    const courses = {'courses': [{'mappingId': courseId}]};
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const httpParams = new HttpParams().set('page', page.toString())
      .set('size', limit.toString())
      .set('sort', 'createdDate,DESC');
    return this.http.post<TestHistory>(APIConfig.STUDENT_CUSTOM_TEST_HISTORY, JSON.stringify(courses),
    {params: httpParams, headers: httpHeaders});
  }

}

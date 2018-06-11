import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { APIConfig } from '../../_config';
import { Course, ContentUnitCount, CourseBasicInfo, Subject } from '../../_models';

/**
 * This is an angular service. This class is responsible for handling Partner Vertical Course Pack related services.
 * Get all, create, update and delete courses. This class will call http request with Http Client Module
 *
 * @export
 * @class CourseManagerService
 * @version 1.0
 * @author
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
    return this.http.get<{ 'course': Course, 'contentUnitCount': ContentUnitCount }[]>(APIConfig.GET_MY_COURSES);
  }

  /**
   * This API is used to call Partner Vertical Delete Course API
   *
   * @param {string} courseId Unique ID of the course to be deleted
   * @returns {Observable<any>}
   */
  deleteCourse(courseId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(APIConfig.DELETE_COURSE,
      'courseId=' + courseId, { headers });
  }

  /**
   * This API will return the Templates of the courses offered by the Platform
   *
   * @returns {Observable<Course[]>}
   */
  getOfferedCourses(): Observable<Course[]> {
    return this.http.post<Course[]>(APIConfig.GET_OFFERED_COURSES, {});
  }

  /**
   * This API is used to create course.
   *
   * @param {{ 'courseName': string, 'description': string, 'courseTemplateId': string }} createCourseData
   * @returns {Observable<Course>} Object of the course created
   */
  createCourse(createCourseData: { 'courseName': string, 'description': string, 'courseTemplateId': string }): Observable<Course> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<Course>(APIConfig.CREATE_COURSE, createCourseData, { headers });
  }

  /**
  * This API is used to call Partner Vertical My Course List API.
  * This API will only return the name of the courses created by the user
  * for Student Marketplace.
  *
  * @return List of Course Names
  */
  getCourseList(): Observable<CourseBasicInfo[]> {
    return this.http.get<CourseBasicInfo[]>(APIConfig.COURSE_LIST);
  }

  /*
   * Returns Course Details of the specified course
   *
   * @param {string} courseId Unique ID of the Course
   * @returns {Observable<{ 'course': Course, 'subjects': Subject[] }>}
   */
  getCourseDetails(courseId: string): Observable<{ 'course': Course, 'subjects': Subject[] }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post<{ 'course': Course, 'subjects': Subject[] }>(APIConfig.GET_COURSE_DETAILS,
      'courseid=' + courseId, { headers });
  }

  /**
   * This API is used to update the Course Details (Title / Description / Objectives)
   *
   * @param {*} updateCourseJson
   * @returns {Observable<any>}
   */
  updateCourseDetail(updateCourseJson: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(APIConfig.UPDATE_COURSE_DETAIL, updateCourseJson, { headers });
  }

  /**
   * This API will call the Publish API.
   *
   * @param {string} courseId  Unique ID of the Course to be published
   * @returns {Observable<any>}
   */
  publishCourse(courseId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(APIConfig.PUBLISH_COURSE, { 'id': courseId }, { headers });
  }

  updateCourseConfig(courseConfig: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(APIConfig.PARNTER_COURSE_CONFIG_UPDATE, JSON.stringify(courseConfig), { headers: headers });
  }
}

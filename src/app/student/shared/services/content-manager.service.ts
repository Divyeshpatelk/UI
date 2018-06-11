import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { APIConfig } from '../../../_config/api-config';
import { Content } from '../../../_models';

/**
 * Student Content Manager Service
 *
 * @export
 * @class ContentManagerService
 */
@Injectable()
export class ContentManagerService {
  /**
   * Creates an instance of ContentManagerService.
   * @param {HttpClient} http HttpClient Instance
   */
  constructor(private http: HttpClient) {}

  /**
   * Get Content Details Mapped on an index
   *
   * @param {string} courseId Unique ID of the Course
   * @param {string} indexId Unique ID of the Index Selected
   * @param {*} contentIds Array Of content IDs
   * @returns {Observable<{ [key: string]: Content[] }>} Array of Content
   */
  getContentDetails(courseId: string, indexId: string, contentIds: any): Observable<{ [key: string]: Content[] }> {
    const bodyParams = {};
    bodyParams[indexId] = contentIds;
    return this.http.post<{ [key: string]: Content[] }>(APIConfig.STUDENT_GET_CONTENT_DETAILS, bodyParams, {
      params: { courseId }
    });
  }

  /**
   * API to get presigned URL for Content (Video & PDF)
   *
   * @param {object} ids Unique IDs of the course, subject, index and content
   * @returns {Observable<string>} Returns the URL as string
   */
  getContentUrl(ids: { courseId: string; subjectId: string; indexId: string; contentId: string }): Observable<string> {
    return this.http.get<string>(APIConfig.STUDENT_GET_CONTENT_URL, { params: ids });
  }
}

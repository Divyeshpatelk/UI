import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { APIConfig } from '../../_config';
import { Content } from '../../_models';

/**
 * This service handles API's related to the Course Content
 *
 * @export
 * @class ContentManagerService
 */
@Injectable()
export class ContentManagerService {
  /**
   * Creates an instance of ContentManagerService.
   * @param {HttpClient} http
   */
  constructor(private http: HttpClient) {}

  /**
   * API to get Content Details
   *
   * @param {any} contentIds IDs of the Content whose details are required
   * @returns {Observable<{ [key: string]: Content[] }>}
   * @memberof ContentManagerService
   */
  getContentDetails(contentIds): Observable<{ [key: string]: Content[] }> {
    // FIXME this should definately be a get request.
    return this.http.post<{ [key: string]: Content[] }>(APIConfig.GET_CONTENT_DETAILS, contentIds);
  }

  /**
   * API to delete Content (Video, PDF, Question, Youtube URL) Mapping from Course Index
   *
   * @param {{
   *       courseId: string,
   *       subjectId: string,
   *       indexId: string,
   *       contentId: string,
   *       contentType: string
   *     }} mapping
   * @returns {Observable<any>}
   */
  deleteContentMapping(mapping: {
    courseId: string;
    subjectId: string;
    indexId: string;
    contentId: string;
    contentType: string;
  }): Observable<any> {
    const params = new HttpParams()
      .set('courseid', mapping.courseId)
      .set('subjectid', mapping.subjectId)
      .set('indexid', mapping.indexId)
      .set('contentid', mapping.contentId)
      .set('contenttype', mapping.contentType);

    return this.http.post<Observable<any>>(APIConfig.DELETE_CONTENT_MAPPING, params);
  }

  /**
   * API to get presigned URL for Content (Video & PDF)
   *
   * @param {object} ids Unique IDs of the course, subject, index and content
   * @returns {Observable<string>} Returns the URL as string
   */
  getContentUrl(ids: { courseId: string; subjectId: string; indexId: string; contentId: string }): Observable<string> {
    return this.http.get<string>(APIConfig.GET_CONTENT_URL, { params: ids });
  }
}

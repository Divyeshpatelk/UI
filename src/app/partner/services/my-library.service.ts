import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { APIConfig } from '../../_config';
import {
  LibraryStudyMaterial,
  Page,
  Sort,
  SearchFilterData,
  QuesSearchFilterData,
  LibraryQuestion,
  Question
} from '../../_models';

/**
 * This is an angular service. This class is responsible for handling Partner Vertical My Library related services.
 * Get-Edit-Delete-Serch-Sort any video-pdf-questions. This class will call http request with Http Client Module.
 *
 * @export
 * @class MyLibraryService
 * @version 1.0
 * @author
 */
@Injectable()
export class MyLibraryService {

  /**
   * Creates an instance of MyLibraryService.
   * @param {HttpClient} http
   */
  constructor(private http: HttpClient) { }

  /**
   * This API will return all the study material content uploaded by the user / partner
   *
   * @param {Page} page
   * @param {Sort} sort
   * @param {SearchFilterData} searchFilterData
   * @returns {Observable<LibraryStudyMaterial>}
   */
  getStudyMaterial(page: Page, sort: Sort, searchFilterData: SearchFilterData): Observable<LibraryStudyMaterial> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<LibraryStudyMaterial>(APIConfig.GET_STUDY_MATERIAL
      + '?page=' + page.number
      + '&size=' + page.size
      + '&sort=' + sort.sortOn + ',' + sort.order, searchFilterData, { headers });
  }

  /**
   * This API is used to delete Study Material Content from My Library page
   *
   * @param {string} contentId Unique ID of the content
   * @returns {Observable<any>}
   */
  deleteStudyMaterial(contentId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(APIConfig.DELETE_STUDY_MATERIAL, { 'contentId': contentId }, { headers });
  }

  /**
   * This API is used to edit Content Title and Description
   *
   * @param {{ 'id': string, 'title': string, 'description': string }} editJson
   * @returns
   */
  updateStudyMaterial(editJson: { '_id': string, 'title': string, 'description': string }) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(APIConfig.UPDATE_STUDY_MATERIAL, editJson, { headers });
  }

  /**
   * This API will return all the questions added by the user / partner
   *
   * @param {Page} page
   * @param {Sort} sort
   * @param {*} quesSearchFilterData
   * @returns {Observable<LibraryQuestion>}
   */
  getQuestions(page: Page, sort: Sort, quesSearchFilterData: any): Observable<LibraryQuestion> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<LibraryQuestion>(APIConfig.GET_QUESTIONS
      + '?page=' + page.number
      + '&size=' + page.size
      + '&sort=' + sort.sortOn + ',' + sort.order, quesSearchFilterData, { headers });
  }

  /**
   * This API is used to delete Question from My Library page
   *
   * @param {string} contentId Unique ID of the content
   * @returns {Observable<any>}
   */
  deleteQuestion(questionId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.delete(`${APIConfig.DELETE_QUESTION}/${questionId}`, { headers });
  }

  /**
   * This API is used to update Question.
   *
   * @param {Question} question Question to be updated
   * @returns {Observable<Question>} Updated Question Objected
   */
  updateQuestion(question: Question): Observable<Question> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    return this.http.post<Question>(APIConfig.UPDATE_QUESTION, question, { headers });
  }
}

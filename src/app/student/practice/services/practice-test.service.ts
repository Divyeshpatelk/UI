import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { APIConfig } from '../../../_config/api-config';
import { PracticeTestData } from '../../../_models';

/**
 * Angular Service to handle Practice Test Related Service API Calls
 *
 * @export
 * @class PracticeTestService
 */
@Injectable()
export class PracticeTestService {

  /**
   * Creates an instance of PracticeTestService.
   * @param {HttpClient} http  HttpClient Instance
   */
  constructor(private http: HttpClient) { }

  generatePracticeTest(practiceTestConfig: any): Observable<PracticeTestData> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<PracticeTestData>(APIConfig.PRACTICE_TEST_GENERATE, practiceTestConfig, { headers });
  }
}

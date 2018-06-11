import { APIConfig } from './../../../_config/api-config';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomTestService {

  constructor(private httpclient: HttpClient) { }

  /**
   *This method returns data to start custom test
   * @param partnerTestId
   */
  takeCustomTest(partnerTestId: string) {
    const headers = new HttpHeaders(
      {'Content-Type': 'application/json'}
    );
    const params = new HttpParams()
    .set('partnerTestId' , partnerTestId);
    return this.httpclient.post(APIConfig.STUDENT_TAKE_CUSTOM_TEST, '', { params : params, headers : headers});
  }

}

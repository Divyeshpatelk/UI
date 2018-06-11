import { Account } from './../../_models/account';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders } from '@angular/common/http';
import { APIConfig } from '../../_config/api-config';

@Injectable()
export class SignupService {
  constructor(private http: HttpClient) { }

  /**
 * API to register a new user on the platform.
 *
 * @param account Account object containing user information
 * like First Name, Last Name email etc.
 */
  signup(account: Account): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(APIConfig.CREATE_ACCOUNT, account, { headers });
  }

  /**
   * API to check if email is already registered or is available for registration
   *
   * @param email Email Address of the user.
   */
  checkEmailAvailability(email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post(APIConfig.ACC_VALIDATE_URL, 'email=' + encodeURIComponent(email), { headers });
  }

}

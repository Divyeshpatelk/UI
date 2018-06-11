import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, SocialUser, FacebookLoginProvider } from 'angular4-social-login';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

import { APIConfig } from '../../_config';
import { User } from '../../_models/user';
import { CustomGoogleLoginProvider } from './custom-google-login-provider';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

/**
 * This is an angular service. This class is responsible for
 *                all the functions for authentication (Login, Logout,
 *                Forgot Password, Set New Password)
 *
 * @export
 * @class AuthenticationService
 * @version 1.0
 * @author
 */
@Injectable()
export class AuthenticationService {
  authToken = 'Basic Y2xpZW50SWQ6';

  /**
   * Store the URL, so we can redirect after logging in
   *
   * @type {string}
   */
  redirectUrl: string;

  _userDetail: BehaviorSubject<any>;

  /**
   * Creates an instance of AuthenticationService.
   *
   * @param {HttpClient} http
   * @param {Router} router
   * @param {NotificationsService} notifyService
   * @param {TranslateService} translator
   */
  constructor(
    private http: HttpClient,
    private router: Router,
    private notifyService: NotificationsService,
    private translator: TranslateService,
    private authService: AuthService
  ) {
    this._userDetail = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('current_user')));
  }

  /**
   * API to call Auth Server Login API. Login API returns Profile Information, refresh token and access token on success.
   * Returns User Information
   *
   * @param {{ 'email': string, 'password': string }} loginData
   * @returns {Observable<User>} User Information
   */
  login(loginData: { email: string; password: string }): Observable<User> {
    const headers = new HttpHeaders({
      Authorization: this.authToken,
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body =
      'username=' +
      encodeURIComponent(loginData.email) +
      '&password=' +
      encodeURIComponent(loginData.password) +
      '&grant_type=password';

    return this.http
      .post(APIConfig.LOGIN, body, { headers })
      .map((response: any) => this._loginSuccess(response))
      .catch((error: any) => this._loginError(error));
  }

  signInWithGoogle(): Observable<User> {
    const signInObservable = Observable.fromPromise(this.authService.signIn(CustomGoogleLoginProvider.PROVIDER_ID));
    return signInObservable.switchMap((user: SocialUser) => {
      const headers = new HttpHeaders({
        Authorization: this.authToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      });

      const body =
        'socialMediaType=' +
        encodeURIComponent(user.provider) +
        '&emailId=' +
        encodeURIComponent(user.email) +
        '&idTokenString=' +
        encodeURIComponent(user.authToken) +
        '&socialAccountId=' +
        encodeURIComponent(user.id);

      return this.http
        .post(APIConfig.SOCIAL_LOGIN, body, { headers })
        .map((response: any) => this._loginSuccess(response))
        .catch((error: any) => this._loginError(error));
    });
  }

  signInWithFB(): Observable<User> {
    const signInObservable = Observable.fromPromise(this.authService.signIn(FacebookLoginProvider.PROVIDER_ID));
    return signInObservable.switchMap((user: SocialUser) => {
      const headers = new HttpHeaders({
        Authorization: this.authToken,
        'Content-Type': 'application/x-www-form-urlencoded'
      });

      if (!user.email) {
        this.notifyService.error(this.translator.instant('FACEBOOK_PERMISSION'), this.translator.instant('SOCIAL_EMAIL_REQUIRED'), {
        clickToClose: false
      });
      this.authService.signOut();
      return null;
    }
      const body =
        'socialMediaType=' +
        encodeURIComponent(user.provider) +
        '&emailId=' +
        encodeURIComponent(user.email) +
        '&idTokenString=' +
        encodeURIComponent(user.authToken) +
        '&socialAccountId=' +
        encodeURIComponent(user.id);

      return this.http
        .post(APIConfig.SOCIAL_LOGIN, body, { headers })
        .map((response: any) => this._loginSuccess(response))
        .catch((error: any) => this._loginError(error));
    });
  }

  _loginSuccess(response) {
    this.setSessionData(response.refresh_token, response.access_token, JSON.stringify(response.account_information));

    // redirect login
    // const redirectUrl = this.redirectUrl ? this.redirectUrl : '/student';
    // const redirectUrl = this.redirectUrl ? this.redirectUrl : '/';
    // this.router.navigate([redirectUrl]);
    // this.redirectUrl = null;

    return response.account_information;
  }

  _loginError(error) {
    switch (error.error.error_description) {
      case 'Invalid username or password':
        this.notifyService.error(this.translator.instant('LOGIN'), this.translator.instant('INVALID_UNAME_OR_PASS'), {
          clickToClose: false
        });
        break;
      case 'Your account is not verified':
        this.notifyService.error(
          this.translator.instant('ACC_NOT_VERIFIED'),
          this.translator.instant('VERIFY_ACC_MESSAGE'),
          {
            clickToClose: false
          }
        );
        break;
      default:
        console.log('other error', error);
    }
    return error;
  }

  /**
   * Private method used to save session parameters
   *
   * @param {string} refreshToken
   * @param {string} accessToken
   * @param {string} currentUser
   */
  setSessionData(refreshToken: string, accessToken: string, currentUser: string) {
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('current_user', currentUser);
    this._userDetail.next(JSON.parse(currentUser));
  }

  /**
   * Private method to clear session parameters on logout / session expiry
   */
  clearSessionData() {
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('course');
    localStorage.removeItem('partner-brandingInfo');
    localStorage.removeItem('customTestResultData');
    localStorage.removeItem('customTestDetail');
    localStorage.removeItem('customTestData');
    this._userDetail.next(null);
  }

  /**
   * Method invoked when on logout.
   *
   * @returns {Observable<any>}
   */
  logout(): Observable<any> {
    return this.http.post(APIConfig.LOGOUT, {}).map(() => {
      this.clearSessionData();
    });
  }

  /**
   * API to call Auth Server ForgotPassword API. An email will be sent to the email address provided by the user in Forgot Password Screen
   * Returns success if email sent successfully else error
   *
   * @param {string} email Email Address of the user
   * @returns {Observable<any>}
   */
  forgotPassword(email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(APIConfig.FORGOT_PASSWORD, 'email=' + encodeURIComponent(email), { headers });
  }

  /**
   * API to call Auth Server ResetPassword API. It will verify token and reset the password.
   * Returns success if everything goes fine else error
   *
   * @param {{ 'email': string, 'password': string, 'token': string }} reqData
   * @returns {Observable<User>}
   */
  resetPassword(reqData: { email: string; password: string; token: string }): Observable<User> {
    return this.http.post<User>(APIConfig.RESET_PASSWORD, reqData);
  }

  /**
   * API to check if refresh token is valid
   *
   * @returns {boolean}
   */
  isLoggedIn(): boolean {
    const token: String = this.getRefreshToken();
    return token && token.length > 0;
  }

  /**
   * API to get the current user token from local storage.
   *
   * @returns {String} Refresh Token
   */
  getRefreshToken(): String {
    const refresh_token = localStorage.getItem('refresh_token');
    return refresh_token != null ? refresh_token : '';
  }

  /**
   * API used to get new access token with the refresh token.
   *
   * @returns {Observable<any>}
   */
  getAccessToken(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.authToken,
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const refresh_token = localStorage.getItem('refresh_token');

    return this.http.post(APIConfig.LOGIN, 'grant_type=refresh_token' + '&refresh_token=' + refresh_token, { headers });
  }

  /**
   * This API is used when user clicks on password reset link. The link is active for 24 hours only. So if user clicks the link
   * after 24 hours, token is invalidated.
   *
   * @param {string} email Email of the user
   * @param {string} token Token passed in the password reset link
   * @returns {Observable<any>}
   */
  isTokenValid(email: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(APIConfig.VALIDATE_TOKEN, 'email=' + encodeURIComponent(email) + '&token=' + token, {
      headers
    });
  }

  /**
   * API to call Auth Server Login API. Change-password API.
   *
   *
   * @param {{ 'oldPassword': string, 'newPassword': string }} loginData
   * @returns {Observable}
   */
  changePassword(changePasswordData: { oldPassword: string; newPassword: string }): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: this.authToken,
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body =
      'newPassword=' +
      encodeURIComponent(changePasswordData.newPassword) +
      '&oldPassword=' +
      encodeURIComponent(changePasswordData.oldPassword);

    return this.http.post(APIConfig.CHANGE_PASSWORD, body, { headers });
  }
}

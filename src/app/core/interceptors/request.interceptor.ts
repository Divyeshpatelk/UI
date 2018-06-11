import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { AuthenticationService } from '../services';
import { APIConfig } from '../../_config';

/**
 * This class implements the HttpIntercpetor interface to add custom auth headers to each request.
 * All Http Requests will routed through this interceptor. Unauthorized Error (401) is also handled.
 *
 * @export
 * @class RequestInterceptor
 * @implements {HttpInterceptor}
 * @version 1.0
 * @author
 */
@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  /**
   * AuthenticationService Instance
   * @private
   * @type {AuthenticationService}
   */
  private authService: AuthenticationService;

  /**
   * Router Instance
   * @private
   * @type {Router}
   */
  private router: Router;

  /**
   * Creates an instance of RequestInterceptor.
   * @param {Injector} injector
   */
  constructor(private injector: Injector) {}

  /**
   * Overriden Method from HttpInterceptor Interface.
   * All http requests (put, post, delete, get) call this method
   *
   * @param {HttpRequest<any>} req Original Http Request
   * @param {HttpHandler} next HttpHandler to which the request needs to be passed on for further processing.
   * @returns {Observable<HttpEvent<any>>}
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const lang = localStorage.getItem('lang') || 'en';
    const token = localStorage.getItem('access_token');
    const pid = localStorage.getItem('pid');
    const headers = { lang };

    if (pid) {
      headers['pid'] = pid;
    }
    let newReq = req.clone({
      setHeaders: headers
    });

    // TODO change this condition and implement route if token exists
    if (req.url.indexOf(APIConfig.LOGIN) === -1 && req.url.indexOf(APIConfig.FORGOT_PASSWORD) === -1) {
      newReq = newReq.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(newReq).catch((error, caught) => {
      if (error.status === 401) {
        // Getting the instance of Authentication Service and Router
        this.authService = this.injector.get(AuthenticationService);
        this.router = this.injector.get(Router);

        /**
         * Check if Access Token is expired, try to get the access token
         * On success -
         * 1. Update the local storage with new access_token
         * 2. Retry original request with new access_token
         */
        if (error.error.error_description.indexOf('Access token expired') !== -1) {
          return this.authService.getAccessToken().switchMap((resp: any) => {
            if (!resp) {
              throw error;
            }

            localStorage.setItem('access_token', resp.access_token);

            // Clone the original request with new access token
            newReq = newReq.clone({
              setHeaders: {
                Authorization: `Bearer ${resp.access_token}`
              }
            });
            return next.handle(newReq);
          });

          // Check if Refresh Token is expired or Access token is invalid, redirect to Login page.
          // TODO: Need to show some intimation to user about the reason being redirected to login page.
        } else if (
          error.error.error_description.indexOf('Invalid refresh token (expired)') !== -1 ||
          error.error.error_description.indexOf('Invalid access token') !== -1
        ) {
          this.authService.clearSessionData();
          this.router.navigate(['/home']);
          return;
        }
      } else {
        return Observable.throw(error);
      }
    }) as any;
  }
}

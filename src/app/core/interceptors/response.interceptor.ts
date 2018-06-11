import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { environment } from '../../../environments/environment';
import { APIConfig } from '../../_config';

/**
 * Interface to map HttpEvent Body to Custom Response
 *
 * @interface ServerResponse
 */
interface ServerResponse {
  /**
   * Variable for Response Code
   * @type {number}
   */
  responseCode: number;

  /**
   * Variable for Response Object
   * @type {*}
   */

  responseObject: any;
  /**
   * Variable for Response Message
   * @type {string}
   */
  responseMessage: string;
}

/**
 * This class is responsible for response handling and error handling. This class implements Angular HttpInterceptor Interface
 *
 * @export
 * @class ResponseInterceptor
 * @implements {HttpInterceptor}
 * @version 1.0
 * @author
 */
export class ResponseInterceptor implements HttpInterceptor {
  /**
   * Overriden Method from HttpInterceptor Interface.
   * All http requests (put, post, delete, get) call this method
   *
   * @param {HttpRequest<any>} req
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   * @memberof ResponseInterceptor
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .map((event: HttpEvent<any>) => {
        // Parse HttpResponse for object mapping and error handling
        if (event instanceof HttpResponse) {
          const response: ServerResponse = event.body;
          // if response contains responseCode key, process and extract responseObject

          if (response.responseCode !== undefined) {
            // if response code is not 0, throw HttpErrorResponse
            // extra check is for succeeding getPartnerId request for subdomains >:(
            if (response.responseCode !== 0 && req.url.indexOf(APIConfig.GET_PID) === -1) {
              throw Observable.throw(
                new HttpErrorResponse({
                  error: event.body,
                  headers: event.headers,
                  status: event.status,
                  statusText: event.statusText,
                  url: event.url
                })
              );
            } else {
              if (response.responseObject) {
                event = event.clone({ body: response.responseObject });
              }
            }
          }
          return event;
        }
      })
      .catch((err: any, caught: Observable<HttpEvent<any>>) => {
        let httpErrorResponse: HttpErrorResponse;
        if (err instanceof HttpErrorResponse) {
          httpErrorResponse = err;
        } else if (err instanceof ErrorObservable && <ErrorObservable>err.error instanceof HttpErrorResponse) {
          httpErrorResponse = err.error;
        }
        this.handleError(httpErrorResponse);
        return Observable.throw(httpErrorResponse);
      });
  }

  /**
   * Method to handle errors.
   * If error.status == 401 - Invalid Token / Expired token,
   *     then try to refresh the access_token with refresh_token
   * else if error.status === 401 - Unauthorized
   *     then send notification to the user.
   * else
   *     send the error to the user.
   *
   * @param err  Error Object
   */
  handleError(err: HttpErrorResponse) {
    switch (err.status) {
      case 401:
        // TODO handle unauthorized notification
        break;

      default:
        if (!environment.production) {
          console.log('Weird REST exception', err);
        }
    }
  }
}

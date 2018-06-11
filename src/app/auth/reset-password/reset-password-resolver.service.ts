import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '../../core/services';

/**
 * Service to resolve the data before Reset Password route gets activated. This resolver will invoke ValidateToken API.
 * If token -> valid, Show reset password screen. Else show error message with Login Page Link
 *
 * @export
 * @class ResetPasswordResolver
 * @implements {Resolve<boolean>}
 * @version 1.0
 * @author
 */
@Injectable()
export class ResetPasswordResolver implements Resolve<boolean> {

  /**
   * Creates an instance of ResetPasswordResolver
   *
   * @param {AuthenticationService} authService AuthenticationService Instance
   */
  constructor(private authService: AuthenticationService) { }

  /**
   * Overridden method of Resolve Interface
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<boolean>}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const email = route.queryParams['email'];
    const token = route.queryParams['token'];
    return this.authService.isTokenValid(email, token).map(response => {
      if (response) {
        return true;

      } else {
        return false;
      }

    }).catch((error: any) => {
      return Observable.of(false);
    });
  }
}

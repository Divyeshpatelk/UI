import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '../services/authentication.service';


/**
 * Guard to activate / deactive Login Page Route
 *
 * @export
 * @class AnonymousGuard
 * @implements {CanActivate}
 * @version 1.0
 * @author
 */
@Injectable()
export class AnonymousGuard implements CanActivate {

  /**
   * Creates an instance of AnonymousGuard.
   * @param {AuthenticationService} authService Authentication Service Instance
   */
  constructor(private authService: AuthenticationService) { }

  /**
   * Overridden method of CanActivate Interface
   *
   * @param {ActivatedRouteSnapshot} next
   * @param {RouterStateSnapshot} state
   * @returns {(Observable<boolean> | Promise<boolean> | boolean)}
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return !this.authService.isLoggedIn();
  }
}

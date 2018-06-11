import { Injectable } from '@angular/core';
import { Router, CanLoad, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '../services/authentication.service';

/**
 * Authentication Guard to activate / deactivate the route.
 * User will be redirected to login page, if not loged in when trying to access any page.
 *
 * @export
 * @class AuthGuard
 * @implements {CanLoad}
 * @implements {CanActivate}
 * @version 1.0
 * @author
 */
@Injectable()
export class AuthGuard implements CanLoad, CanActivate {

  /**
   * Creates an instance of AuthGuard.
   * @param {AuthenticationService} authService AuthenticationService Instance
   * @param {Router} router Router Instance
   */
  constructor(private authService: AuthenticationService, private router: Router) { }

  /**
   * Overridden method of CanLoad Interface.
   *
   * @param {Route} route
   * @returns {(Observable<boolean> | Promise<boolean> | boolean)}
   */
  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    const url = `/${route.path}`;
    return this.checkLogin(url);
  }

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
    const url: string = state.url;
    return this.checkLogin(url);
  }

  /**
   * Private method to check if user is already logged in or not.
   *
   * @param {string} url
   * @returns {boolean}
   */
  checkLogin(url: string): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/home']);
    return false;
  }
}

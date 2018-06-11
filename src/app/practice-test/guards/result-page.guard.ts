import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

/**
 * This CanActivate Guard validates the data in localstorage.
 * If its not there, then it wont allow the user to go to the results page.
 *
 * @export
 * @class ResultPageGuard
 * @implements {CanActivate}
 */
@Injectable()
export class ResultPageGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (JSON.parse(localStorage.getItem('testResultData')) === null) {
      return false;
    }
    return true;
  }
}

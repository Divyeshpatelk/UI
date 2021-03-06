import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../../_const';

@Injectable()
export class RootDomainGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const subdomainMatch = location.hostname.match(Constants.SUBDOMAIN);
    const subdomain = subdomainMatch && subdomainMatch[2];
    const pid = localStorage.getItem('pid');
    if (subdomain && pid) {
      this.router.navigate([`/${subdomain}`]);
      return false;
    }
    return true;
  }
}

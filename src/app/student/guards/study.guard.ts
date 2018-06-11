import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class StudyGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const obj = JSON.parse(localStorage.getItem('course'));
    if (obj && obj.studyEnable) {
      return true;
    } else {
      this.router.navigate(['/student', 'courses']);
      return false;
    }
  }
}

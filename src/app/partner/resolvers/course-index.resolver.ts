import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { CourseManagerService } from '../services/';
import { Course, Subject } from '../../_models';

@Injectable()
export class CourseIndexResolver implements Resolve<Observable<any>> {
  /**
   * Creates an instance of CourseIndexResolver.
   * @param {CourseManagerService} courseManager
   */
  constructor(
    private courseManager: CourseManagerService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<{ 'course': Course, 'subjects': Subject[] }> {

    const courseId: string = route.paramMap.get('id');
    return this.courseManager.getCourseDetails(courseId);
  }
}

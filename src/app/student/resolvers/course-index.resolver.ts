import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { CourseManagerService, CourseSelectorService } from '../shared/services';
import { Course, Subject, BrandingInfo } from '../../_models';

@Injectable()
export class CourseIndexResolver implements Resolve<Observable<any>> {
  /**
   * Creates an instance of CourseIndexResolver.
   * @param {CourseManagerService} courseManager
   */
  constructor(private courseSelector: CourseSelectorService, private courseManager: CourseManagerService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{ course: Course; subjects: Subject[] }> {
    const courseId: string = route.paramMap.get('id') || route.params['courseId'];
    return this.courseManager
      .getCourseDetails(courseId)
      .do((data: { course: Course; subjects: Subject[]; brandinginfo: BrandingInfo }) => {
        this.courseSelector.selectCourse(data.course);
        this.courseSelector.selectBrandingLogo(data.brandinginfo);
      });
  }
}

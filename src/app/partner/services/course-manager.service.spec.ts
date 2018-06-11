/**
 * Unit test class for Course Manager Service
 *
 * @version: 1.0
 * @author:
 */
import { TestBed, inject } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { CourseManagerService } from './course-manager.service';

import { MockInterceptor } from '../../_helpers';

describe('CourseManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [CourseManagerService, {
        provide: HTTP_INTERCEPTORS,
        useClass: MockInterceptor,
        multi: true
      }]
    });
  });

  it('should be created', inject([CourseManagerService], (_service: CourseManagerService) => {
    expect(_service).toBeTruthy();
  }));
});

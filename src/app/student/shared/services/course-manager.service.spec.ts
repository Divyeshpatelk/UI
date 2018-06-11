import { TestBed, inject } from '@angular/core/testing';

import { CourseManagerService } from './course-manager.service';

describe('CourseManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseManagerService]
    });
  });

  it('should be created', inject([CourseManagerService], (service: CourseManagerService) => {
    expect(service).toBeTruthy();
  }));
});

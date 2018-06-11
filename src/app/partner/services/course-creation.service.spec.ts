import { TestBed, inject } from '@angular/core/testing';

import { CourseCreationService } from './course-creation.service';

describe('CourseCreationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseCreationService]
    });
  });

  it('should be created', inject([CourseCreationService], (service: CourseCreationService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { CourseIndexCreatorService } from './course-index-creator.service';

describe('CourseIndexCreatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseIndexCreatorService]
    });
  });

  it('should be created', inject([CourseIndexCreatorService], (service: CourseIndexCreatorService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { CourseSelectorService } from './course-selector.service';

describe('CourseSelectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseSelectorService]
    });
  });

  it('should be created', inject([CourseSelectorService], (service: CourseSelectorService) => {
    expect(service).toBeTruthy();
  }));
});

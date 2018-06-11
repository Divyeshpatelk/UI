import { TestBed, inject } from '@angular/core/testing';

import { PracticeTestService } from './practice-test.service';

describe('PracticeTestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PracticeTestService]
    });
  });

  it('should be created', inject([PracticeTestService], (service: PracticeTestService) => {
    expect(service).toBeTruthy();
  }));
});

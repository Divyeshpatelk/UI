import { TestBed, inject } from '@angular/core/testing';

import { PracticeTestHelperService } from './practice-test-helper.service';

describe('PracticeTestHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PracticeTestHelperService]
    });
  });

  it('should be created', inject([PracticeTestHelperService], (service: PracticeTestHelperService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { TestHistoryService } from './test-history.service';

describe('TestHistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestHistoryService]
    });
  });

  it('should be created', inject([TestHistoryService], (service: TestHistoryService) => {
    expect(service).toBeTruthy();
  }));
});

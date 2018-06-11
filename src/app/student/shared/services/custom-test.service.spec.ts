import { TestBed, inject } from '@angular/core/testing';

import { CustomTestService } from './custom-test.service';

describe('CustomTestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomTestService]
    });
  });

  it('should be created', inject([CustomTestService], (service: CustomTestService) => {
    expect(service).toBeTruthy();
  }));
});

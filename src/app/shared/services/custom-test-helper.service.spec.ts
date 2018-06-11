import { TestBed, inject } from '@angular/core/testing';

import { CustomTestHelperService } from './custom-test-helper.service';

describe('CustomTestHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomTestHelperService]
    });
  });

  it('should be created', inject([CustomTestHelperService], (service: CustomTestHelperService) => {
    expect(service).toBeTruthy();
  }));
});

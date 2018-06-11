import { TestBed, inject } from '@angular/core/testing';

import { CustomTestGeneratorService } from './custom-test-generator.service';

describe('CustomTestGeneratorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomTestGeneratorService]
    });
  });

  it('should be created', inject([CustomTestGeneratorService], (service: CustomTestGeneratorService) => {
    expect(service).toBeTruthy();
  }));
});

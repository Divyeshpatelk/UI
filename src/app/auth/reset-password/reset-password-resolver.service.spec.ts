import { TestBed, inject } from '@angular/core/testing';

import { ResetPasswordResolver } from './reset-password-resolver.service';

describe('ResetPasswordResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResetPasswordResolver]
    });
  });

  it('should be created', inject([ResetPasswordResolver], (service: ResetPasswordResolver) => {
    expect(service).toBeTruthy();
  }));
});

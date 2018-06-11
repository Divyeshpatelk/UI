import { TestBed, async, inject } from '@angular/core/testing';

import { RootDomainGuard } from './root-domain.guard';

describe('RootDomainGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RootDomainGuard]
    });
  });

  it('should ...', inject([RootDomainGuard], (guard: RootDomainGuard) => {
    expect(guard).toBeTruthy();
  }));
});

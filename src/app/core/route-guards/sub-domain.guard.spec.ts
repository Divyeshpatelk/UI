import { TestBed, async, inject } from '@angular/core/testing';

import { SubDomainGuard } from './sub-domain.guard';

describe('SubDomainGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubDomainGuard]
    });
  });

  it('should ...', inject([SubDomainGuard], (guard: SubDomainGuard) => {
    expect(guard).toBeTruthy();
  }));
});

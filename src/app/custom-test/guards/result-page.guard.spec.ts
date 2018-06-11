import { TestBed, async, inject } from '@angular/core/testing';

import { ResultPageGuard } from './result-page.guard';

describe('ResultPageGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResultPageGuard]
    });
  });

  it('should ...', inject([ResultPageGuard], (guard: ResultPageGuard) => {
    expect(guard).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { RequestInterceptor } from './request.interceptor';

describe('RequestInterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestInterceptor]
    });
  });

  it('should be created', inject([RequestInterceptor], (service: RequestInterceptor) => {
    expect(service).toBeTruthy();
  }));
});

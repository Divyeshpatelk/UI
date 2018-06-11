import { TestBed, inject } from '@angular/core/testing';

import { ContentManagerService } from './content-manager.service';

describe('ContentManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentManagerService]
    });
  });

  it('should be created', inject([ContentManagerService], (service: ContentManagerService) => {
    expect(service).toBeTruthy();
  }));
});

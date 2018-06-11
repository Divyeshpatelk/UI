import { TestBed, inject } from '@angular/core/testing';

import { UploadContentService } from './upload-content.service';

describe('UploadContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UploadContentService]
    });
  });

  it('should be created', inject([UploadContentService], (service: UploadContentService) => {
    expect(service).toBeTruthy();
  }));
});

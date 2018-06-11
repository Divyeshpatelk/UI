import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadContentPreviewComponent } from './upload-content-preview.component';
import {YoutubeService} from '../../../../services/youtube.service';

describe('UploadContentPreviewComponent', () => {
  let component: UploadContentPreviewComponent;
  let fixture: ComponentFixture<UploadContentPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadContentPreviewComponent ],
      providers:    [ YoutubeService ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadContentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

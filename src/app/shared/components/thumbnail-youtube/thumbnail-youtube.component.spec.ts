import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailYoutubeComponent } from './thumbnail-youtube.component';

describe('ThumbnailYoutubeComponent', () => {
  let component: ThumbnailYoutubeComponent;
  let fixture: ComponentFixture<ThumbnailYoutubeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThumbnailYoutubeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbnailYoutubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

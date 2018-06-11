import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbnailVideoComponent } from './thumbnail-video.component';

describe('ThumbnailVideoComponent', () => {
  let component: ThumbnailVideoComponent;
  let fixture: ComponentFixture<ThumbnailVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThumbnailVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbnailVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

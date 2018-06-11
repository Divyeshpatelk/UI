import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyIndexContentViewerComponent } from './study-index-content-viewer.component';

describe('StudyIndexContentViewerComponent', () => {
  let component: StudyIndexContentViewerComponent;
  let fixture: ComponentFixture<StudyIndexContentViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyIndexContentViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyIndexContentViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

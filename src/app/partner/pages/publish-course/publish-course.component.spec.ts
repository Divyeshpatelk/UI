import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishCourseComponent } from './publish-course.component';

describe('PublishCourseComponent', () => {
  let component: PublishCourseComponent;
  let fixture: ComponentFixture<PublishCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseTestTabComponent } from './course-test-tab.component';

describe('CourseTestTabComponent', () => {
  let component: CourseTestTabComponent;
  let fixture: ComponentFixture<CourseTestTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseTestTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseTestTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

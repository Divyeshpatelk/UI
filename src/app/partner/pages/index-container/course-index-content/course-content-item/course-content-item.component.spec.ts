import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseContentItemComponent } from './course-content-item.component';

describe('CourseContentItemComponent', () => {
  let component: CourseContentItemComponent;
  let fixture: ComponentFixture<CourseContentItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseContentItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseContentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

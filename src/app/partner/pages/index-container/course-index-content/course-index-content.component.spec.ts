import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseIndexContentComponent } from './course-index-content.component';

describe('CourseIndexContentComponent', () => {
  let component: CourseIndexContentComponent;
  let fixture: ComponentFixture<CourseIndexContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseIndexContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseIndexContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

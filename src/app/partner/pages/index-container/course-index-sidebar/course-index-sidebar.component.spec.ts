import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseIndexSidebarComponent } from './course-index-sidebar.component';

describe('CourseIndexSidebarComponent', () => {
  let component: CourseIndexSidebarComponent;
  let fixture: ComponentFixture<CourseIndexSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseIndexSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseIndexSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

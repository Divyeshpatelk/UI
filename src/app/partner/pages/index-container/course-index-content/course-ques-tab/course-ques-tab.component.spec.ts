import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseQuesTabComponent } from './course-ques-tab.component';

describe('CourseQuesTabComponent', () => {
  let component: CourseQuesTabComponent;
  let fixture: ComponentFixture<CourseQuesTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseQuesTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseQuesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

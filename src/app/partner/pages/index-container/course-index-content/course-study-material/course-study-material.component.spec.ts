import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseStudyMaterialComponent } from './course-study-material.component';

describe('CourseStudyMaterialComponent', () => {
  let component: CourseStudyMaterialComponent;
  let fixture: ComponentFixture<CourseStudyMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseStudyMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseStudyMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

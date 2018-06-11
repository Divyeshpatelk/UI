import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyCourseContentItemComponent } from './study-course-content-item.component';

describe('StudyCourseContentItemComponent', () => {
  let component: StudyCourseContentItemComponent;
  let fixture: ComponentFixture<StudyCourseContentItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyCourseContentItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyCourseContentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

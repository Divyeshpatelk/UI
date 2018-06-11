import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyIndexSidebarComponent } from './study-index-sidebar.component';

describe('StudyIndexSidebarComponent', () => {
  let component: StudyIndexSidebarComponent;
  let fixture: ComponentFixture<StudyIndexSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyIndexSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyIndexSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

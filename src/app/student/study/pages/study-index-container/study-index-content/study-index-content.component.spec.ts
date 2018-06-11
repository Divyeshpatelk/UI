import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyIndexContentComponent } from './study-index-content.component';

describe('StudyIndexContentComponent', () => {
  let component: StudyIndexContentComponent;
  let fixture: ComponentFixture<StudyIndexContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyIndexContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyIndexContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

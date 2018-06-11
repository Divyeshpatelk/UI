import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyIndexContainerComponent } from './study-index-container.component';

describe('StudyIndexContainerComponent', () => {
  let component: StudyIndexContainerComponent;
  let fixture: ComponentFixture<StudyIndexContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyIndexContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyIndexContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

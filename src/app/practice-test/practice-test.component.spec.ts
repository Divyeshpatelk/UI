import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeTestComponent } from './practice-test.component';

describe('PracticeTestComponent', () => {
  let component: PracticeTestComponent;
  let fixture: ComponentFixture<PracticeTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

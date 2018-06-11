import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestResultCustomMsgComponent } from './test-result-custom-msg.component';

describe('TestResultCustomMsgComponent', () => {
  let component: TestResultCustomMsgComponent;
  let fixture: ComponentFixture<TestResultCustomMsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestResultCustomMsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestResultCustomMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

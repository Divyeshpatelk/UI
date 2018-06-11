import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTopbarComponent } from './test-topbar.component';

describe('TestTopbarComponent', () => {
  let component: TestTopbarComponent;
  let fixture: ComponentFixture<TestTopbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestTopbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

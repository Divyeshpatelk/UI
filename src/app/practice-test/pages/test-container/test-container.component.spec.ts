import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestContainerComponent } from './test-container.component';

describe('TestContainerComponent', () => {
  let component: TestContainerComponent;
  let fixture: ComponentFixture<TestContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

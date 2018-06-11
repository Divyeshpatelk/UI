import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTestResultContainerComponent } from './custom-test-result-container.component';

describe('CustomTestResultContainerComponent', () => {
  let component: CustomTestResultContainerComponent;
  let fixture: ComponentFixture<CustomTestResultContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTestResultContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTestResultContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTestContainerComponent } from './custom-test-container.component';

describe('CustomTestContainerComponent', () => {
  let component: CustomTestContainerComponent;
  let fixture: ComponentFixture<CustomTestContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTestContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTestContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

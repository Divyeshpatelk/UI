import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTestComponent } from './custom-test.component';

describe('CustomTestComponent', () => {
  let component: CustomTestComponent;
  let fixture: ComponentFixture<CustomTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

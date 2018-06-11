import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTestTopbarComponent } from './custom-test-topbar.component';

describe('TestTopbarComponent', () => {
  let component: CustomTestTopbarComponent;
  let fixture: ComponentFixture<CustomTestTopbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTestTopbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTestTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

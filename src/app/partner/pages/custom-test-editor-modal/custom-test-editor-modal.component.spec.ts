import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTestEditorModalComponent } from './custom-test-editor-modal.component';

describe('CustomTestEditorModalComponent', () => {
  let component: CustomTestEditorModalComponent;
  let fixture: ComponentFixture<CustomTestEditorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTestEditorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTestEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

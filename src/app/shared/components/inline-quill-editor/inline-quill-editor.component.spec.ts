import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineQuillEditorComponent } from './inline-quill-editor.component';

describe('InlineQuillEditorComponent', () => {
  let component: InlineQuillEditorComponent;
  let fixture: ComponentFixture<InlineQuillEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineQuillEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineQuillEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

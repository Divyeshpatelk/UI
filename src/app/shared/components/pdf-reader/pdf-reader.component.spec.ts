import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfReaderComponent } from './pdf-reader.component';

describe('PdfReaderComponent', () => {
  let component: PdfReaderComponent;
  let fixture: ComponentFixture<PdfReaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfReaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

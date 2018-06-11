import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvUploadQuestionComponent } from './csv-upload-question.component';

describe('CsvUploadQuestionComponent', () => {
  let component: CsvUploadQuestionComponent;
  let fixture: ComponentFixture<CsvUploadQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvUploadQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvUploadQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

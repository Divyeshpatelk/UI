import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyMaterialEditComponent } from './study-material-edit.component';

describe('StudyMaterialEditComponent', () => {
  let component: StudyMaterialEditComponent;
  let fixture: ComponentFixture<StudyMaterialEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyMaterialEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyMaterialEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

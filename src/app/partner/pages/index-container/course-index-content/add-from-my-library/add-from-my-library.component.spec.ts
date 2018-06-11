import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFromMyLibraryComponent } from './add-from-my-library.component';

describe('AddFromMyLibraryComponent', () => {
  let component: AddFromMyLibraryComponent;
  let fixture: ComponentFixture<AddFromMyLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFromMyLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFromMyLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

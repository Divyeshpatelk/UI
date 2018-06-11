import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BosonComponent } from './boson.component';

describe('BosonComponent', () => {
  let component: BosonComponent;
  let fixture: ComponentFixture<BosonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BosonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BosonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

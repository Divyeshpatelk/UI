import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JamnadasComponent } from './jamnadas.component';

describe('JamnadasComponent', () => {
  let component: JamnadasComponent;
  let fixture: ComponentFixture<JamnadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JamnadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JamnadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

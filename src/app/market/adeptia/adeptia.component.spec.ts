import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdeptiaComponent } from './adeptia.component';

describe('AdeptiaComponent', () => {
  let component: AdeptiaComponent;
  let fixture: ComponentFixture<AdeptiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdeptiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdeptiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

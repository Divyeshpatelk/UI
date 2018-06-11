import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuesItemComponent } from './ques-item.component';

describe('QuesItemComponent', () => {
  let component: QuesItemComponent;
  let fixture: ComponentFixture<QuesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

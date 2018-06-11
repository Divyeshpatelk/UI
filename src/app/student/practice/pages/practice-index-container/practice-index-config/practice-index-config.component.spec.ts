import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeIndexConfigComponent } from './practice-index-config.component';

describe('PracticeIndexConfigComponent', () => {
  let component: PracticeIndexConfigComponent;
  let fixture: ComponentFixture<PracticeIndexConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeIndexConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeIndexConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeIndexContainerComponent } from './practice-index-container.component';

describe('PracticeIndexContainerComponent', () => {
  let component: PracticeIndexContainerComponent;
  let fixture: ComponentFixture<PracticeIndexContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeIndexContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeIndexContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

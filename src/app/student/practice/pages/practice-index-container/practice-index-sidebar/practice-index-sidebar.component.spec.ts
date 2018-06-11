import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeIndexSidebarComponent } from './practice-index-sidebar.component';

describe('PracticeIndexSidebarComponent', () => {
  let component: PracticeIndexSidebarComponent;
  let fixture: ComponentFixture<PracticeIndexSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeIndexSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeIndexSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

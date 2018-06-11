import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeSidebarItemComponent } from './practice-sidebar-item.component';

describe('PracticeSidebarItemComponent', () => {
  let component: PracticeSidebarItemComponent;
  let fixture: ComponentFixture<PracticeSidebarItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeSidebarItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeSidebarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

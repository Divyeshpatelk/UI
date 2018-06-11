import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudySidebarItemComponent } from './study-sidebar-item.component';

describe('StudySidebarItemComponent', () => {
  let component: StudySidebarItemComponent;
  let fixture: ComponentFixture<StudySidebarItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudySidebarItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudySidebarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

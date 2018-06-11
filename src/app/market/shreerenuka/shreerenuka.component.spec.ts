import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShreerenukaComponent } from './shreerenuka.component';

describe('ShreerenukaComponent', () => {
  let component: ShreerenukaComponent;
  let fixture: ComponentFixture<ShreerenukaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShreerenukaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShreerenukaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponRedemptionModalComponent } from './coupon-redemption-modal.component';

describe('CouponRedemptionModalComponent', () => {
  let component: CouponRedemptionModalComponent;
  let fixture: ComponentFixture<CouponRedemptionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponRedemptionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponRedemptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

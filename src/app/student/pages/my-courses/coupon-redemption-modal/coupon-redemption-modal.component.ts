import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

import { CourseManagerService } from '../../../shared/services/course-manager.service';

/**
 * Component Class for Coupon Redeemption Modal
 *
 * @export
 * @class CouponRedemptionModalComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'pdg-coupon-redemption-modal',
  templateUrl: './coupon-redemption-modal.component.html',
  styleUrls: ['./coupon-redemption-modal.component.scss']
})
export class CouponRedemptionModalComponent implements OnInit {
  /**
   * CouponCode Form Instance
   * @type {FormGroup}
   */
  couponCodeForm: FormGroup;

  /**
   * Creates an instance of CouponRedemptionModalComponent.
   * @param {FormBuilder} formBuilder
   * @param {NgbActiveModal} activeModal
   * @param {CourseManagerService} courseManager
   * @param {NotificationsService} notification
   * @param {TranslateService} translator
   */
  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private courseManager: CourseManagerService,
    private notification: NotificationsService,
    private translator: TranslateService
  ) {}

  /**
   * Overridden Method invoked when component is loaded
   */
  ngOnInit() {
    this.couponCodeForm = this.formBuilder.group({
      couponCode: ['', Validators.required]
    });
  }

  /**
   * Method invoked on click of submit button of coupon code Modal
   *
   * @param {{ 'couponCode': string }} value Coupon code string entered by user
   */
  redeemCouponCode(value: { couponCode: string }) {
    this.courseManager.redeemCouponCode(value.couponCode).subscribe(
      (data) => {
        // Show success notification
        this.notification.success(
          this.translator.instant('COUPON_APPLIED')
          // ,          `${this.translator.instant('COUPON_CODE')} : ${value.couponCode}`
        );
        this.activeModal.close();
      },
      (error: HttpErrorResponse) => {
        // Show error notification
        const errorMessage = error.error.responseMessage;
        this.notification.error(this.translator.instant('COUPON_ERROR'), errorMessage, {
          clickToClose: false
        });
      }
    );
  }
}

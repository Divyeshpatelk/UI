import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../shared/components';
import { TranslateService } from '@ngx-translate/core';
import { LoginModalComponent } from '../../auth/login-modal/login-modal.component';
import { AuthenticationService, PaymentService } from '../../core/services';
import { MarketService } from '../market.service';
import { NotificationsService } from 'angular2-notifications';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'pdg-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit {
  @Input() course;
  @Input() isPurchased = false;

  @Input() cardindex: number;
  @Input() tipMode: number;
  @Input() enableToolTip: boolean;

  @Output() courseAdded: EventEmitter<any> = new EventEmitter();
  @ViewChild('tooltip') contactSection: ElementRef;
  cardTooltip = false;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private translator: TranslateService,
    private authService: AuthenticationService,
    private marketService: MarketService,
    private notification: NotificationsService,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {}

  openCourse() {
    if (this.isPurchased) {
      this.redirecctToCourse();
    } else if (!this.authService.isLoggedIn()) {
      this.showLogin();
    }
  }

  redirecctToCourse() {
    const courseId = this.course.id;
    this.router.navigateByUrl('/student/dashboard/' + courseId);
  }

  /**
   * Method invoked on Logout button click.
   */
  showLogin() {
    const modalRef = this.modalService.open(LoginModalComponent);
    modalRef.result.then(
      (result) => {
        location.reload();
      },
      (reason) => {
        // todo on cancel
      }
    );
  }

  initAddCourse(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.authService.isLoggedIn()) {
      this.showLogin();
      return;
    }

    if (this.course.price) {
      this.paymentService
        // .init(['5ab8d6e276d8ce7a36a14a34'])
        .init([this.course.id])
        .subscribe((success) => location.reload());
    } else if (this.course.couponCode) {
      this.marketService.redeemCouponCode(this.course.couponCode).subscribe(
        (data) => {
          // Show success notification
          this.notification.success(this.translator.instant('COURSE_SUBSCRIBED'));
          this.courseAdded.emit(true);
        },
        (error: HttpErrorResponse) => {
          // Show error notification
          const errorMessage = error.error.responseMessage;
          this.notification.error(this.translator.instant('COUPON_ERROR'), errorMessage, {
            clickToClose: false
          });
          this.courseAdded.emit(false);
        }
      );
    }
  }
  mouseEnter() {
    this.cardTooltip = true;
  }
  mouseLeave() {
    this.cardTooltip = false;
  }
}

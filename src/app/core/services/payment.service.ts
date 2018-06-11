import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Razorpay } from './razorpay-checkout';
import { AuthenticationService } from './authentication.service';
import { SpinnerService } from './spinner.service';
import { APIConfig } from '../../_config';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class PaymentService {
  constructor(
    private http: HttpClient,
    private spinnerService: SpinnerService,
    private authService: AuthenticationService,
    private notification: NotificationsService,
    private translator: TranslateService
  ) {}

  /*
  * It generates order_id for init razorpay payment flow
  *
  */
  init(courseIds: Array<string>): Observable<any> {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    this.spinnerService.show();
    return this.http
      .post(APIConfig.PAYMENT_CREATE_ORDER, courseIds, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      })
      .switchMap((data: any) => {
        this.spinnerService.hide();
        const description = courseIds.length + ' course(s)';
        return this.openUI({ order_id: data.orderid, description });
      })
      .do(
        null,
        (error) => {
          this.spinnerService.hide();
          this.notification.error(this.translator.instant('ERROR1'));
        },
        () => {
          this.spinnerService.hide();
        }
      );
  }

  /*
  * open razorpay UI
  */
  openUI(options: { order_id; description }): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      const user = JSON.parse(localStorage.getItem('current_user'));

      const defaultOptions: any = {
        key: environment.razorpayKey,
        name: 'Pedagogy',
        // 'image': '/your_logo.png',
        prefill: {
          name: user.firstname,
          contact: user.mobilenumber,
          email: user.email
        },
        theme: {
          color: '#F37254'
        },
        handler: function(response) {
          observer.next(response);
        }
      };

      defaultOptions.description = options.description;
      defaultOptions.order_id = options.order_id;
      const rzp = Razorpay(defaultOptions);
      rzp.open();
    }).switchMap((response) => {
      return this.confirmPayment(response.razorpay_payment_id, options.order_id);
    });
  }

  /*
  * capture or confirm payment
  */
  confirmPayment(razorpay_payment_id, order_id): Observable<any> {
    this.spinnerService.show();
    return this.http
      .post(
        APIConfig.PAYMENT_PAY_ORDER,
        new HttpParams().set('paymentId', razorpay_payment_id).set('orderId', order_id),
        { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) }
      )
      .do(
        (data) => {
          this.spinnerService.hide();
        },
        (error) => {
          this.spinnerService.hide();
          this.notification.error(this.translator.instant('ERROR1'));
        },
        () => {
          this.spinnerService.hide();
        }
      );
  }
}

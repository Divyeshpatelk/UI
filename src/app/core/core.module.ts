import { environment } from '../../environments/environment';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SharedModule } from '../shared/shared.module';
import { AuthenticationService, SpinnerService, PaymentService } from './services';
import { SignupService } from './../auth/signup/signup.service';
import { RequestInterceptor, ResponseInterceptor } from './interceptors';

import { ForgotPasswordComponent, ResetPasswordResolver } from '../auth';
import { AnonymousGuard, AuthGuard, CanDeactivateGuard, RootDomainGuard, SubDomainGuard } from './route-guards';

// Http Loader Factory for Internationalization
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `/assets/i18n/`, '.json');
}

@NgModule({
  imports: [
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [],
  providers: [
    AuthenticationService,
    SignupService,
    ResetPasswordResolver,
    AnonymousGuard,
    AuthGuard,
    CanDeactivateGuard,
    SpinnerService,
    PaymentService,
    RootDomainGuard,
    SubDomainGuard
  ],
  exports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class CoreModule {}

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpClient,
  HttpClientJsonpModule,
  HttpParams
} from '@angular/common/http';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateStore } from '@ngx-translate/core/src/translate.store';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpClientModule } from '@ngx-progressbar/http-client';
import { NgProgressRouterModule } from '@ngx-progressbar/router';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { SocialLoginModule, AuthServiceConfig, FacebookLoginProvider } from 'angular4-social-login';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';

import { environment } from '../environments/environment';

import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { RequestInterceptor, ResponseInterceptor } from './core/interceptors';
import { AppComponent } from './app.component';

import { LoginComponent, ForgotPasswordComponent, ResetPasswordComponent } from './auth';
import { DateParserFormatter } from './shared/services/dateParserFormatter.service';
import { PracticeTestHelperService, CustomTestHelperService, TimerService } from './shared/services';
import { SignupComponent } from './auth/signup/signup.component';
import { CustomGoogleLoginProvider } from './core/services/custom-google-login-provider';
import { MarketModule } from './market/market.module';
import { APIConfig } from './_config';



// Http Loader Factory for Internationalization
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

export function initWhiteWash(http: HttpClient) {
  return () =>
    http
      .get(APIConfig.GET_PID, { params: new HttpParams().set('subDomain', location.hostname) })
      .do(
        (pid: any) =>
          pid && typeof pid === 'number' ? localStorage.setItem('pid', `${pid}`) : localStorage.removeItem('pid')
      )
      .toPromise();
}

const providers = [
  { provide: APP_INITIALIZER, useFactory: initWhiteWash, deps: [HttpClient], multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
  { provide: AuthServiceConfig, useFactory: provideConfig },
  PracticeTestHelperService,
  CustomTestHelperService,
  TimerService
];

const config = new AuthServiceConfig([
  {
    id: CustomGoogleLoginProvider.PROVIDER_ID,
    provider: new CustomGoogleLoginProvider('762131559784-lqspkk2qr1o2v0pqoc3em0vqvh5cnkk7.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.fbAppKey)
  }
]);

export function provideConfig() {
  return config;
}

/**
 * Root Module for the application.
 *
 * @export
 * @class AppModule
 */
@NgModule({
  declarations: [AppComponent, LoginComponent, ForgotPasswordComponent, ResetPasswordComponent, SignupComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    SharedModule,
    AppRoutingModule,
    CoreModule,
    NgProgressHttpClientModule,
    NgProgressRouterModule,
    SocialLoginModule,
    NgProgressModule.forRoot(),
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SimpleNotificationsModule.forRoot(),
    Angulartics2Module.forRoot([Angulartics2GoogleTagManager]),
    MarketModule
  ],
  providers: providers,
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
  entryComponents: [ForgotPasswordComponent]
})
export class AppModule {}

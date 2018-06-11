import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxCarouselModule } from 'ngx-carousel';
import { SharedModule } from '../shared/shared.module';

import { HomeComponent } from './home/home.component';
import { LoginModalComponent } from '../auth/login-modal/login-modal.component';
import { TopbarComponent } from './topbar/topbar.component';
import { MobileBannerComponent } from './mobile-banner/mobile-banner.component';
import { InfoBoxComponent } from './info-box/info-box.component';
import { FooterComponent } from './footer/footer.component';
import { CourseCardComponent } from './course-card/course-card.component';
import { JamnadasComponent } from './jamnadas/jamnadas.component';
import { MarketService } from './market.service';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { AdeptiaComponent } from './adeptia/adeptia.component';
import { CouponRedemptionModalComponent } from '../student/pages';
import { StudentModule } from '../student/student.module';
import { BosonComponent } from './boson/boson.component';
import { SmithComponent } from './smith/smith.component';
import { CubeComponent } from './cube/cube.component';
import { ShreerenukaComponent } from './shreerenuka/shreerenuka.component';

/**
 * Http Loader Factory for Internationalization
 *
 * @export
 * @param {HttpClient} http HttpClient Instance
 * @returns TranslateLoaderFactory Instance
 */
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `/assets/i18n/`, '.json');
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    StudentModule,
    NgxCarouselModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    HomeComponent,
    LoginModalComponent,
    TopbarComponent,
    MobileBannerComponent,
    InfoBoxComponent,
    FooterComponent,
    CourseCardComponent,
    JamnadasComponent,
    PrivacyPolicyComponent,
    TermsConditionComponent,
    AboutUsComponent,
    AdeptiaComponent,
    BosonComponent,
    SmithComponent,
    CubeComponent,
    ShreerenukaComponent
  ],
  providers: [MarketService],
  entryComponents: [LoginModalComponent, CouponRedemptionModalComponent]
})
export class MarketModule {}

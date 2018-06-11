import { CustomTestModule } from './../custom-test/custom-test.module';
import { TestResultCustomMsgComponent } from './../custom-test/pages/test-result-custom-msg/test-result-custom-msg.component';
import { environment } from '../../environments/environment';

import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SharedModule } from '../shared/shared.module';
import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';
import { MyCoursesComponent, CouponRedemptionModalComponent } from './pages';
import { TopBarComponent, BreadcrumbBarComponent, CourseItemComponent } from './shared/components';
import { CourseSelectorService, CourseManagerService, ContentManagerService } from './shared/services/';
import { UserTopbarComponent } from './shared/components/user-topbar/user-topbar.component';
import { ChangePasswordComponent } from './shared/components/change-password/change-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TableModule } from 'primeng/table';
import { TestHistoryService } from './shared/services/test-history.service';
import { CustomTestService } from './shared/services/custom-test.service';
import { CourseIndexResolver } from './resolvers';

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
    SharedModule,
    CustomTestModule,
    NgbModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    StudentRoutingModule,
    TableModule
  ],
  declarations: [
    StudentComponent,
    MyCoursesComponent,
    TopBarComponent,
    BreadcrumbBarComponent,
    CourseItemComponent,
    CouponRedemptionModalComponent,
    UserTopbarComponent,
    ChangePasswordComponent,
    DashboardComponent
  ],
  providers: [
    CourseManagerService,
    ContentManagerService,
    CourseSelectorService,
    TestHistoryService,
    CustomTestService,
    CourseIndexResolver
  ],
  entryComponents: [CouponRedemptionModalComponent, ChangePasswordComponent, TestResultCustomMsgComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class StudentModule {}

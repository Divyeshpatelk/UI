import { TestHistoryService } from './../student/shared/services/test-history.service';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SharedModule } from '../shared/shared.module';
import { CustomTestComponent } from './custom-test.component';
import { CustomTestRoutingModule } from './custom-test-routing.module';

import { CustomTestContainerComponent, QuestionComponent, QuestionNavComponent, CustomTestResultContainerComponent } from './pages';
import { CustomTestTopbarComponent } from './shared/components/test-topbar/custom-test-topbar.component';
import { ResultPageGuard, TestGuard } from './guards';
import { TestResultCustomMsgComponent } from './pages/test-result-custom-msg/test-result-custom-msg.component';

/**
 * Http Loader Factory for Internationalization
 *
 * @export
 * @param {HttpClient} http HttpClient Instance
 * @returns TranslateLoaderFactory Instance
 */
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  imports: [
    SharedModule,
    CustomTestRoutingModule,
    NgbModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
    }),
  ],
  exports: [
    TestResultCustomMsgComponent
  ],
  declarations: [
    CustomTestComponent,
    CustomTestContainerComponent,
    CustomTestTopbarComponent,
    QuestionComponent,
    QuestionNavComponent,
    CustomTestResultContainerComponent,
    TestResultCustomMsgComponent
  ],
  providers: [ResultPageGuard, TestGuard, TestHistoryService],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [TestResultCustomMsgComponent],
})
export class CustomTestModule { }

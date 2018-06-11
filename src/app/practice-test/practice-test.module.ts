import { TestHistoryService } from './../student/shared/services/test-history.service';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SharedModule } from '../shared/shared.module';
import { PracticeTestComponent } from './practice-test.component';
import { PracticeTestRoutingModule } from './practice-test-routing.module';

import { TestContainerComponent, QuestionComponent, QuestionNavComponent, ResultContainerComponent } from './pages';
import { TestTopbarComponent } from './shared/components/test-topbar/test-topbar.component';
import { ResultPageGuard, TestGuard } from './guards';

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
    PracticeTestRoutingModule,
    NgbModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
    }),
  ],
  declarations: [
    PracticeTestComponent,
    TestContainerComponent,
    TestTopbarComponent,
    QuestionComponent,
    QuestionNavComponent,
    ResultContainerComponent
  ],
  providers: [ResultPageGuard, TestGuard, TestHistoryService],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class PracticeTestModule { }

import { environment } from '../../../environments/environment';

import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SharedModule } from '../../shared/shared.module';
import { PracticeRoutingModule } from './practice-routing.module';
import { PracticeComponent } from './practice.component';

import {
  PracticeIndexContainerComponent,
  PracticeIndexSidebarComponent,
  PracticeIndexConfigComponent,
  PracticeSidebarItemComponent
} from './pages';

import { PracticeTestService } from './services';
import { CourseIndexCreatorService } from '../shared/services';

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
    NgbModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
    }),
    PracticeRoutingModule
  ],
  declarations: [
    PracticeComponent,
    PracticeIndexContainerComponent,
    PracticeIndexSidebarComponent,
    PracticeIndexConfigComponent,
    PracticeSidebarItemComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [PracticeTestService, CourseIndexCreatorService]
})
export class PracticeModule { }

import { environment } from '../../../environments/environment';

import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SharedModule } from '../../shared/shared.module';
import { StudyRoutingModule } from './study-routing.module';
import { StudyComponent } from './study.component';

import {
  StudyIndexContainerComponent,
  StudyIndexContentComponent,
  StudyIndexSidebarComponent,
  StudySidebarItemComponent,
  StudyIndexContentViewerComponent
} from './pages';

import { StudyCourseContentItemComponent } from '../shared/components';
import { ContentFilterPipe, ContentCountPipe } from '../shared/pipes';
import { CourseIndexCreatorService } from '../shared/services';
import { StudyGuard } from '../guards';

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

/**
 * Student Study Module
 *
 * @export
 * @class StudyModule
 */
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
    StudyRoutingModule
  ],
  declarations: [
    ContentFilterPipe,
    ContentCountPipe,
    StudyComponent,
    StudyIndexContainerComponent,
    StudyIndexSidebarComponent,
    StudyIndexContentComponent,
    StudySidebarItemComponent,
    StudyCourseContentItemComponent,
    StudyIndexContentViewerComponent
  ],
  providers: [CourseIndexCreatorService, StudyGuard],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class StudyModule { }

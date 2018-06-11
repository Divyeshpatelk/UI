import { environment } from '../../environments/environment';

import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ng2-img-cropper';
import { NgUploaderModule } from 'ngx-uploader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { SharedModule } from '../shared/shared.module';
import { PartnerRoutingModule } from './partner-routing.module';
import { PartnerComponent } from './partner.component';
import { ParserServiceService } from '../myservice/parser-service.service';
import { DisplayResultComponent } from '../display-result/display-result.component';
import { ConfigService } from '../myservice/config.service';
import { InputTextboxComponent } from '../input-textbox/input-textbox.component';
// Partner Pages
import {
  CreateCourseComponent,
  MyCoursesComponent,
  MyLibraryComponent,
  StudyMaterialComponent,
  QuestionsComponent,
  PublishCourseComponent,
  IndexContainerComponent,
  AddQuestionComponent,
  CsvUploadQuestionComponent,
  BulkUploadQuestionsComponent,
  CourseQuesTabComponent,
  UpdateQuestionComponent,
  SidebarItemComponent,
  CourseIndexSidebarComponent,
  CourseIndexContentComponent,
  CourseContentItemComponent,
  UploadContentPreviewComponent,
  AddFromMyLibraryComponent,
  CourseStudyMaterialComponent
} from './pages/';

// Partner Shared Components
import {
  CourseItemComponent,
  FileUploadComponent,
  ImageEditComponent,
  StudyMaterialEditComponent,
  TopbarComponent,
  QuesItemComponent,
  UploadIndicatorComponent,
  QuestionEditComponent
} from './shared/components/';

import { FileDropDirective, FileSelectDirective } from './shared/directives';

import {
  CourseManagerService,
  MyLibraryService,
  UploadContentService,
  ContentManagerService,
  YoutubeService
} from './services';
import { CourseFilterPipe } from './shared/pipes/course-filter.pipe';
import { CustomTestEditorModalComponent } from './pages/custom-test-editor-modal/custom-test-editor-modal.component';
import { QuestionFormComponent } from './shared/components/question-form/question-form.component';
import { CustomTestGeneratorService } from './services/custom-test-generator.service';
import { CourseTestTabComponent } from './pages/index-container/course-index-content/course-test-tab/course-test-tab.component';
import { SectionFormComponent } from './pages/custom-test-editor-modal/section-form/section-form.component';

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
 * Child Module for Partner Vertical. This class contains declarations for Modules and Child components created for partner vertical
 *
 * @export
 * @class PartnerModule
 * @version 1.0
 * @author
 */
@NgModule({
  imports: [
    SharedModule,
    PartnerRoutingModule,
    NgbModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxDatatableModule,
    ImageCropperModule,
    NgUploaderModule
  ],
  declarations: [
    PartnerComponent,
    MyCoursesComponent,
    TopbarComponent,
    CourseItemComponent,
    CreateCourseComponent,
    IndexContainerComponent,
    PublishCourseComponent,
    FileUploadComponent,
    ImageEditComponent,
    MyLibraryComponent,
    StudyMaterialEditComponent,
    StudyMaterialComponent,
    QuestionsComponent,
    QuesItemComponent,
    AddQuestionComponent,
    CsvUploadQuestionComponent,
    SidebarItemComponent,
    CourseIndexSidebarComponent,
    CourseIndexContentComponent,
    CourseContentItemComponent,
    UploadContentPreviewComponent,
    FileDropDirective,
    FileSelectDirective,
    CourseQuesTabComponent,
    AddFromMyLibraryComponent,
    UploadIndicatorComponent,
    CourseStudyMaterialComponent,
    UpdateQuestionComponent,
    QuestionEditComponent,
    CourseFilterPipe,
    BulkUploadQuestionsComponent,
    CustomTestEditorModalComponent,
    QuestionFormComponent,
    CourseTestTabComponent,
    SectionFormComponent,
    DisplayResultComponent,
    InputTextboxComponent
  ],
  providers: [
    CourseManagerService,
    MyLibraryService,
    UploadContentService,
    ContentManagerService,
    YoutubeService,
    CustomTestGeneratorService,
    ConfigService,
    ParserServiceService
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    ImageEditComponent,
    StudyMaterialEditComponent,
    AddQuestionComponent,
    CsvUploadQuestionComponent,
    BulkUploadQuestionsComponent,
    UploadContentPreviewComponent,
    AddFromMyLibraryComponent,
    QuestionEditComponent,
    CustomTestEditorModalComponent
  ]
})
export class PartnerModule {}

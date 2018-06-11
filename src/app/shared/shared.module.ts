import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';

// Video Player Imports
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { QuillModule } from 'ngx-quill';

import {
  ConfirmComponent,
  PageNotFoundComponent,
  PdfReaderComponent,
  VideoPlayerComponent,
  YoutubePlayerComponent,
  InlineTextEditorComponent,
  InlineQuillEditorComponent,
  ThumbnailPdfComponent,
  ThumbnailYoutubeComponent,
  ThumbnailVideoComponent,
  AlertComponent,
  QuestionEditorComponent
} from './components';

import { ConfirmDirective, OnlyNumberDirective } from './directives';
import { DateTimeFormatPipe, FormatTimerPipe, QuestionFilterPipe } from './pipes';
import { LogoClickHandleDirective } from './directives/logo-click-handle.directive';

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
 * Module Class for Shared components, directives, services
 *
 * @export
 * @class SharedModule
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    QuillModule,
    NgbModule,
    TableModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    PageNotFoundComponent,
    ConfirmComponent,
    ConfirmDirective,
    OnlyNumberDirective,
    VideoPlayerComponent,
    PdfReaderComponent,
    YoutubePlayerComponent,
    DateTimeFormatPipe,
    QuestionFilterPipe,
    InlineTextEditorComponent,
    InlineQuillEditorComponent,
    ThumbnailPdfComponent,
    ThumbnailYoutubeComponent,
    ThumbnailVideoComponent,
    FormatTimerPipe,
    AlertComponent,
    QuestionEditorComponent,
    LogoClickHandleDirective
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageNotFoundComponent,
    ConfirmComponent,
    ConfirmDirective,
    OnlyNumberDirective,
    VideoPlayerComponent,
    PdfReaderComponent,
    YoutubePlayerComponent,
    InlineTextEditorComponent,
    InlineQuillEditorComponent,
    DateTimeFormatPipe,
    QuestionFilterPipe,
    QuillModule,
    ThumbnailPdfComponent,
    ThumbnailYoutubeComponent,
    ThumbnailVideoComponent,
    FormatTimerPipe,
    AlertComponent,
    QuestionEditorComponent,
    LogoClickHandleDirective,
    TableModule
  ],
  entryComponents: [ConfirmComponent, AlertComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}

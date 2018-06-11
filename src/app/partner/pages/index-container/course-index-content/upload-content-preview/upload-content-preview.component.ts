import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  AfterViewChecked,
  ElementRef
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NgbActiveModal, NgbTabset, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { NgProgress } from '@ngx-progressbar/core';

import { PreviewContent, ContentMetadata } from '../../../../../_models';
import { ConfirmComponent } from '../../../../../shared/components/confirm/confirm.component';
import { ValidationPattern, Constants, ValidatorLengths } from '../../../../../_const';

import { YoutubeService } from '../../../../services/youtube.service';
@Component({
  selector: 'pdg-upload-content-preview',
  templateUrl: './upload-content-preview.component.html',
  styleUrls: ['./upload-content-preview.component.scss']
})
export class UploadContentPreviewComponent implements OnInit, AfterViewInit, AfterViewChecked {
  public showInfoMessage = false;
  public validFileCount = 0;
  public alertMessage: string;

  @Input() openReferenceTab;
  @Input() contentList: PreviewContent[];

  @ViewChild('fileSelect') fileSelect: ElementRef;
  @ViewChild('tabs') tabSet: NgbTabset;

  public referenceForm: FormGroup;
  public contentListForm: FormGroup;
  public _contentList: any;
  public selectedContent: PreviewContent;
  public selectedContentUrl: SafeResourceUrl;
  public droppableClasses = {};
  public titleMinLength: number = ValidatorLengths.CONTENT_TITLE_MIN;
  public titleMaxLength: number = ValidatorLengths.CONTENT_TITLE_MAX;
  public descMinLength: number = ValidatorLengths.CONTENT_DESC_MIN;
  public descMaxLength: number = ValidatorLengths.CONTENT_DESC_MAX;
  /**
   * Creates an instance of UploadContentPreviewComponent.
   * @param {NgbActiveModal} activeModal
   * @param {ChangeDetectorRef} cdRef
   * @param {FormBuilder} formBuilder
   * @param {DomSanitizer} domSanitizer
   * @param {NgbModal} modalService
   * @param {TranslateService} translator
   * @memberof UploadContentPreviewComponent
   */
  constructor(
    private activeModal: NgbActiveModal,
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private domSanitizer: DomSanitizer,
    private modalService: NgbModal,
    private notification: NotificationsService,
    private translator: TranslateService,
    private youtube: YoutubeService,
    private pService: NgProgress
  ) {
    this._contentList = [];
  }

  ngOnInit() {
    this.referenceForm = this.formBuilder.group({
      url: ['', [Validators.required, Validators.pattern(ValidationPattern.YOUTUBE_URL)]]
    });

    this.contentListForm = this.formBuilder.group({
      contentList: this.formBuilder.array([])
    });

    this.contentList.forEach((content: PreviewContent) => {
      this.addToContentListFormArray(content);
    });

    if (this._contentList.length) {
      this.selectContent(this._contentList.at(0));
    }
  }

  ngAfterViewInit() {
    if (this.openReferenceTab) {
      this.tabSet.select('reference');
    }
  }

  ngAfterViewChecked() {
    //  explicit change detection to avoid "expression-has-changed-after-it-was-checked-error"
    this.cdRef.detectChanges();
  }

  addToContentListFormArray(content: PreviewContent) {
    this._contentList = this.contentListForm.controls.contentList as FormArray;
    this._contentList.push(this.getContentListFormGroup(content));
  }

  getContentListFormGroup(content: PreviewContent): FormGroup {
    return this.formBuilder.group({
      file: [content.file],
      data: this.formBuilder.group({
        fileName: [content.data.fileName],
        fileType: [content.data.fileType],
        description: [
          content.data.description,
          [Validators.required, Validators.minLength(this.descMinLength), Validators.maxLength(this.descMaxLength)]
        ],
        title: [
          content.data.title,
          [Validators.required, Validators.minLength(this.titleMinLength), Validators.maxLength(this.titleMaxLength)]
        ],
        duration: [content.data.duration],
        thumbnailUrl: [content.data.thumbnailUrl]
      }),
      contents: [content.contents]
    });
  }

  /**
   * Method invoked on close / cancel button click
   * If Any content is added to the list, comfirm dialog is shown to the user, else upload modal is closed.
   * If user clicks on confirm then the modal is closed, else user stays on the screen
   */
  close() {
    if (this._contentList.length > 0) {
      const modalRef = this.modalService.open(ConfirmComponent, { keyboard: false, backdrop: 'static' });
      modalRef.componentInstance.title = this.translator.instant('WARNING');
      modalRef.componentInstance.text = this.translator.instant('UPLOAD_CANCEL_CONFIRM_TEXT');

      modalRef.result.then(
        (result) => {
          this.activeModal.dismiss('cancelled');
        },
        (reason) => {
          // Nothing to handle here as of now
        }
      );
    } else {
      this.activeModal.dismiss('cancelled');
    }
  }

  /**
   * Method invoked on submit button click.
   * Upload Content Preview Modal is closed with the upload content list
   */
  submit() {
    this.activeModal.close(this.contentListForm.value.contentList);
  }

  openFileSelect() {
    this.fileSelect.nativeElement.click();
  }

  filesDropped(files: FileList) {
    this.droppableClasses = {};
    this.showInfoMessage = false;
    this.selectFiles(files);
  }

  filesDragOver(files: FileList) {
    this.droppableClasses = {
      border: true,
      'border-primary': true
    };
  }

  filesDragLeave(files: FileList) {
    this.droppableClasses = {};
  }

  selectFiles(files: FileList) {
    this.showInfoMessage = false;
    const previewContentList = [];
    this.validFileCount = 0;
    let invalidFileCount = 0;
    let largeFileCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file: File = files.item(i);

      /**
       * file is added to the list only if its valid,
       * If file is invalid, invalidFileCount is incremented and a notification is shown to the user
       * with the number of files invalid.
       */
      if (this.isValidFile(file)) {
        if (file.size > Constants.MAX_FILE_SIZE) {
          largeFileCount++;
        } else {
          this.validFileCount++;
          const content = {
            file: file,
            data: {
              title: this.getTitle(file.name),
              fileName: file.name,
              description: '',
              fileType: this.getFileType(file),
              duration: 1
            }
          };
          this.addToContentListFormArray(content);
        }
      } else {
        invalidFileCount++;
      }
    }

    // To show Info alert message when any files added
    if (this.validFileCount > 1) {
      this.showAddContentAlert(
        `${this.validFileCount} ${this.translator.instant('FILES')} ${this.translator.instant('ADDED_TO_LIST')}`
      );
    } else {
      this.showAddContentAlert(
        `${this.validFileCount} ${this.translator.instant('FILE')} ${this.translator.instant('ADDED_TO_LIST')}`
      );
    }

    this.fileSelect.nativeElement.value = null;
    if (!this.selectedContent && this._contentList.length) {
      this.selectContent(this._contentList.at(0));
    }

    // show Invalid files notification
    if (invalidFileCount) {
      this.notification.error(
        this.translator.instant('UNSUPPORTED_CONTENT'),
        this.translator.instant('NO_OF_UNSUPPORTED_FILES', { count: invalidFileCount }),
        { clickToClose: false }
      );
    }

    if (largeFileCount) {
      this.notification.error(
        this.translator.instant('FILES_TOO_LARGE'),
        this.translator.instant('NO_OF_LARGE_FILES', { count: largeFileCount }),
        { clickToClose: false }
      );
    }
  }

  /**
   * Method to check Valid File
   *
   * @param {File} file File Object
   * @returns {boolean} true - valid file else false
   */
  isValidFile(file: File): boolean {
    if (
      (file.type.indexOf('video') !== -1 && !this.checkInvalidVideoFormat(file.type)) ||
      file.type.indexOf('pdf') !== -1
    ) {
      return true;
    }
    return false;
  }

  /**
   * mthod to  check file type is valid or not valid according to defined constant
   * @param filetype
   */
  checkInvalidVideoFormat(filetype) {
    const matchFileType = Constants.INVALID_VIDEO_FORMATE.replace(/, ?/g, '|');
    const re = new RegExp(matchFileType, 'g');
    if (filetype.match(re) !== null) {
      return true;
    }
    return false;
  }

  selectContent(contentFromGroup: FormGroup) {
    this.selectedContent = contentFromGroup && contentFromGroup.value;

    if (this.selectedContent) {
      if (contentFromGroup.value.contents) {
        if (this.selectedContent.data.fileType !== 'pdf') {
          this.selectedContentUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
            this.selectedContent.data.fileName
          );
        } else {
          this.selectedContentUrl = this.selectedContent.data.fileName;
        }
      } else {
        if (this.selectedContent.data.fileType === 'video') {
          this.selectedContentUrl = this.domSanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(this.selectedContent.file)
          );
        } else if (this.selectedContent.data.fileType === 'pdf') {
          this.selectedContentUrl = URL.createObjectURL(this.selectedContent.file);
        } else {
          this.selectedContentUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
            this.selectedContent.data.fileName
          );
        }
      }
    }
  }

  removeFromList(contentIndex, e: Event) {
    e.stopPropagation();
    this._contentList = this.contentListForm.controls.contentList as FormArray;
    this._contentList.removeAt(contentIndex);
    this.selectContent(this._contentList.at([contentIndex - 1]));
  }

  /**
   * This method returns the formatted URL for added Reference URL
   *
   * @param {string} url Reference URL to be formatted
   * @returns Formatted URL
   */
  getEmbedUrl(url: string) {
    let formattedUrl = url;
    const youtubeString = 'www.youtube.com/embed';
    const shortYoutubeString = 'youtu.be';
    const watchString = 'watch?v=';
    const embedString = 'embed/';
    const noSuggest = '?rel=0';
    const timeStart = '&start=';

    // Checking for Watch string first
    if (url.indexOf(watchString) > -1) {
      formattedUrl = url.replace(watchString, embedString);
    } else if (url.indexOf(shortYoutubeString) > -1) {
      formattedUrl = url.replace(shortYoutubeString, youtubeString);

      if (formattedUrl.indexOf('?') > -1) {
        formattedUrl = formattedUrl.replace('?', '&');
      }
    }

    const temp = formattedUrl.split('&');
    formattedUrl = `${temp[0]}${noSuggest}`;

    if (temp.length > 1) {
      // take time parameter from string
      const timetemp = temp.filter((item) => item.indexOf('t=') > -1);

      if (timetemp[0].indexOf('m') > -1) {
        const eqIndex = timetemp[0].indexOf('=');
        const minIndex = timetemp[0].indexOf('m');
        const secIndex = timetemp[0].indexOf('s');

        const minutes = timetemp[0].slice(eqIndex + 1, minIndex);
        const seconds = timetemp[0].slice(minIndex + 1, secIndex);

        const startTime: any = parseInt(minutes, 0) * 60 + parseInt(seconds, 0);
        formattedUrl = `${formattedUrl}${timeStart}${startTime}`;
      } else if (timetemp[0].indexOf('s') > -1) {
        const eqIndex = timetemp[0].indexOf('=');
        const secIndex = timetemp[0].indexOf('s');

        const startTime = timetemp[0].slice(eqIndex + 1, secIndex);
        formattedUrl = `${formattedUrl}${timeStart}${startTime}`;
      } else {
        formattedUrl = `${formattedUrl}${timeStart}${timetemp[0].split('=')[1]}`;
      }
    }
    return formattedUrl;
  }

  /**
   * Method invoked when user clicks on add button on Add Reference URL Tab
   */
  addReferenceUrl() {
    const url = this.referenceForm.value.url;
    this.pService.start();

    this.youtube.getYoutubeData(url).subscribe(
      (youtubeMetaData) => {
        if (youtubeMetaData.error) {
          this.setPreviewContent({ title: url, thumbnail_url: '' });
        } else {
          this.setPreviewContent(youtubeMetaData);
        }
      },
      (error) => {
        this.setPreviewContent({ title: url, thumbnail_url: '' });
      },
      () => {
        this.pService.done();
      }
    );
  }

  setPreviewContent(youtubeMetaData) {
    const previewContent: PreviewContent = {
      data: {
        description: '',
        duration: 1,
        fileName: this.getEmbedUrl(this.referenceForm.value.url),
        fileType: 'refvideo',
        title: youtubeMetaData.title,
        thumbnailUrl: youtubeMetaData.thumbnail_url
      }
    };
    // Show alert message when reference url is added to the list
    this.showAddContentAlert(this.translator.instant('REFERENCE_ADDED_TO_LIST'));
    this.referenceForm.reset();
    this.addToContentListFormArray(previewContent);
    if (!this.selectedContent && this._contentList.length) {
      this.selectContent(this._contentList.at(0));
    }
  }
  getTitle(fileName: string) {
    return fileName.substring(0, fileName.lastIndexOf('.'));
  }

  /**
   * Returns the file type
   *
   * @param {File} file
   * @returns
   */
  getFileType(file: File) {
    let fileType = null;
    if (file.type.indexOf('video') !== -1) {
      fileType = 'video';
    } else if (file.type.indexOf('pdf') !== -1) {
      fileType = 'pdf';
    } else {
      // else is not required, but keeping it for now
    }
    return fileType;
  }

  /**
   * Method to show alert message on content add
   * @param {string} message Message to be shown
   */
  showAddContentAlert(message: string) {
    this.alertMessage = message;
    this.showInfoMessage = true;
    setTimeout(() => this.hideAddContentAlert(), Constants.ALERT_TIMEOUT);
  }

  /**
   * Method to hide the alert message
   */
  hideAddContentAlert() {
    this.showInfoMessage = false;
  }
}

import { Component, OnInit, ViewChild, OnChanges, Input, SimpleChanges, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs/Observable';

import { APIConfig } from '../../../../../_config';
import { Course, Subject, SubjectIndex, Content, ContentMetadata, PreviewContent } from '../../../../../_models';
import {
  CourseManagerService,
  UploadContentService,
  ContentManagerService,
  CourseCreationService
} from '../../../../services';
import { StudyMaterialEditComponent } from '../../../../shared/components/study-material-edit/study-material-edit.component';
import { UploadContentPreviewComponent } from '../upload-content-preview/upload-content-preview.component';
import { AddFromMyLibraryComponent } from '../add-from-my-library/add-from-my-library.component';
import { Constants } from '../../../../../_const';

@Component({
  selector: 'pdg-course-study-material',
  templateUrl: './course-study-material.component.html',
  styleUrls: ['./course-study-material.component.scss']
})
export class CourseStudyMaterialComponent implements OnInit, OnChanges {
  @ViewChild('fileSelect') fileSelect: ElementRef;

  @Input() course: Course;
  @Input() subject: Subject;
  @Input() index: SubjectIndex;

  public contents: Content[];
  public droppableClasses = {};

  constructor(
    private courseCreator: CourseCreationService,
    private uploadService: UploadContentService,
    private contentManager: ContentManagerService,
    private modalService: NgbModal,
    private notification: NotificationsService,
    private translation: TranslateService
  ) {
    this.contents = [];
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.index = changes.index.currentValue;
    this.contents = [];
    let contentIds = this.generateRequestBody(this.index, []);
    contentIds = contentIds.map((indexContents) => {
      indexContents.contentids = indexContents.contentids
        .sort((a, b) => a.mappingDate - b.mappingDate)
        .map((content) => content.mappingId);
      return indexContents;
    });
    this.contentManager.getContentDetails(contentIds).subscribe(
      (indexedContents: { [key: string]: Content[] }) => {
        this.contents = indexedContents[this.index.indexId];
      },
      (error) => {
        this.contents = [];
      }
    );
  }

  generateRequestBody(subjectIndex: SubjectIndex, arr) {
    if (subjectIndex.contentUnits) {
      const videoIds = subjectIndex.contentUnits.videoIds;
      const bookIds = subjectIndex.contentUnits.bookIds;

      let contentIds = [];

      if (videoIds && videoIds.length) {
        contentIds = [...contentIds, ...videoIds];
      }

      if (bookIds && bookIds.length) {
        contentIds = [...contentIds, ...bookIds];
      }

      arr.push({
        indexid: subjectIndex.indexId,
        contentids: contentIds
      });
    }
    //  Uncomment this to get recursive content array
    // if (subjectIndex.children && subjectIndex.children.length > 0) {
    //   subjectIndex.children.forEach((index: SubjectIndex) => {
    //     this.generateRequestBody(index, arr);
    //   });
    // }
    return arr;
  }

  openFileSelect() {
    this.fileSelect.nativeElement.click();
  }

  filesDropped(files: FileList) {
    if (this.course.status === 'DRAFT') {
      this.droppableClasses = {};
      this.selectFiles(files);
    }
  }

  filesDragOver(files: FileList) {
    if (this.course.status === 'DRAFT') {
      this.droppableClasses = {
        droppable: true,
        border: true,
        'border-primary': true
      };
    }
  }

  filesDragLeave(files: FileList) {
    if (this.course.status === 'DRAFT') {
      this.droppableClasses = {};
    }
  }

  selectFiles(files: FileList) {
    const previewContentList = [];
    let validFileCount = 0;
    let invalidFileCount = 0;
    let largeFileCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file: File = files.item(i);
      if (this.isValidFile(file)) {
        if (file.size > Constants.MAX_FILE_SIZE) {
          largeFileCount++;
        } else {
          validFileCount++;
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
          previewContentList.push(content);
        }
      } else {
        invalidFileCount++;
      }
    }

    if (validFileCount) {
      this.openUploadPreview(previewContentList, null);
    }

    if (invalidFileCount) {
      this.notification.error(
        this.translation.instant('UNSUPPORTED_CONTENT'),
        this.translation.instant('NO_OF_UNSUPPORTED_FILES', { count: invalidFileCount }),
        { clickToClose: false }
      );
    }

    if (largeFileCount) {
      this.notification.error(
        this.translation.instant('FILES_TOO_LARGE'),
        this.translation.instant('NO_OF_LARGE_FILES', { count: largeFileCount }),
        { clickToClose: false }
      );
    }
  }

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

  getTitle(fileName: string) {
    return fileName.substring(0, fileName.lastIndexOf('.'));
  }

  getFileType(file: File) {
    let fileType = null;
    if (file.type.indexOf('video') !== -1) {
      fileType = 'video';
    } else if (file.type.indexOf('pdf') !== -1) {
      fileType = 'pdf';
    } else {
      alert('wrong file');
    }
    return fileType;
  }

  uploadContent(contentList: PreviewContent[]) {
    const uploadUrl = APIConfig.UPLOAD_COURSE_CONTENT;
    const referenceUrl = APIConfig.REFERENCE_COURSE_CONTENT;
    for (let i = 0; i < contentList.length; i++) {
      const contentItem = contentList[i];
      const uploadQueueItem = {
        url: contentItem.data.fileType === 'refvideo' || contentItem.contents ? referenceUrl : uploadUrl,
        file: contentItem.file,
        course: this.course,
        subject: this.subject,
        index: this.index,
        data: contentItem.data,
        contents: contentItem.contents
      };
      this.uploadService.addToContentUploadQueue(uploadQueueItem);
    }
  }

  removeContent(content: Content) {
    const mappingObj = {
      courseId: this.course.id,
      subjectId: this.subject.id,
      indexId: this.index.indexId,
      contentId: content.id,
      contentType: content.type
    };
    this.contentManager.deleteContentMapping(mappingObj).subscribe((response) => {
      this.courseCreator.refresh();
    });
  }

  openPreview(content: Content) {
    const selection = window.getSelection();
    if (selection.toString().length === 0) {
      this.contentManager
        .getContentUrl({
          courseId: this.course.id,
          subjectId: this.subject.id,
          indexId: this.index.indexId,
          contentId: content.id
        })
        .subscribe(
          (response) => {
            content.cdnUrl = response;
            this.openPreviewContentModal(content);
          },
          (error) => {
            this.notification.error(
              this.translation.instant('ACCESS_DENIED'),
              this.translation.instant('UNAUTHORIZED_ACCESS'),
              { clickToClose: false }
            );
          }
        );
    }
  }

  openPreviewContentModal(content) {
    const modalRef = this.modalService.open(StudyMaterialEditComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.content = content;

    modalRef.result.then(
      (result) => {
        if (this.course.status === 'DRAFT') {
          this.courseCreator.refresh();
        }
      },
      (close) => {
        if (this.course.status === 'DRAFT') {
          this.courseCreator.refresh();
        }
      }
    );
  }

  openUploadPreview(previewContentList: PreviewContent[], isReference: boolean) {
    const modalRef = this.modalService.open(UploadContentPreviewComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static'
    });
    modalRef.componentInstance.contentList = previewContentList || [];
    modalRef.componentInstance.openReferenceTab = isReference ? true : false;

    modalRef.result.then(
      (contentList: PreviewContent[]) => {
        this.uploadContent(contentList);
        this.fileSelect.nativeElement.value = null;
      },
      (close) => {
        this.fileSelect.nativeElement.value = null;
      }
    );
  }

  addFromMyLibrary(e: Event) {
    const modalRef = this.modalService.open(AddFromMyLibraryComponent, { size: 'lg' });
    modalRef.componentInstance.addedContents = this.contents;

    modalRef.result.then(
      (contentList: PreviewContent[]) => {
        this.uploadContent(contentList);
      },
      (close) => {
        // TODO Do something useful probably
      }
    );
  }
}

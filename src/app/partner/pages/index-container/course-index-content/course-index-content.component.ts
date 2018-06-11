import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';

import { Course, Subject, SubjectIndex, UploadContentEvent, UploadEventType } from '../../../../_models';
import { UploadContentPreviewComponent } from './upload-content-preview/upload-content-preview.component';
import { CourseCreationService } from '../../../services/course-creation.service';
import { CourseManagerService, UploadContentService, ContentManagerService } from '../../../services';

@Component({
  selector: 'pdg-course-index-content',
  templateUrl: './course-index-content.component.html',
  styleUrls: ['./course-index-content.component.scss']
})
export class CourseIndexContentComponent implements OnInit {
  public course: Course;
  public subject: Subject;
  public subjectIndex: SubjectIndex;

  constructor(
    private courseCreator: CourseCreationService,
    private courseManager: CourseManagerService,
    private uploadService: UploadContentService,
    private contentManager: ContentManagerService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.course = this.courseCreator.course;
    this.courseCreator.selectedSubject.subscribe((subject: Subject) => {
      this.subject = subject;
    });
    this.courseCreator.selectedSubjectIndex.subscribe((subjectIndex: SubjectIndex) => {
      this.subjectIndex = subjectIndex;
    });

    this.uploadService.contentUploadEventQueue.subscribe((event: UploadContentEvent) => {
      if (event.type === UploadEventType.ITEM_COMPLETE) {
        if (
          event.content.course.id === this.course.id &&
          event.content.subject.id === this.subject.id &&
          event.content.index.indexId === this.subjectIndex.indexId
        ) {
          this.courseCreator.refresh();
        }
      }
    });
  }
}

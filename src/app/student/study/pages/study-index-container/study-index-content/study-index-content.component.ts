import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';

import { Course, Subject, SubjectIndex, Content } from '../../../../../_models';
import { CourseIndexCreatorService, ContentManagerService } from '../../../../shared/services';

/**
 * Student Study Index Content component class.
 * It displays a list of contents mapped on the selected index.
 *
 * @export
 * @class StudyIndexContentComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'pdg-study-index-content',
  templateUrl: './study-index-content.component.html',
  styleUrls: ['./study-index-content.component.scss']
})
export class StudyIndexContentComponent implements OnInit, OnDestroy {
  /**
   * Selected Course Object
   * @type {Course}
   */
  public course: Course;

  /**
   * Object to hold Selected Subject
   * @type {Subject}
   */
  public subject: Subject;

  /**
   * Object to hold selected subject index
   * @type {SubjectIndex}
   */
  public subjectIndex: SubjectIndex;

  /**
   * List of contents
   * @type {Content[]}
   */
  public contents: Content[];

  private selectedSubjectSubscription: Subscription;
  private selectedSubjectIndexSubscription: Subscription;

  /**
   * Creates an instance of StudyIndexContentComponent.
   * @param {CourseIndexCreatorService} courseIndexCreator
   * @param {ContentManagerService} contentManager
   */
  constructor(
    private courseIndexCreator: CourseIndexCreatorService,
    private contentManager: ContentManagerService,
    private notifyService: NotificationsService,
    private router: Router,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.course = this.courseIndexCreator.course;

    this.selectedSubjectSubscription = this.courseIndexCreator.selectedSubject.subscribe((subject: Subject) => {
      this.subject = subject;
    });

    this.selectedSubjectIndexSubscription = this.courseIndexCreator.selectedSubjectIndex.subscribe(
      (subjectIndex: SubjectIndex) => {
        if (subjectIndex) {
          this.subjectIndex = subjectIndex;
          let contentIds = this.generateRequestBody(this.subjectIndex, []);
          contentIds = contentIds.sort((a, b) => a.mappingDate - b.mappingDate).map((content) => content.mappingId);
          this.contentManager.getContentDetails(this.course.id, this.subjectIndex.indexId, contentIds).subscribe(
            (indexedContents: { [key: string]: Content[] }) => {
              this.contents = indexedContents[this.subjectIndex.indexId];
              this.courseIndexCreator.setIndexContents(this.contents);
            },
            (error) => {
              this.contents = [];
            }
          );
        }
      }
    );
  }

  ngOnDestroy() {
    this.selectedSubjectSubscription.unsubscribe();
    this.selectedSubjectIndexSubscription.unsubscribe();
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

      arr = contentIds;
    }
    //  Uncomment this to get recursive content array
    // if (subjectIndex.children && subjectIndex.children.length > 0) {
    //   subjectIndex.children.forEach((index: SubjectIndex) => {
    //     this.generateRequestBody(index, arr);
    //   });
    // }
    return arr;
  }

  selectContent(content: Content) {
    this.courseIndexCreator.selectContent(content);
  }
}

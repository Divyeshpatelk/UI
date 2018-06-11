import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';

import { CourseIndexCreatorService, ContentManagerService } from '../../../../shared/services';
import { Content, Course, Subject, SubjectIndex } from '../../../../../_models';

@Component({
  selector: 'pdg-study-index-content-viewer',
  templateUrl: './study-index-content-viewer.component.html',
  styleUrls: ['./study-index-content-viewer.component.scss']
})
export class StudyIndexContentViewerComponent implements OnInit, OnDestroy {
  /**
   * Content list to be shown on the preview page
   * @type {Content[]}
   */
  public contents: Content[];

  /**
   * Selected Content from the Content List
   * @type {Content}
   */
  public selectedContent: Content;

  /**
   * Safe Resource URL object to play the selected conent
   * @type {SafeResourceUrl}
   */
  public src: SafeResourceUrl;
  showContentBar = false;
  /**
   * Course Selected from My Course Page
   * @private
   * @type {Course}
   */
  private course: Course;
  private subject: Subject;
  private subjectIndex: SubjectIndex;

  /**
   * Custom Filter Pipe Arguements
   */
  public filterArgs: string;

  private selectedSubjectSubscription: Subscription;
  private selectedSubjectIndexSubscription: Subscription;
  private selectedContentSubscription: Subscription;

  /**
   * Creates an instance of StudyIndexPreviewComponent.
   * @param {ActivatedRoute} route
   * @param {CourseIndexCreatorService} courseIndexCreator
   * @param {DomSanitizer} domSanitizer
   * @param {Router} router
   */
  constructor(
    private route: ActivatedRoute,
    private courseIndexCreator: CourseIndexCreatorService,
    private contentManager: ContentManagerService,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private notifyService: NotificationsService,
    private translator: TranslateService
  ) {}

  /**
   * Overridden method invoked when component is loaded
   */
  ngOnInit() {
    // Set the filter args empty
    this.filterArgs = '';

    // Getting the Selected Course from Shared Service
    this.course = this.courseIndexCreator.course;

    this.selectedSubjectSubscription = this.courseIndexCreator.selectedSubject.subscribe(
      (subject: Subject) => (this.subject = subject)
    );

    this.selectedSubjectIndexSubscription = this.courseIndexCreator.selectedSubjectIndex.subscribe(
      (subjectIndex: SubjectIndex) => (this.subjectIndex = subjectIndex)
    );

    // Get the Contents List from Shared Service.
    this.contents = this.courseIndexCreator.getIndexContents();

    this.selectedContentSubscription = this.courseIndexCreator.selectedContent.subscribe((content: Content) => {
      if (content) {
        this.selectedContent = content;
        this.contentManager
          .getContentUrl({
            courseId: this.course.id,
            subjectId: this.subject.id,
            indexId: this.subjectIndex.indexId,
            contentId: content.id
          })
          .subscribe(
            (response: string) => {
              // Set the presigned url on the contents list set in shared service
              this.selectedContent.cdnUrl = response;
              this.courseIndexCreator.setIndexContents(this.contents);
              this.setContentUrl(this.selectedContent);
            },
            (error) => {
              this.notifyService.error(
                this.translator.instant('ACCESS_DENIED'),
                this.translator.instant('UNAUTHORIZED_ACCESS'),
                {
                  clickToClose: false
                }
              );
            }
          );
      }
    });
  }

  ngOnDestroy() {
    this.selectedSubjectSubscription.unsubscribe();
    this.selectedSubjectIndexSubscription.unsubscribe();
    this.selectedContentSubscription.unsubscribe();
  }

  /**
   * Method to Set Selected Content Source URL
   * @param {any} content Selected Content
   */
  setContentUrl(content) {
    switch (content.type) {
      case 'pdf':
        this.src = content.cdnUrl;
        break;

      case 'video':
        this.src = this.domSanitizer.bypassSecurityTrustUrl(content.cdnUrl);
        break;

      case 'refvideo':
        this.src = this.domSanitizer.bypassSecurityTrustResourceUrl(content.cdnUrl);
        break;
      default:
        break;
    }
  }

  /**
   * Method to apply / clear filter
   * @param {string} type Type of contents to be filtered
   */
  filterContent(type: string) {
    if (this.filterArgs === type) {
      this.filterArgs = '';
    } else {
      this.filterArgs = type;
    }
  }

  selectContent(content: Content) {
    this.courseIndexCreator.selectContent(content);
    this.showContentBar = false;
  }
}

import { Component, OnInit, OnChanges, Input, ViewChild, SimpleChanges, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

import { MyLibraryService, ContentManagerService, CourseCreationService } from '../../../../services';
import {
  CourseBasicInfo,
  FilterConfig,
  LibraryQuestion,
  Page,
  Question,
  QuesSearchFilterData,
  Sort,
  Course,
  Subject,
  SubjectIndex,
} from '../../../../../_models';
import { ConfirmModalConfig } from '../../../../../shared/directives/confirm.directive';
import { AddQuestionComponent } from '../../../add-question/add-question.component';
import { QuestionEditComponent } from '../../../../shared/components';
import { CsvUploadQuestionComponent } from './../../../csv-upload-question/csv-upload-question.component';
import { BulkUploadQuestionsComponent } from './../bulk-upload-questions/bulk-upload-questions.component';

@Component({
  selector: 'pdg-course-ques-tab',
  templateUrl: './course-ques-tab.component.html',
  styleUrls: ['./course-ques-tab.component.scss']
})
export class CourseQuesTabComponent implements OnInit, OnChanges {
  @Input() course: Course;
  @Input() subject: Subject;
  @Input() index: SubjectIndex;

  @ViewChild('quesTable') quesTable: any;
  @ViewChild('fileSelect') fileSelect: ElementRef;
  data: Array<Question>;
  questions: Array<any>;

  page: Page = {};
  sort: Sort = {};
  quesSearchFilterData: QuesSearchFilterData = {};

  public removeMappingConfirm: ConfirmModalConfig;

  constructor(private modalService: NgbModal,
    private libraryService: MyLibraryService,
    private contentManager: ContentManagerService,
    private courseCreator: CourseCreationService,
    private notifyService: NotificationsService,
    private translator: TranslateService) {

    this.removeMappingConfirm = {
      title: this.translator.instant('REMOVE_CONTENT_CONFIRM_TITLE'),
      text: this.translator.instant('REMOVE_CONTENT_CONFIRM_TEXT')
    };
    this.page.number = 0;
    this.page.size = 50;
    this.page.totalElements = 0;

    // These are DB properties, so need to add them into translation strings.
    this.sort.sortOn = 'createdDate';
    this.sort.order = 'asc';

    this.quesSearchFilterData.status = 'publish|draft';
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setPage({ offset: 0 });
  }

  /**
   * Callback function invoked when user clicks on page numbers
   * @param {any} pageInfo
   */
  setPage(pageInfo) {
    this.page.number = pageInfo.offset;
    this.getQuestions(this.page, this.sort, this.quesSearchFilterData);
  }

  /**
   * Callback function invoked when user clicks to sort on Title Column
   * @param {any} event
   */
  onSort(event) {
    this.sort.order = event.sorts[0].dir;
    this.sort.sortOn = event.sorts[0].prop;
    this.setPage({ offset: 0 });
  }

  toggleExpandRow(row) {
    this.quesTable.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {

  }

  /**
   * Method invoked when user wants to search some items using search bar.
   * @param {any} searchText Search String
   */
  search(searchText) {
    this.quesSearchFilterData.question = searchText;
    this.setPage({ offset: 0 });
  }

  /**
     * Method to get Questions using Service API Call
     *
     * @param {Page} page
     * @param {Sort} sort
     * @param {QuesSearchFilterData} quesSearchFilterData
     */
  getQuestions(page: Page, sort: Sort, quesSearchFilterData: QuesSearchFilterData) {
    this.quesSearchFilterData.courses = [];
    const obj = {
      'mappingId': this.course.id,
      'subjectid': this.subject.id,
      'indexid': this.index.indexId
    };
    this.quesSearchFilterData.courses.push(obj);
    this.libraryService.getQuestions(page, sort, quesSearchFilterData).subscribe((response: LibraryQuestion) => {
      this.questions = [];

      if (response.numberOfElements === 0 && response.totalElements !== 0) {
        this.setPage({ offset: response.number - 1 });

      } else {
        this.data = response.content;
        this.page.totalElements = response.totalElements;
        this.page.totalPages = response.totalPages;
        this.page.number = response.number;
        this.page.size = response.size;
        response.content.forEach(element => {
          const obj1 = {
            'id': element.id,
            'type': element.type,
            'question': element.question,
            'difficulty': element.difficultyLevel,
            'published': element.status,
            'updated': element.lastModifiedDate,
            'choices': element.choices,
            'rightAnswers': element.rightAnswers,
            'purpose': element.purpose
          };
          this.questions.push(obj1);
        });

      }

    }, error => {

    });
  }

  /**
   * Method to open Add Question Modal from Index Page
   */
  openAddQuestionForm() {
    const modalRef = this.modalService.open(AddQuestionComponent, { size: 'lg', keyboard: false, backdrop: 'static' });
    modalRef.componentInstance.courseId = this.course.id;
    modalRef.componentInstance.subjectId = this.subject.id;
    modalRef.componentInstance.indexId = this.index.indexId;

    modalRef.result.then(
      (result) => {
        this.getQuestions(this.page, this.sort, this.quesSearchFilterData);

      }, (close) => {
        this.getQuestions(this.page, this.sort, this.quesSearchFilterData);
      });
  }


  /**
   * Method invoked on Delete button confirm dialog confirm button
   * @param {*} item Item to be deleted
   */
  delete(item: any) {
    const mappingObj = {
      courseId: this.course.id,
      subjectId: this.subject.id,
      indexId: this.index.indexId,
      contentId: item.id,
      contentType: 'QUESTION'
    };

    this.contentManager.deleteContentMapping(mappingObj).subscribe(response => {
      this.notifyService.success(this.translator.instant('REMOVE_MAPPING_SUCCESS'));
      this.getQuestions(this.page, this.sort, this.quesSearchFilterData);
    }, (error: HttpErrorResponse) => {
      this.notifyService.error(this.translator.instant('REMOVE_MAPPING_FAILED'), '', {
        clickToClose: false
      });
    });
  }

  openEditModal(item) {
    const index = this.data.findIndex(content => content.id === item.id);
    const modalRef = this.modalService.open(QuestionEditComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.question = this.data[index];

    modalRef.result.then(result => {
      this.getQuestions(this.page, this.sort, this.quesSearchFilterData);

    }, (close) => {
      this.getQuestions(this.page, this.sort, this.quesSearchFilterData);
    });
  }

  openBulkUploadDialog() {
    const modalRef = this.modalService.open(BulkUploadQuestionsComponent, { size: 'lg', keyboard: false, backdrop: 'static' });
    modalRef.componentInstance.courseId = this.course.id;
    modalRef.componentInstance.subjectId = this.subject.id;
    modalRef.componentInstance.indexId = this.index.indexId;
    modalRef.result.then(result => {
      this.getQuestions(this.page, this.sort, this.quesSearchFilterData);
    }, (error) => {
      this.getQuestions(this.page, this.sort, this.quesSearchFilterData);
    });
  }


}

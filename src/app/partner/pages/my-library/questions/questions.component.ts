import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { CourseManagerService, MyLibraryService } from '../../../services';
import { CourseBasicInfo, FilterConfig, LibraryQuestion, Page, Question, QuesSearchFilterData, Sort } from '../../../../_models';
import { ConfirmModalConfig } from '../../../../shared/directives/confirm.directive';
import { QuestionEditComponent } from '../../../shared/components';

/**
 * Component Class for My Library Questions Tab.
 *
 * @export
 * @class QuestionsComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'pdg-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {
  @ViewChild('quesTable') quesTable: any;
  data: Array<Question>;
  questions: Array<any>;

  page: Page = {};
  sort: Sort = {};
  quesSearchFilterData: QuesSearchFilterData = {};

  options: ConfirmModalConfig = {
    title: this.translator.instant('DELETE_QUES_CONFIRM_TITLE'),
    text: this.translator.instant('DELETE_QUES_CONFIRM_TEXT')
  };

  courseFilterArray: Array<FilterConfig> = [];
  statusFilterArray: Array<FilterConfig> = [];

  selectedAllCourse = true;
  selectedAllStatus = true;

  /**
   * Creates an instance of QuestionsComponent.
   * @param {CourseManagerService} courseManager
   * @param {MyLibraryService} libraryService
   * @param {NotificationsService} notifyService
   * @param {NgbModal} modalService
   * @param {TranslateService} translator
   */
  constructor(private courseManager: CourseManagerService,
    private libraryService: MyLibraryService,
    private notifyService: NotificationsService,
    private modalService: NgbModal,
    private translator: TranslateService) {
    this.page.number = 0;
    this.page.size = 10;
    this.page.totalElements = 0;
    this.quesSearchFilterData.courses = [];

    // These are DB properties, so need to add them into translation strings.
    this.sort.sortOn = 'lastModifiedDate';
    this.sort.order = 'desc';

    this.quesSearchFilterData.status = 'publish|draft';

    this.statusFilterArray = [
      { name: 'Published', value: 'publish', selected: true },
      { name: 'Draft', value: 'draft', selected: true }
    ];

    // Adding blank to the course filter array
    this.courseFilterArray.push({
      name: `( ${this.translator.instant('BLANK')} )`,
      value: '',
      selected: true
    });

    this.quesSearchFilterData.courses.push({
      'mappingId': ''
    });
  }

  ngOnInit() {
    this.getCourseList();
  }

  /**
   * Method to get Course Name List to be displayed in Course Filter drop down.
   */
  getCourseList() {
    this.courseManager.getCourseList().subscribe((courseList: CourseBasicInfo[]) => {
      courseList.forEach(course => {
        const obj = {
          'mappingId': course.id
        };
        // Adding course names to search filter data courses array
        this.quesSearchFilterData.courses.push(obj);

        const filterConfig: FilterConfig = {};
        filterConfig.name = course.courseName;
        filterConfig.value = course.id;
        filterConfig.selected = true;
        this.courseFilterArray.push(filterConfig);
      });

      this.setPage({ offset: 0 });

    }, (error: HttpErrorResponse) => {

    });
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
   * Method to get Questions using Service API Call
   *
   * @param {Page} page
   * @param {Sort} sort
   * @param {QuesSearchFilterData} quesSearchFilterData
   */
  getQuestions(page: Page, sort: Sort, quesSearchFilterData: QuesSearchFilterData) {
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
          let courses = [];
          element.courses.forEach(course => {
            courses.push(course.mappingName);
          });
          courses = Array.from(new Set(courses));
          const obj = {
            'id': element.id,
            'type': element.type,
            'question': element.question,
            'difficulty': element.difficultyLevel,
            'courses': courses,
            'published': element.status,
            'updated': element.lastModifiedDate,
            'choices': element.choices,
            'rightAnswers': element.rightAnswers,
            'pastExams': element.pastExams,
            'explanation': element.explanation,
            'purpose': element.purpose
          };
          this.questions.push(obj);
        });
      }

    }, error => {

    });
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

  /**
   * Update Filter invoked when user filters by Status
   */
  updateStatusFilter() {
    this.quesSearchFilterData.status = '';
    const deselectAll = this.statusFilterArray.every(function (item: any) {
      return item.selected === false;
    });

    this.selectedAllStatus = this.statusFilterArray.every(function (item: any) {
      return item.selected === true;
    });

    const tempArray: Array<string> = [];
    if (!deselectAll) {
      this.statusFilterArray.forEach(element => {
        if (element.selected) {
          tempArray.push(element.value);
        }
      });
      this.quesSearchFilterData.status = tempArray.join('|');

    } else {
      this.statusFilterArray.forEach(element => {
        tempArray.push(element.value);
      });
      this.quesSearchFilterData.status = tempArray.join('|');
    }
    this.setPage({ offset: 0 });
  }

  /**
   * Method invoked when user selects/deselects all on status Filter
   */
  selectAllStatus() {
    this.statusFilterArray.forEach(element => {
      element.selected = this.selectedAllStatus;
    });

    const tempArray: Array<string> = [];
    this.statusFilterArray.forEach(element => {
      tempArray.push(element.value);
    });
    this.quesSearchFilterData.status = tempArray.join('|');

    this.setPage({ offset: 0 });
  }

  /**
   * Update Filter invoked when user filters by Course
   */
  updateCourseFilter() {
    const deselectAll = this.courseFilterArray.every(function (item: any) {
      return item.selected === false;
    });

    this.selectedAllCourse = this.courseFilterArray.every(function (item: any) {
      return item.selected === true;
    });

    this.quesSearchFilterData.courses = [];

    if (!deselectAll) {
      const tempArray: Array<any> = [];
      this.courseFilterArray.forEach(element => {
        if (element.selected) {
          const obj = {
            'mappingId': element.value
          };
          tempArray.push(obj);
        }
      });
      this.quesSearchFilterData.courses = tempArray;
    }
    this.setPage({ offset: 0 });
  }

  /**
   * Method invoked when user selects/deselects all on course Filter
   */
  selectAllCourse() {
    this.courseFilterArray.forEach(element => {
      element.selected = this.selectedAllCourse;
    });

    if (this.selectedAllCourse) {
      this.courseFilterArray.forEach(element => {
        const obj = {
          'mappingId': element.value
        };
        this.quesSearchFilterData.courses.push(obj);
      });

    } else {
      this.quesSearchFilterData.courses = [];
    }
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
   * Method invoked on Delete button confirm dialog confirm button
   * @param {*} item Item to be deleted
   */
  delete(item: any) {
    this.libraryService.deleteQuestion(item.id).subscribe(response => {
      this.notifyService.success(this.translator.instant('DELETE_QUES_SUCCESS'));
      this.getQuestions(this.page, this.sort, this.quesSearchFilterData);

    }, (error: HttpErrorResponse) => {
      this.notifyService.error(this.translator.instant('DELETE_QUES_FAILED'), '', {
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
      // Its called when escape key is pressed.
    });
  }
}

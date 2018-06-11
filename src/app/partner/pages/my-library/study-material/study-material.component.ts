import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

import { MyLibraryService, CourseManagerService, ContentManagerService } from '../../../services';
import { LibraryStudyMaterial, Page, Sort, SearchFilterData, StudyMaterial, CourseBasicInfo, FilterConfig } from '../../../../_models';

import { StudyMaterialEditComponent } from '../../../shared/components';
import { ConfirmModalConfig } from '../../../../shared/directives/confirm.directive';

/**
 * Component class for My Library Study Material Tab
 *
 * @export
 * @class StudyMaterialComponent
 * @implements {OnInit}
 * @version 1.0
 * @author
 */
@Component({
  selector: 'pdg-study-material',
  templateUrl: './study-material.component.html',
  styleUrls: ['./study-material.component.scss']
})
export class StudyMaterialComponent implements OnInit {
  data: StudyMaterial[];
  studyMaterial: Array<any>;
  page: Page = {};
  sort: Sort = {};
  searchFilterData: SearchFilterData = {};

  options: ConfirmModalConfig = {
    title: this.translator.instant('DELETE_CONTENT_CONFIRM_TITLE'),
    text: this.translator.instant('DELETE_CONTENT_CONFIRM_TEXT')
  };

  typeFilterArray: Array<any>;
  statusFilterArray: Array<any>;
  courseFilterArray: Array<FilterConfig> = [];

  selectedAllCourse = true;
  selectedAllType = true;
  selectedAllStatus = true;

  /**
   * Creates an instance of StudyMaterialComponent.
   * @param {MyLibraryService} libraryService
   * @param {NgbModal} modalService
   * @param {CourseManagerService} courseManager
   * @param {NotificationsService} notifyService
   * @param {TranslateService} translator
   */
  constructor(
    private libraryService: MyLibraryService,
    private modalService: NgbModal,
    private courseManager: CourseManagerService,
    private contentManager: ContentManagerService,
    private notifyService: NotificationsService,
    private translator: TranslateService) {
    this.page.number = 0;
    this.page.size = 10;
    this.page.totalElements = 0;
    this.searchFilterData.courses = [];

    // These are DB properties, so need to add them into translation strings.
    this.sort.sortOn = 'lastModifiedDate';
    this.sort.order = 'desc';

    this.searchFilterData.type = 'pdf|video|refvideo';
    this.searchFilterData.status = 'publish|draft';

    this.typeFilterArray = [
      { name: 'PDF', value: 'pdf', selected: true },
      { name: 'Video', value: 'video', selected: true },
      { name: 'Youtube', value: 'refvideo', selected: true }
    ];

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

    this.searchFilterData.courses.push({
      'mappingId': ''
    });
  }

  /**
   * Overriddent method invoked when component is loaded.
   */
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
        this.searchFilterData.courses.push(obj);

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
   * Instance method to get Study Material Data
   * @param {Page} libraryPage
   * @param {Sort} librarySort
   * @param {SearchFilterData} searchFilterData
   */
  getStudyMaterial(libraryPage: Page, librarySort: Sort, searchFilterData: SearchFilterData) {
    this.libraryService.getStudyMaterial(libraryPage, librarySort, searchFilterData).subscribe((response: LibraryStudyMaterial) => {
      this.studyMaterial = [];
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
            'id': element._id,
            'type': element.type,
            'title': element.title,
            'description': element.description,
            'courses': courses,
            'updated': element.lastModifiedDate,
            'published': element.status
          };
          this.studyMaterial.push(obj);
        });

      }

    }, (error: HttpErrorResponse) => {

    });
  }

  /**
   * Callback function invoked when user clicks on page numbers
   * @param {any} pageInfo
   */
  setPage(pageInfo) {
    this.page.number = pageInfo.offset;
    this.getStudyMaterial(this.page, this.sort, this.searchFilterData);
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
   * Method invoked on Title Click
   * @param {*} item
   */
  openEditModal(item: any) {
    const index = this.data.findIndex(content => content._id === item.id);
    this.contentManager.getContentUrl(item.id).subscribe((response) => {
      const content = this.data[index];
      content.cdnUrl = response;
      this.openModal(content);

    }, error => {
      this.notifyService.error(this.translator.instant('ACCESS_DENIED'),
        this.translator.instant('UNAUTHORIZED_ACCESS'), { clickToClose: false });
    });
  }

  openModal(content) {
    const modalRef = this.modalService.open(StudyMaterialEditComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.content = content;

    modalRef.result.then(result => {
      this.getStudyMaterial(this.page, this.sort, this.searchFilterData);

    }, (close) => {
      this.getStudyMaterial(this.page, this.sort, this.searchFilterData);
    });
  }

  /**
   * Method invoked on Delete button confirm dialog confirm button
   * @param {*} item Item to be deleted
   */
  delete(item: any) {
    this.libraryService.deleteStudyMaterial(item.id).subscribe(response => {
      this.notifyService.success(this.translator.instant('DELETE_CONTENT_SUCCESS'));
      this.getStudyMaterial(this.page, this.sort, this.searchFilterData);

    }, (error: HttpErrorResponse) => {
      this.notifyService.error(this.translator.instant('DELETE_CONTENT_FAILED'), '', {
        clickToClose: false
      });
    });
  }

  /**
   * Method invoked when user wants to search some items using search bar.
   * @param {any} searchText Search String
   */
  search(searchText) {
    this.searchFilterData.title = searchText;
    this.setPage({ offset: 0 });
  }

  /**
   * Update Filter invoked when user filters by Type
   */
  updateTypeFilter() {
    this.searchFilterData.type = '';
    const deselectAll = this.typeFilterArray.every(function (item: any) {
      return item.selected === false;
    });

    this.selectedAllType = this.typeFilterArray.every(function (item: any) {
      return item.selected === true;
    });
    const tempArray: Array<string> = [];

    if (!deselectAll) {
      this.typeFilterArray.forEach(element => {
        if (element.selected) {
          tempArray.push(element.value);
        }
      });
      this.searchFilterData.type = tempArray.join('|');

    } else {
      this.typeFilterArray.forEach(element => {
        tempArray.push(element.value);
      });
      this.searchFilterData.type = tempArray.join('|');
    }
    this.setPage({ offset: 0 });
  }

  /**
   * Method invoked when user selects/deselects all on type Filter
   */
  selectAllType() {
    this.typeFilterArray.forEach(element => {
      element.selected = this.selectedAllType;
    });

    const tempArray: Array<string> = [];
    this.typeFilterArray.forEach(element => {
      tempArray.push(element.value);
    });
    this.searchFilterData.type = tempArray.join('|');

    this.setPage({ offset: 0 });
  }

  /**
   * Update Filter invoked when user filters by Status
   */
  updateStatusFilter() {
    this.searchFilterData.status = '';
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
      this.searchFilterData.status = tempArray.join('|');

    } else {
      this.statusFilterArray.forEach(element => {
        tempArray.push(element.value);
      });
      this.searchFilterData.status = tempArray.join('|');
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
    this.searchFilterData.status = tempArray.join('|');

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
      this.searchFilterData.courses = tempArray;

    } else {
      this.searchFilterData.courses = [];
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
        this.searchFilterData.courses.push(obj);
      });

    } else {
      this.searchFilterData.courses = [];
    }
    this.setPage({ offset: 0 });
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Course, Subject, SubjectIndex, UploadContentEvent, UploadEventType } from '../../../../_models';
import { CourseCreationService, UploadContentService } from '../../../services';

@Component({
  selector: 'pdg-course-index-sidebar',
  templateUrl: './course-index-sidebar.component.html',
  styleUrls: ['./course-index-sidebar.component.scss']
})
export class CourseIndexSidebarComponent implements OnInit {
  /**
   * Course object
   *
   * @public
   * @type {Course}
   * @memberof CourseIndexSidebarComponent
   */
  public course: Course;

  /**
   * Array of subjects of selected course
   *
   * @public
   * @type {Subject[]}
   * @memberof CourseIndexSidebarComponent
   */
  public subjects: Subject[];

  /**
   * Subject index array
   *
   * @public
   * @type {SubjectIndex[]}
   * @memberof CourseIndexSidebarComponent
   */
  public indexes: SubjectIndex[];

  /**
   * Currently selected subject
   *
   * @public
   * @type {Subject}
   * @memberof CourseIndexSidebarComponent
   */
  public selectedSubject: Subject;

  /**
   * Total videos and books
   *
   * @public
   * @type {any}
   */
  public total: any;

  /**
   * Currently selected index
   *
   * @private
   * @type {SubjectIndex}
   * @memberof CourseIndexSidebarComponent
   */
  private selectedIndex: SubjectIndex;

  /**
   * This holds opened subject indexes' state.
   * 1. This does not maintain state while switching to different subjects
   * 2. This is initialized with default value when a new subject is selected
   *
   * @private
   * @type {{ isCollapsed: boolean }[]}
   * @memberof CourseIndexSidebarComponent
   */
  private selectedIndexOpenState: { isCollapsed: boolean }[];

  private _sSubjectIndex = 0;
  private _sIndexId;

  constructor(
    private courseCreator: CourseCreationService,
    private uploadService: UploadContentService
  ) {
    this.indexes = [];
    this.selectedIndexOpenState = [];
  }

  ngOnInit() {
    this.course = this.courseCreator.course;

    this.courseCreator.subjects.subscribe((subjects) => {
      this.subjects = subjects;
      this.courseCreator.selectSubject(this.subjects[this._sSubjectIndex]);
    });

    this.courseCreator.selectedSubject.subscribe((subject: Subject) => {
      if ((this.selectedSubject && this.selectedSubject.id !== subject.id) || this.selectedSubject === undefined) {
        this._sSubjectIndex = this.subjects.findIndex((sIndex) => {
          return subject.id === sIndex.id;
        });
        this.refreshOpenState(subject.indexes);
      }
      this.changeIndex(subject.indexes);
      this.selectedSubject = subject;
      this.total = (<any>subject).total;
    });

    this.courseCreator.selectedSubjectIndex.subscribe((index: SubjectIndex) => {
      this.selectedIndex = index;
    });

    this.uploadService.contentUploadEventQueue.subscribe((event: UploadContentEvent) => {
      if (event.type === UploadEventType.ITEM_COMPLETE) {
        if (
          event.content.course.id === this.course.id &&
          event.content.subject.id === this.selectedSubject.id
        ) {
          this.courseCreator.refresh();
        }
      }
    });

  }

  refreshOpenState(sIndexes: SubjectIndex[]) {
    this.selectedIndexOpenState = [];
    this._sIndexId = null;
    const setCollapseState = (indexItem, state) => {
      let iState = null;
      if (indexItem.children) {
        iState = { isCollapsed: true, children: [] };
        indexItem.children.forEach((iIndexItem) => {
          iState.children.push(setCollapseState(iIndexItem, iState));
        });
      }
      return iState;
    };

    sIndexes.forEach((indexItem) => {
      const iState = setCollapseState(indexItem, null);
      this.selectedIndexOpenState.push(iState);
    });
  }

  changeIndex(sIndexes: SubjectIndex[]) {
    this.indexes = sIndexes;
    let indexSelection = null;
    let location = [];
    const findIndex = (index: SubjectIndex, level, i) => {
      location[level] = i;
      if (this._sIndexId === index.indexId) {
        indexSelection = index;
        return false;
      } else if (index.children) {
        level++;
        index.children.every((aIndex, j) => {
          return findIndex(aIndex, level, j);
        });
      }
      return true;
    };

    if (this._sIndexId) {
      this.indexes.every((index, i) => {
        location = [];
        findIndex(index, 0, i);
        if (indexSelection) {
          return false;
        }
        return true;
      });
    } else {
      indexSelection = this.indexes[0];
      location = [0];
    }
    this.selectIndex(indexSelection, location, false);
  }

  selectSubject(subject: Subject) {
    this.courseCreator.selectSubject(subject);
  }

  selectIndex(indexItem: SubjectIndex, locationArr: Array<number>, isUserInteraction: boolean) {
    if (isUserInteraction) {
      let iState = null;
      let sArr = this.selectedIndexOpenState;
      locationArr.forEach((iLocation, i, lArr) => {
        iState = sArr[iLocation];
        if (iState && iState.children) {
          sArr = iState.children;
        }
      });

      if (iState) {
        iState.isCollapsed = !iState.isCollapsed;
      }
    }

    this._sIndexId = indexItem.indexId;
    this.courseCreator.selectIndex(indexItem);
  }

  private getDecoration(value: any) {

    let klass = 'fa ';
    if (value === null) {
      klass += 'fa-stop bullet';
    } else if (value) {
      klass += 'fa-chevron-right';
    } else {
      klass += 'fa-chevron-down';
    }

    return klass;
  }

}

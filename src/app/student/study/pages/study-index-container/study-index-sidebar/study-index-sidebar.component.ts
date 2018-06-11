import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Course, Subject, SubjectIndex, UploadContentEvent, UploadEventType } from '../../../../../_models';
import { CourseIndexCreatorService } from '../../../../shared/services';

/**
 * Student Study index sidebar component class
 *
 * @export
 * @class StudyIndexSidebarComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'pdg-study-index-sidebar',
  templateUrl: './study-index-sidebar.component.html',
  styleUrls: ['./study-index-sidebar.component.scss']
})
export class StudyIndexSidebarComponent implements OnInit {

  /**
    * Selected Course object
    * @public
    * @type {Course}
    */
  public course: Course;

  /**
   * Array of subjects of selected course
   * @public
   * @type {Subject[]}
   */
  public subjects: Subject[];

  /**
   * Subject index array
   * @public
   * @type {SubjectIndex[]}
   */
  public indexes: SubjectIndex[];

  /**
   * Currently selected subject
   * @public
   * @type {Subject}
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
   * @private
   * @type {SubjectIndex}
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

  /**
   * Creates an instance of StudyIndexSidebarComponent.
   * @param {CourseIndexCreatorService} courseIndexCreator
   * @param {Router} router
   */
  constructor(
    private courseIndexCreator: CourseIndexCreatorService,
    private router: Router
  ) {
    this.indexes = [];
    this.selectedIndexOpenState = [];
  }

  ngOnInit() {
    this.course = this.courseIndexCreator.course;


    /**
     * Subscribe to subject change.
     * when subject is changed need to update the subject index
     */
    this.courseIndexCreator.subjects.subscribe((subjects) => {
      this.subjects = subjects;

      if (this.courseIndexCreator.redirectSubjectId) {
        this._sSubjectIndex = this.subjects.findIndex(subject => subject.id === this.courseIndexCreator.redirectSubjectId);
      }
      this.courseIndexCreator.selectSubject(this.subjects[this._sSubjectIndex]);
    });

    this.courseIndexCreator.selectedSubject.subscribe((subject: Subject) => {
      if ((this.selectedSubject && this.selectedSubject.id !== subject.id) || this.selectedSubject === undefined) {
        this._sSubjectIndex = this.subjects.findIndex((sIndex) => {
          return subject.id === sIndex.id;
        });
        this.refreshOpenState(subject.indexes);
        this._sIndexId = this.courseIndexCreator.redirectIndexId;
        this.changeIndex(subject.indexes);
        this.selectedSubject = subject;
        this.total = (<any>subject).total;
      }
    });

    /**
     * Index change subsription
     * On index change load the contents mapped to that index
     */
    this.courseIndexCreator.selectedSubjectIndex.subscribe((index: SubjectIndex) => {
      this.selectedIndex = index;
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
      } else if (index.children) {
        level++;
        for (let j = 0; j < index.children.length; j++) {
          findIndex(index.children[j], level, j);
          if (indexSelection) {
            break;
          }
        }
        level--;
      }
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
    }

    indexSelection = indexSelection || this.indexes[0];
    location = location.length > 0 ? location : [0];

    this.toggleCollapse(indexSelection, location, null);
    this.selectIndex(indexSelection, location, true);
  }

  selectSubject(subject: Subject) {
    this.courseIndexCreator.selectSubject(subject);
  }

  toggleCollapse(indexItem: SubjectIndex, locationArr: Array<number>, event: Event) {
    let iState = null;
    let sArr = this.selectedIndexOpenState;

    locationArr.forEach((iLocation, i, lArr) => {
      iState = sArr[iLocation];
      if (iState && iState.children) {
        if (!event) {
          iState.isCollapsed = false;
        }
        sArr = iState.children;
      }
    });

    if (iState) {
      iState.isCollapsed = !iState.isCollapsed;
    }

    if (event) {
      event.stopPropagation();
    }
  }

  selectIndex(indexItem: SubjectIndex, locationArr: Array<number>, isUserInteraction: boolean) {
    this._sIndexId = indexItem.indexId;
    this.courseIndexCreator.selectIndex(indexItem);
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

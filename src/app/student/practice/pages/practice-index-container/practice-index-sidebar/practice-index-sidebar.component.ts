import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Course, Subject, SubjectIndex, UploadContentEvent, UploadEventType } from '../../../../../_models';
import { CourseIndexCreatorService } from '../../../../shared/services';

@Component({
  selector: 'pdg-practice-index-sidebar',
  templateUrl: './practice-index-sidebar.component.html',
  styleUrls: ['./practice-index-sidebar.component.scss']
})
export class PracticeIndexSidebarComponent implements OnInit {
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
  public indexes: any[];

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
      this.courseIndexCreator.selectSubject(this.subjects[this._sSubjectIndex]);
    });

    this.courseIndexCreator.selectedSubject.subscribe((subject: Subject) => {
      if ((this.selectedSubject && this.selectedSubject.id !== subject.id) || this.selectedSubject === undefined) {
        this._sSubjectIndex = this.subjects.findIndex((sIndex) => {
          return subject.id === sIndex.id;
        });
        this.refreshOpenState(subject.indexes);
      }
      this.changeIndex(subject.indexes);
      this.selectedSubject = subject;
      this.total = (<any>subject).total;
      this.courseIndexCreator.setCheckedIndexes(this.indexes);
      for (let i = 0; i < this.indexes.length; i++) {
        this.indexes[i].selected = false;
        this.updateIndexSelection(this.indexes[i], [i]);
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
    this.courseIndexCreator.selectSubject(subject);
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
    this.selectedIndex = indexItem;
    // this.courseIndexCreator.selectIndex(indexItem);
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

  updateIndexSelection(index, locationArr: Array<number>) {
    index.selected = !index.selected;
    if (index.children) {
      index.children.forEach(ndxElem => {
        ndxElem.selected = index.selected;

        if (ndxElem.children) {
          ndxElem.children.forEach(ndxElem2 => {
            ndxElem2.selected = index.selected;
          });
        }
      });
    }

    // Selecting second level index item
    if (locationArr.length === 2) {
      this.updateParentIndexSelectionState(this.indexes[locationArr[0]]);
    }

    if (locationArr.length === 3) {
      this.updateParentIndexSelectionState(this.indexes[locationArr[0]].children[locationArr[1]]);
      this.updateParentIndexSelectionState(this.indexes[locationArr[0]]);
    }

    this.courseIndexCreator.setCheckedIndexes(this.indexes);
  }

  updateParentIndexSelectionState(indexes: any) {
    const selectedItems = indexes.children.filter(item => item.selected === true);
    const partialSelectedItems = indexes.children.filter(item => item.selected === null);

    // If all children are selected, then make parent selected
    if (selectedItems.length === indexes.children.length) {
      indexes.selected = true;

      // If all are unselected, then make parent unselected
    } else if (selectedItems.length === 0 && partialSelectedItems.length === 0) {
      indexes.selected = false;

      // Set Indeterminate state
    } else {
      indexes.selected = null;
    }
  }
}

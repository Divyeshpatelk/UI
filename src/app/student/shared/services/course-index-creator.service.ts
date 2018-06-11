import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Course, Subject, SubjectIndex, Content, BrandingInfo } from '../../../_models';
import { CourseManagerService } from './course-manager.service';

/**
 * Student Course Index Creator Service
 * This service is responsible for fetching details,
 * when subject and index is selected from sidebar
 *
 * @export
 * @class CourseIndexCreatorService
 */
@Injectable()
export class CourseIndexCreatorService {

  /**
   * Course selected
   * @type {Course}
   */
  public course: Course;

  /**
   * Observable Object Of Subjects
   * @type {BehaviorSubject<Subject[]>}
   */
  public subjects: BehaviorSubject<Subject[]>;

  /**
   * Observable Object Of brandinglogo
   * @type {BrandingInfo}
   */
  public brandinginfo: BrandingInfo;

  /**
   * Observable Object of Selected Subject
   * @type {BehaviorSubject<Subject>}
   */
  public selectedSubject: BehaviorSubject<Subject>;

  /**
   * Observable of Selected Subject Index
   * @type {BehaviorSubject<SubjectIndex>}
   */
  public selectedSubjectIndex: BehaviorSubject<SubjectIndex>;

  /**
   * Observable Object of Selected Indexes Array
   * @type {BehaviorSubject<SubjectIndex[]>}
   */
  public selectedIndexes: BehaviorSubject<SubjectIndex[]>;

  public selectedContent: BehaviorSubject<Content>;

  public redirectSubjectId: string;

  public redirectIndexId: string;

  /**
   * Array Of Subjects
   *
   * @private
   * @type {Subject[]}
   */
  private _subjects: Subject[];

  /**
   * Array Of Contents Mapped to Index Item
   *
   * @private
   * @type {Content[]}
   */
  private _indexContents: Content[];

  /**
   * Creates an instance of CourseIndexCreatorService.
   * @param {CourseManagerService} courseManager
   */
  constructor(private courseManager: CourseManagerService) {
    this.subjects = new BehaviorSubject<Subject[]>(null);
    this.selectedSubject = new BehaviorSubject<Subject>(null);
    this.selectedSubjectIndex = new BehaviorSubject<SubjectIndex>(null);
    this.selectedIndexes = new BehaviorSubject<SubjectIndex[]>(null);
    this.selectedContent = new BehaviorSubject<Content>(null);
  }

  /**
   * This method is invoked whenever index page needs to be refreshed.
   * This method will call GetCourseDetails API to get the refreshed data
   */
  public refresh() {
    this.courseManager.getCourseDetails(this.course.id).subscribe((courseDetail: {
      'course': Course, subjects: Subject[], 'brandinginfo': BrandingInfo
    }) => {
      this.setup(courseDetail, {});
    });
  }

  /**
   * This method initializes the course, selected subject and selected subject index.
   * @param {{ 'course': Course, 'subjects': Subject[] }} courseDetail
   */
  public setup(courseDetail: { 'course': Course, 'subjects': Subject[], 'brandinginfo': BrandingInfo }, params: any) {
    this.course = courseDetail.course;
    this.brandinginfo = courseDetail.brandinginfo;

    if (Object.keys(params).length !== 0) {
      this.redirectSubjectId = params.subject;
      this.redirectIndexId = params.index;
    }

    // Initializing Subjects
    this._subjects = courseDetail.subjects.map((subject: Subject) => {
      const unflattenedIndex = this.unflatten(subject.indexes, '0');
      this.calculateContentCount(unflattenedIndex);
      subject.indexes = unflattenedIndex;
      this.calculateTotalCount(subject);
      return subject;
    });
    this.subjects.next(this._subjects);
  }

  /**
   * Method invoked when User changes Subject from Index Page (Partner / student) Module
   * @param {Subject} subject Selected Subject
   */
  public selectSubject(subject: Subject) {
    this.selectedSubject.next(subject);
  }

  /**
   * Method invoked when user selects any index item from Index Page
   * @param {SubjectIndex} index Selected SubjectIndex
   */
  public selectIndex(index: SubjectIndex) {
    this.selectedSubjectIndex.next(index);
  }

  public selectContent(content: Content) {
    this.selectedContent.next(content);
  }

  /**
   * This method creates the model from Service API (GetCourseDetails) response.
   * This API returs the Subject and its indexes.
   *
   * @private
   * @param {any} subjectArr
   * @param {any} parentId
   * @returns
   */
  private unflatten(subjectArr, parentId) {
    const superArr = subjectArr.filter((item) => item.parentId === parentId);
    const subArr = subjectArr.filter((item) => item.parentId !== parentId);

    superArr.forEach((element) => {
      const indexId = element.indexId;
      const children = this.unflatten(subArr, indexId);
      if (children.length > 0) {
        element.children = children;
      }
    });
    return superArr;
  }

  /**
   * This method set the contents mapped to the index item.
   * @param {Content[]} contents Content Array
   */
  public setIndexContents(contents: Content[]) {
    this._indexContents = contents;
  }

  /**
   * Getter method for Index Contents
   * @returns Array of Index Content
   */
  public getIndexContents() {
    return this._indexContents;
  }

  /**
   * This method calculates the content count on each index node.
   * @param {any} subjectIndex Subject Index Node
   */
  calculateContentCount(subjectIndex) {
    subjectIndex.forEach((index) => {
      const initialCount = {
        videos: 0,
        books: 0,
        questions: 0
      };

      if (index.contentUnitCount) {
        const contentUnitCount = index.contentUnitCount;

        if (contentUnitCount.videos) {
          initialCount.videos = contentUnitCount.videos;
        }

        if (contentUnitCount.books) {
          initialCount.books = contentUnitCount.books;
        }

        if (contentUnitCount.questions) {
          initialCount.questions = contentUnitCount.questions;
        }
      }

      if (index.children && index.children.length > 0) {
        this.calculateContentCount(index.children);

        index.accumulatedCount = index.children.reduce((count, currentValue, currentIndex, array) => {
          return {
            videos: count.videos + currentValue.accumulatedCount.videos,
            books: count.books + currentValue.accumulatedCount.books,
            questions: count.questions + currentValue.accumulatedCount.questions
          };
        }, initialCount);

      } else {
        index.accumulatedCount = initialCount;
      }
    });
  }

  /**
   * This method calculates the accumulated count for index items that are at higher level in index hierarchy
   * @param {any} subject Subject for which accumulated count needs to calculated
   */
  calculateTotalCount(subject) {
    const initialCount = {
      videos: 0,
      books: 0,
      questions: 0
    };
    subject.total = subject.indexes.reduce((count, currentValue) => {
      return {
        videos: count.videos + currentValue.accumulatedCount.videos,
        books: count.books + currentValue.accumulatedCount.books,
        questions: count.questions + currentValue.accumulatedCount.questions
      };
    }, initialCount);
  }

  /**
   * This method creates an array of Selected Index items for Student Practice Module.
   * @param indexes List of SubjectIndexes
   */
  setCheckedIndexes(indexes) {
    const selectedindexes = Array<any>();
    indexes.forEach(index => {

      if (index.children) {
        index.children.forEach(index2 => {

          if (index2.children) {
            index2.children.forEach(index3 => {

              if (index3.selected && index3.contentUnitCount) {
                selectedindexes.push(index3);
              }
            });
          }

          if (index2.selected && index2.contentUnitCount) {
            selectedindexes.push(index2);
          }
        });
      }
      if (index.selected && index.contentUnitCount) {
        selectedindexes.push(index);
      }
    });

    this.selectedIndexes.next(selectedindexes);
  }
}

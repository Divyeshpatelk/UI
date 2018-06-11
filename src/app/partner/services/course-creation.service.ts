import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Course, Subject, SubjectIndex } from '../../_models';
import { CourseManagerService } from './course-manager.service';

@Injectable()
export class CourseCreationService {

  public course: Course;
  public subjects: BehaviorSubject<Subject[]>;
  public selectedSubject: BehaviorSubject<Subject>;
  // public subjectIndexes: BehaviorSubject<SubjectIndex[]>;
  public selectedSubjectIndex: BehaviorSubject<SubjectIndex>;

  private _subjects: Subject[];

  constructor(private courseManager: CourseManagerService) {
    this.subjects = new BehaviorSubject<Subject[]>(null);
    this.selectedSubject = new BehaviorSubject<Subject>(null);
    this.selectedSubjectIndex = new BehaviorSubject<SubjectIndex>(null);
  }

  public refresh() {
    this.courseManager.getCourseDetails(this.course.id).subscribe((courseDetail: { 'course': Course, subjects: Subject[] }) => {
      this.setup(courseDetail);
    });
  }

  public setup(courseDetail: { 'course': Course, 'subjects': Subject[] }) {
    this.course = courseDetail.course;
    this._subjects = courseDetail.subjects.map((subject: Subject) => {
      const unflattenedIndex = this.unflatten(subject.indexes, '0');
      this.calculateContentCount(unflattenedIndex);
      subject.indexes = unflattenedIndex;
      this.calculateTotalCount(subject);
      return subject;
    });
    this.subjects.next(this._subjects);
  }

  public selectSubject(subject: Subject) {
    this.selectedSubject.next(subject);
  }

  public selectIndex(index: SubjectIndex) {
    this.selectedSubjectIndex.next(index);
  }

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

        if (contentUnitCount.questionCount) {
          initialCount.questions = contentUnitCount.questionCount;
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
        questions: count.books + currentValue.accumulatedCount.questions
      };
    }, initialCount);
  }
}

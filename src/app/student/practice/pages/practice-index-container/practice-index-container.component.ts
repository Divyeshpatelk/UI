import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Course, Subject, SubjectIndex, BrandingInfo } from '../../../../_models';
import { CourseIndexCreatorService, CourseSelectorService } from '../../../shared/services';

@Component({
  selector: 'pdg-practice-index-container',
  templateUrl: './practice-index-container.component.html',
  styleUrls: ['./practice-index-container.component.scss'],
  providers: [CourseIndexCreatorService]
})
export class PracticeIndexContainerComponent implements OnInit {
  /**
   * Selected Subject
   * @public
   * @type {Subject}
   */
  public subject: Subject;

  public selectedIndexes: SubjectIndex[];

  public selectedQuestionCount = 0;

  /**
   * Creates an instance of StudyIndexContainerComponent.
   * @param {ActivatedRoute} route
   * @param {CourseIndexCreatorService} courseIndexCreator
   */
  constructor(
    private route: ActivatedRoute,
    private courseIndexCreator: CourseIndexCreatorService,
    private courseSelector: CourseSelectorService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: { courseIndex: { course: Course; subjects: Subject[]; brandinginfo: BrandingInfo } }) => {
      this.courseIndexCreator.setup(data.courseIndex, {});
    });

    this.courseIndexCreator.selectedSubject.subscribe((subject: Subject) => {
      this.subject = subject;
      this.selectedQuestionCount = 0;
    });

    this.courseIndexCreator.selectedIndexes.subscribe((subjectIndexes: SubjectIndex[]) => {
      this.selectedIndexes = subjectIndexes;
      if (this.selectedIndexes !== null) {
        this.calculateSelectedCount();
      }
    });
  }

  calculateSelectedCount() {
    this.selectedQuestionCount = 0;
    this.selectedIndexes.forEach((index) => {
      this.selectedQuestionCount += index.contentUnitCount.questions;
    });
  }
}

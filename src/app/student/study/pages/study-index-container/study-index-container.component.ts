import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Course, Subject, SubjectIndex, Content, BrandingInfo } from '../../../../_models';
import { CourseIndexCreatorService } from '../../../shared/services';

/**
 * Student Study Index Page Container Component Class
 *
 * @export
 * @class StudyIndexContainerComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'pdg-study-index-container',
  templateUrl: './study-index-container.component.html',
  styleUrls: ['./study-index-container.component.scss'],
  providers: [CourseIndexCreatorService]
})
export class StudyIndexContainerComponent implements OnInit {
  /**
   * Selected Subject Index
   * @type {SubjectIndex}
   */
  public subjectIndex: SubjectIndex;
  public content: Content;
  makeSidebarActive = false;

  /**
   * Creates an instance of StudyIndexContainerComponent.
   * @param {ActivatedRoute} route ActivatedRoute Instance
   * @param {CourseIndexCreatorService} courseIndexCreator CourseIndexCreatorService Instance
   */
  constructor(private route: ActivatedRoute, private courseIndexCreator: CourseIndexCreatorService) { }

  /**
   * Overridden method invoked when component is loaded.
   */
  ngOnInit() {
    this.route.data.subscribe((data: { courseIndex: { course: Course; subjects: Subject[], brandinginfo: BrandingInfo } }) => {
      this.route.queryParams.subscribe((params) => {
        this.courseIndexCreator.setup(data.courseIndex, params);
      });
    });

    this.courseIndexCreator.selectedSubjectIndex.subscribe((subjectIndex: SubjectIndex) => {
      this.courseIndexCreator.selectContent(null);
      this.subjectIndex = subjectIndex;
    });

    this.courseIndexCreator.selectedContent.subscribe((content: Content) => {
      this.content = content;
      this.makeSidebarActive = false;
    });
  }
}

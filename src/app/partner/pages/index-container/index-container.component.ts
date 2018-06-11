import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Course, Subject } from '../../../_models';
import { CourseManagerService } from '../../services/course-manager.service';
import { CourseCreationService } from '../../services/course-creation.service';

@Component({
  selector: 'pdg-index-container',
  templateUrl: './index-container.component.html',
  styleUrls: ['./index-container.component.scss'],
  providers: [CourseCreationService]
})
export class IndexContainerComponent implements OnInit {
  courseId: string;
  isEditable: boolean;

  constructor(
    private route: ActivatedRoute,
    private courseManager: CourseManagerService,
    private courseCreator: CourseCreationService
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.courseId = params['id'];
    });

    this.route.data.subscribe((data: { courseIndex: { 'course': Course, 'subjects': Subject[] } }) => {
      this.courseCreator.setup(data.courseIndex);
    });

    this.isEditable = this.route.snapshot.data['isEditable'];
  }
}

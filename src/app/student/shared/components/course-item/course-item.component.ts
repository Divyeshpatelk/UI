import { environment } from '../../../../../environments/environment';

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

/**
 * Component class for Course Box shown on My Courses Page. Course Data is passed as an input parameter to this component.
 *
 * @export
 * @class CourseItemComponent
 * @implements {OnInit}
 * @version 1.0
 * @author
 */
@Component({
  selector: 'pdg-course-item',
  templateUrl: './course-item.component.html',
  styleUrls: ['./course-item.component.scss']
})
export class CourseItemComponent implements OnInit {

  public staticContentPath: string;

  /**
   * Course Data as input from MyCourses Component
   */
  @Input() course;

  @Input() selected;

  /**
   * Creates an instance of CourseItemComponent.
   */
  constructor() {
    this.staticContentPath = environment.staticContentPath;
  }

  /**
   * Overridden method invoked when component is loaded
   */
  ngOnInit() {
  }

}

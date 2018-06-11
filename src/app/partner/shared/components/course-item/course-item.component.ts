import { environment } from '../../../../../environments/environment';

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ConfirmModalConfig } from '../../../../shared/directives/confirm.directive';

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

  /**
   * Event triggered when delete button is clicked
   */
  @Output() remove = new EventEmitter();

  /**
   * Options for Confirm Modal Dialog
   *
   * @type {ConfirmModalConfig}
   */
  public options: ConfirmModalConfig;

  /**
   * Creates an instance of CourseItemComponent.
   * @param {TranslateService} translator
   */
  constructor(
    private translator: TranslateService) {
    this.options = {
      title: this.translator.instant('DELETE_COURSE_CONFIRM_TITLE'),
      text: this.translator.instant('DELETE_COURSE_CONFIRM_TEXT')
    };
    this.staticContentPath = environment.staticContentPath;
  }

  /**
   * Overridden method invoked when component is loaded
   */
  ngOnInit() { }

  /**
   * Method called on delete button click. Emits event to its parent component with Course Id to invoke
   */
  delete() {
    this.remove.emit(this.course.course.id);
  }
}

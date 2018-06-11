import { Component, OnInit, Input } from '@angular/core';
import { Content } from '../../../../_models';

/**
 * Component class for Content Item Box shown on Student Index page.
 *
 * @export
 * @class StudyCourseContentItemComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'pdg-study-course-content-item',
  templateUrl: './study-course-content-item.component.html',
  styleUrls: ['./study-course-content-item.component.scss']
})
export class StudyCourseContentItemComponent implements OnInit {

  /**
   * Content to be displayed in the item
   * @type {Content}
   */
  @Input() content: Content;

  /**
   * Creates an instance of StudyCourseContentItemComponent.
   */
  constructor() { }

  ngOnInit() {
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { SubjectIndex } from '../../../../../../_models/subject';

/**
 * Student Study Index Sidebar Item component class
 *
 * @export
 * @class StudySidebarItemComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'pdg-study-sidebar-item',
  templateUrl: './study-sidebar-item.component.html',
  styleUrls: ['./study-sidebar-item.component.scss']
})
export class StudySidebarItemComponent implements OnInit {

  /**
   * Subject Index
   * @type {SubjectIndex}
   */
  @Input() index: SubjectIndex;

  /**
   * Boolean variable for selected item
   * @type {boolean}
   */
  @Input() active: boolean;

  constructor() { }

  ngOnInit() {
  }

}

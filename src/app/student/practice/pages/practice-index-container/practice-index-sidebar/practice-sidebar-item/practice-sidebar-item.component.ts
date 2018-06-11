import { Component, OnInit, Input } from '@angular/core';
import { SubjectIndex } from '../../../../../../_models/subject';

@Component({
  selector: 'pdg-practice-sidebar-item',
  templateUrl: './practice-sidebar-item.component.html',
  styleUrls: ['./practice-sidebar-item.component.scss']
})
export class PracticeSidebarItemComponent implements OnInit {

  /**
   * Subject Index
   * @type {SubjectIndex}
   */
  @Input() index: SubjectIndex;

  /**
   * Question Accumulated Count
   *
   * @public
   * @type {any}
   */
  public accumulatedCount: any;

  constructor() { }

  ngOnInit() {
    this.accumulatedCount = (<any>this.index).accumulatedCount;
  }

}

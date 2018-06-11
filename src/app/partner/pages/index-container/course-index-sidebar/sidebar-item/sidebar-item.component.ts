import { Component, OnInit, Input } from '@angular/core';
import { SubjectIndex } from '../../../../../_models/subject';

@Component({
  selector: 'pdg-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.scss']
})
export class SidebarItemComponent implements OnInit {

  @Input() index: SubjectIndex;
  @Input() active: boolean;

  constructor() { }

  ngOnInit() {
  }

}

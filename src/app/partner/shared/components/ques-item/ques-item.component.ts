import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Question } from '../../../../_models';

@Component({
  selector: 'pdg-ques-item',
  templateUrl: './ques-item.component.html',
  styleUrls: ['./ques-item.component.scss']
})
export class QuesItemComponent implements OnInit {
  @Input() content: Question;
  @Input() selected = false;
  @Input() showRemoveButton = false;
  @Output() remove: EventEmitter<Question> = new EventEmitter();
  public isCollapsed = false;
  constructor() {}

  ngOnInit() {
    console.log('Questions is: ', this.content);
  }

  emitRemove() {
    this.remove.emit(this.content);
  }
}

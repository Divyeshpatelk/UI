import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Content } from '../../../../../_models';
import { ConfirmModalConfig } from '../../../../../shared/directives/confirm.directive';

@Component({
  selector: 'pdg-course-content-item',
  templateUrl: './course-content-item.component.html',
  styleUrls: ['./course-content-item.component.scss']
})
export class CourseContentItemComponent implements OnInit {

  @Input() content: Content;
  @Output() remove: EventEmitter<Content>;

  public removeMappingConfirm: ConfirmModalConfig;

  /**
   * Creates an instance of CourseContentItemComponent.
   * @param {TranslateService} translator
   */
  constructor(private translator: TranslateService) {
    this.remove = new EventEmitter<Content>();
    this.removeMappingConfirm = {
      title: this.translator.instant('REMOVE_CONTENT_CONFIRM_TITLE'),
      text: this.translator.instant('REMOVE_CONTENT_CONFIRM_TEXT')
    };
  }

  ngOnInit() {
  }

  removeContent(e: Event) {
    this.remove.emit(this.content);
  }
}

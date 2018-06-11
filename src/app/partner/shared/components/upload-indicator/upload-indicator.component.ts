import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { UploadContent, UploadContentEvent, UploadEventType } from '../../../../_models';
import { UploadContentService } from '../../../services';

@Component({
  selector: 'pdg-upload-indicator',
  templateUrl: './upload-indicator.component.html',
  styleUrls: ['./upload-indicator.component.scss']
})
export class UploadIndicatorComponent implements OnInit {

  public displayIndicator: boolean;
  public queue: UploadContent[];
  public showCloseBtn = false;
  public uploadStatus: string;
  public completedItem = 0;
  public failedItem = 0;

  constructor(
    private modalService: NgbModal,
    private translator: TranslateService,
    private uploadService: UploadContentService
  ) { }

  ngOnInit() {
    this.completedItem = 0;
    this.failedItem = 0;
    this.uploadService.contentUploadQueue.subscribe((queue: UploadContent[]) => {
      if (queue.length) {
        this.displayIndicator = true;
        this.showCloseBtn = false;
        this.queue = queue;
        this.uploadStatus = `${this.translator.instant('UPLOADING_ITEMS', { count: this.queue.length })}`;
      }
    });

    this.uploadService.contentUploadEventQueue.subscribe((event: UploadContentEvent) => {
      switch (event.type) {
        case UploadEventType.ALL_COMPLETE:
          this.uploadStatus = `${this.translator.instant('UPLOADING_COMPLETED')}`;
          this.showCloseBtn = true;
          break;
        case UploadEventType.CANCELLED:
          ++this.failedItem;
          break;
        case UploadEventType.CANCELLED_ALL:
          this.uploadStatus = `${this.translator.instant('UPLOADING_CANCELLED')}`;
          this.showCloseBtn = true;
          this.completedItem = 0;
          this.failedItem = 0;
          break;
        case UploadEventType.ERROR:
          ++this.failedItem;
          break;
        case UploadEventType.ITEM_COMPLETE:
          ++this.completedItem;
          break;
        case UploadEventType.QUEUE_CLEARED:
          this.displayIndicator = false;
          this.completedItem = 0;
          this.failedItem = 0;
          break;
      }
    });
  }

  /**
   * Method to cancel individual item from queue
   *
   * @param {number} index Index of the item in queue
   */
  cancel(index: number) {
    this.uploadService.cancelUpload(index);
  }

  /**
   * Method to cancel all ongoing uploads
   */
  cancelAll() {
    this.uploadService.cancelAllUpload();
  }

  /**
   * Method to clear the queue when uploading is completed / cancelled
   */
  clearQueue() {
    this.uploadService.clearQueue();
  }
}

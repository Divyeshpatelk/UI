import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'angular2-notifications';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { CsvUploadQuestionComponent } from '../../../csv-upload-question/csv-upload-question.component';

@Component({
  selector: 'pdg-bulk-upload-questions',
  templateUrl: './bulk-upload-questions.component.html',
  styleUrls: ['./bulk-upload-questions.component.scss']
})
export class BulkUploadQuestionsComponent implements OnInit {


  /**
     * Unique ID of the course
     * @type {string}
     */
  @Input() courseId: string;

  /**
   * Unique ID of the subject
   * @type {string}
   */
  @Input() subjectId: string;

  /**
   * Unique ID of the index on which question is added
   * @type {string}
   */
  @Input() indexId: string;


  /**
    * tempate reference from file upload
    *
    */
  @ViewChild('fileSelect') fileSelect;


  /**
    * Object to apply file drop class
    */
  public droppableClasses = {};



  /**
     * Creates an instance of AddQuestionComponent.
     * @param {NgbActiveModal} activeModal
     * @param {NotificationsService} notifyService
     * @param {TranslateService} translator,
     * @param {NgbModal} NgbModal
     */
  constructor(private activeModal: NgbActiveModal,
    private notifyService: NotificationsService,
    private translator: TranslateService,
    private modalService: NgbModal) { }

  ngOnInit() {
  }

  /**
    * Method to close active modal
    */
  close() {
    this.activeModal.dismiss();
  }

  /**
    * Method to browse files
    */
  openFileSelect() {
    this.fileSelect.nativeElement.click();
  }

  /**
    * Method called after selecting local file
    */
  selectFiles(event) {
    if (event[0].type !== 'text/csv') {
      this.notifyService.error(
        this.translator.instant('UNSUPPORTED_CONTENT'),
        this.translator.instant('ONLY_CSV_FILES'),
        { clickToClose: false });
      return;
    }
    this.openBulkMcqUploadForm(event[0]);
    this.fileSelect.nativeElement.value = null;
  }

  /**
    * Method called on dropping files on file upload drop-box
    */
  filesDropped(event) {
    this.droppableClasses = {};
    this.selectFiles(event);
  }

  /**
    * Method called on drag over of file upload drop-box
    */
  filesDragOver(event) {
    this.droppableClasses = {
      'droppable': true,
      'border': true,
      'border-primary': true
    };
  }

  /**
    * Method called on leaving drag from file upload drop-box
    */
  filesDragLeave(event) {
    this.droppableClasses = {};
  }

  /**
    * Method to open Bulk mcq upload Dialog
    */
  openBulkMcqUploadForm(file) {
    const modalRef = this.modalService.open(CsvUploadQuestionComponent, { size: 'lg', keyboard: false, backdrop: 'static' });
    modalRef.componentInstance.fileInput = file;
    modalRef.componentInstance.courseId = this.courseId;
    modalRef.componentInstance.subjectId = this.subjectId;
    modalRef.componentInstance.indexId = this.indexId;
    modalRef.result.then(
      (result) => {
        this.activeModal.close();
      }, (close) => {
      });
  }


}

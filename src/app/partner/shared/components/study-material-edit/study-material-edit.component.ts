import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

import { MyLibraryService } from '../../../services';
import { ValidatorLengths } from '../../../../_const';

/**
 * Component Class for Study Material Edit Modal.
 * This can be used from different places. (My Library Edit, Course Index Edit)
 *
 * @export
 * @class StudyMaterialEditComponent
 * @implements {OnInit}
 * @version 1.0
 * @author
 */
@Component({
  selector: 'pdg-study-material-edit',
  templateUrl: './study-material-edit.component.html',
  styleUrls: ['./study-material-edit.component.scss']
})
export class StudyMaterialEditComponent implements OnInit {

  /**
   * Study Material Content passed from Parent Component
   */
  @Input() content;

  /**
   * CDN URL of the Content
   * @type {SafeResourceUrl}
   */
  public src: SafeResourceUrl;

  /**
   * Model for Title (Inline Editor)
   * @type {string}
   */
  public title: string;
  /**
   * Model for Description (Inline Editor)
   *
   * @type {string}
   * @memberof StudyMaterialEditComponent
   */
  public description: string;

  public titleMinLength: number = ValidatorLengths.CONTENT_TITLE_MIN;
  public titleMaxLength: number = ValidatorLengths.CONTENT_TITLE_MAX;
  public descMinLength: number = ValidatorLengths.CONTENT_DESC_MIN;
  public descMaxLength: number = ValidatorLengths.CONTENT_DESC_MAX;

  /**
   * Creates an instance of StudyMaterialEditComponent.
   * @param {NgbActiveModal} activeModal
   * @param {DomSanitizer} domSanitizer
   * @param {MyLibraryService} libraryService
   * @param {NotificationsService} notifyService
   * @param {TranslateService} translator
   */
  constructor(public activeModal: NgbActiveModal,
    private domSanitizer: DomSanitizer,
    private libraryService: MyLibraryService,
    private notifyService: NotificationsService,
    private translator: TranslateService) {

  }

  /**
   * Overridden Method invoked when component is loaded
   */
  ngOnInit() {
    this.title = this.content.title;
    this.description = this.content.description;

    switch (this.content.type) {
      case 'pdf':
        this.src = this.content.cdnUrl;
        break;

      case 'video':
        this.src = this.domSanitizer.bypassSecurityTrustUrl(this.content.cdnUrl);
        break;

      case 'refvideo':
        this.src = this.domSanitizer.bypassSecurityTrustResourceUrl(this.content.cdnUrl);
        break;
      default: break;
    }
  }

  /**
   * Method to save Content Title
   * @param {string} title New Title to be set
   */
  saveTitle(title: string) {
    this.title = title;
    const editJson = {
      '_id': this.content._id,
      'title': title,
      'description': ''
    };
    this.libraryService.updateStudyMaterial(editJson).subscribe(response => {
      this.notifyService.success(this.translator.instant('TITLE_UPDATE_SUCCESS'));

    }, error => {
      this.notifyService.error(this.translator.instant('TITLE_UPDATE_FAILED'), '', {
        clickToClose: false
      });
    });
  }

  /**
   * Method to save Content Description
   * @param {string} description New Description to be set
   */
  saveDescription(description: string) {
    this.description = description;
    const editJson = {
      '_id': this.content._id,
      'title': '',
      'description': description
    };
    this.libraryService.updateStudyMaterial(editJson).subscribe(response => {
      this.notifyService.success(this.translator.instant('DESC_UPDATE_SUCCESS'));

    }, error => {
      this.notifyService.error(this.translator.instant('DESC_UPDATE_FAILED'), '', {
        clickToClose: false
      });
    });
  }

  handleError(event) {
    this.notifyService.error(event);
  }
}

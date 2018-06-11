/**
 * @class: ConfirmDirective
 * Description: Custom Directive desgined for Confirm Modal Dialog.
 *
 * @version: 1.0
 * @author:
 */
import { Directive, HostListener, EventEmitter, Output, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmComponent } from '../components/confirm/confirm.component';

//  TODO: implement these types somewhere
// export enum ConfirmModalType {
//   SUCCESS = 'success',
//   ERROR = 'error',
//   WARNING = 'warning',
//   INFO = 'info',
//   QUESTION = 'question'
// }

/**
 * Interface used for Confirm Modal Options
 *
 * @export
 * @interface ConfirmModalConfig
 */
export interface ConfirmModalConfig {

  /**
   * Confirm Dialog title
   * @type {string}
   */
  title?: string;

  /**
   * Confirm Dialog Text
   * @type {string}
   */
  text: string;

  /**
   * Confirm Button Text
   * @type {string}
   */
  confirmButtonText?: string;

  /**
   * Cancel Button Text
   * @type {string}
   */
  cancelButtonText?: string;
}

@Directive({
  selector: '[pdgConfirm]'
})
export class ConfirmDirective {

  confirmModalConfig: ConfirmModalConfig;

  @Input()
  public set pdgConfirm(options: ConfirmModalConfig) {
    this.confirmModalConfig = options;
  }

  @Output() confirm: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: NgbModal) { }

  open() {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static'
    };

    const modalRef = this.modalService.open(ConfirmComponent, modalOptions);
    modalRef.componentInstance.title = this.confirmModalConfig.title;
    modalRef.componentInstance.text = this.confirmModalConfig.text;
    modalRef.componentInstance.confirmButtonText = this.confirmModalConfig.confirmButtonText;
    modalRef.componentInstance.cancelButtonText = this.confirmModalConfig.cancelButtonText;

    modalRef.result.then(
      (result) => {
        this.confirm.emit(result);
      },
      (reason) => {
        this.cancel.emit(reason);
      });
  }

  @HostListener('click', ['$event'])
  public onHostClicked(event: MouseEvent): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.open();
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * Component Class for Alert Dialog.
 * Title and Text are passed to this component
 *
 * @export
 * @class AlertComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'pdg-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  /**
  * Confirm Dialog title
  * @type {string}
  */
  @Input() title: string;

  /**
   * Confirm Dialog Text
   * @type {string}
   */
  @Input() text: string;

  /**
   * Creates an instance of ConfirmComponent.
   * @param {NgbActiveModal} activeModal
   */
  constructor(public activeModal: NgbActiveModal) { }

  /**
   * Overridden method invoked when component is loaded
   */
  ngOnInit() {
  }

}

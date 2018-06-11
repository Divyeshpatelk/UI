import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

/**
 * Custom Component class for Confirm Modal Dialog. Config parameters are passed to this component.
 *
 * @export
 * @class ConfirmComponent
 * @implements {OnInit}
 * @version 1.0
 * @author
 */
@Component({
  selector: 'pdg-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

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
   * Confirm Button Text
   * @type {string}
   */
  @Input() confirmButtonText: string;

  /**
   * Cancel Button Text
   * @type {string}
   */
  @Input() cancelButtonText: string;

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

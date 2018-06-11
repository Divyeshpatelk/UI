import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { CanComponentDeactivate } from '../core/route-guards/can-component-deactivate';
import { ConfirmComponent } from '../shared/components';
import { UploadContentService } from './services';

/**
 * Default component for partner module. It provides the router outlet for Partner Module Components.
 *
 * @export
 * @class PartnerComponent
 * @implements {OnInit} OnInit Interface
 * @version 1.0
 * @author
 */
@Component({
  selector: 'pdg-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit, CanComponentDeactivate {
  /**
   * Creates an instance of PartnerComponent.
   */
  constructor(
    private modalService: NgbModal,
    private translateService: TranslateService,
    private uploadContentSerive: UploadContentService
  ) { }

  /**
   * Overridden method invoked when component is loaded
   */
  ngOnInit() {
  }

  canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    if (nextState.url.indexOf('/student') !== -1) {
      if (this.uploadContentSerive.isUploadingInProgress()) {
        const confirmModal: NgbModalRef = this.modalService.open(ConfirmComponent);
        confirmModal.componentInstance.title = this.translateService.instant('ARE_YOU_SURE');
        confirmModal.componentInstance.text = this.translateService.instant('UPLOAD_CANCEL_CONFIRM_TEXT');
        confirmModal.componentInstance.confirmButtonText = this.translateService.instant('YES');
        confirmModal.componentInstance.cancelButtonText = this.translateService.instant('NO');
        // TODO stop uploads and do some stuffs on promise to observable subscription

        confirmModal.result.then(result => {
          if (result) {
            this.uploadContentSerive.cancelAllUpload();
            this.uploadContentSerive.clearQueue();
          }
        });

        return confirmModal.result;

      } else {
        this.uploadContentSerive.clearQueue();
      }
    }
    return true;
  }

  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event) {
    if (this.uploadContentSerive.isUploadingInProgress()) {
      $event.returnValue = this.translateService.instant('ARE_YOU_SURE');
    }
  }
}

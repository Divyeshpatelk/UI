import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { CanComponentDeactivate } from '../core/route-guards/can-component-deactivate';
import { ConfirmComponent } from '../shared/components/confirm/confirm.component';

@Component({
  selector: 'pdg-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit, CanComponentDeactivate {

  constructor(
    private modalService: NgbModal,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
  }

  canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    // if (nextState.url.indexOf('/partner') !== -1) {
    //   const confirmModal: NgbModalRef = this.modalService.open(ConfirmComponent);
    //   confirmModal.componentInstance.title = this.translateService.instant('ARE_YOU_SURE');
    //   confirmModal.componentInstance.text = this.translateService.instant('MOVING_TO_PARTNER_MODULE');
    //   confirmModal.componentInstance.confirmButtonText = this.translateService.instant('YES');
    //   confirmModal.componentInstance.cancelButtonText = this.translateService.instant('NO');
    //   return confirmModal.result;
    // }
    return true;
  }

}

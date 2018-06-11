import { environment } from '../../../../../environments/environment';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { PracticeTestHelperService, TimerService } from '../../../../shared/services';
import { Course, Subject, BrandingInfo } from '../../../../_models';
import { ConfirmComponent } from '../../../../shared/components/confirm/confirm.component';
import { PracticeTestStatus } from '../../../../_models/practice-test';

@Component({
  selector: 'pdg-test-topbar',
  templateUrl: './test-topbar.component.html',
  styleUrls: ['./test-topbar.component.scss']
})
export class TestTopbarComponent implements OnInit {

  /**
   * Variable to hold the Static content path
   * @type {string}
   */
  public staticContentPath: string;

  /**
   * Variable to hold selected course
   * @type {Course}
   */
  public course: Course;

  /**
   * Variable to hold Selected Subject
   * @type {Subject}
   */
  public subject: Subject;

  /**
   * Variable to hold Selected BrandingInfo
   * @type {BrandingInfo}
   */
  public brandinginfo: BrandingInfo;

  /**
   * Variable to hold Test Status (finished or not)
   */
  public testFinished = false;

  private redirctToDashboard = false;
  /**
   * Creates an instance of TestTopbarComponent.
   * @param {NgbModal} modalService NgbModal Instance
   * @param {PracticeTestHelperService} practiceTestHelper PracticeTestHelperService Instance
   * @param {Router} router Router Instancce
   * @param {TimerService} timerService TimerService Instance
   * @param {TranslateService} translator TranslateService Instance
   */
  constructor(
    private modalService: NgbModal,
    private practiceTestHelper: PracticeTestHelperService,
    private router: Router,
    private timerService: TimerService,
    private translator: TranslateService,
    private activeRoute: ActivatedRoute) {
    this.staticContentPath = environment.staticContentPath;
  }

  /**
   * Overridden method invoked when component is loaded
   */
  ngOnInit() {
    let obj = JSON.parse(localStorage.getItem('testData'));
    if (obj === null) {
      this.testFinished = true;
      obj = JSON.parse(localStorage.getItem('testResultData'));
    }
    this.course = obj.course;
    this.subject = obj.subject;
    this.brandinginfo = JSON.parse(localStorage.getItem('partner-brandingInfo'));
    if ( this.activeRoute && this.activeRoute.firstChild && this.activeRoute.firstChild.snapshot  &&
      this.activeRoute.firstChild.snapshot.params && this.activeRoute.firstChild.snapshot.params['testId'] &&
      this.activeRoute.firstChild.snapshot.params['testId'] !== '' ) {
        this.redirctToDashboard = true;
    }
  }

  routeToPartnerPage() {
    if (this.brandinginfo.logoClickUrl) {
      this.router.navigate([`/${this.brandinginfo.logoClickUrl}`]);
    }
  }

  /**
   * Method invoked when user clicks on finish button
   */
  finishTest() {
    // Show confirm modal
    const modalRef = this.modalService.open(ConfirmComponent, { backdrop: 'static' });
    modalRef.componentInstance.title = this.translator.instant('WARNING');
    modalRef.componentInstance.text = this.translator.instant('PRACTICE_TEST_CONFIRM_MSG');

    modalRef.result.then(result => {
      this.practiceTestHelper.savePracticeTest(PracticeTestStatus.FINISH, 0).subscribe(response => {
        this.timerService.stopTimer();
        this.testFinished = true;
        this.practiceTestHelper.calculateTestResult(response);
        this.router.navigate(['/practice-test', 'result']);
      });

    }, close => {
      // Nothing to do
    });
  }

  closePracticeResult() {
    this.practiceTestHelper.removeResultDataFromLocalStorage();
    if (this.redirctToDashboard === true) {
      this.router.navigate(['/student', 'dashboard', this.course.id]);
    }else {
      this.router.navigate(['/home']);
    }
  }
}

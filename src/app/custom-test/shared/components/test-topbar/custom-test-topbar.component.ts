import { TestResultCustomMsgComponent } from './../../../pages/test-result-custom-msg/test-result-custom-msg.component';
import { TestRecord } from './../../../../_models/test-result';
import { environment } from '../../../../../environments/environment';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { CustomTestHelperService, TimerService } from '../../../../shared/services';
import { Course, BrandingInfo } from '../../../../_models';
import { ConfirmComponent } from '../../../../shared/components/confirm/confirm.component';
import { PracticeTestStatus } from '../../../../_models/practice-test';

@Component({
  selector: 'pdg-test-topbar',
  templateUrl: './custom-test-topbar.component.html',
  styleUrls: ['./custom-test-topbar.component.scss']
})
export class CustomTestTopbarComponent implements OnInit {

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
   * Variable to hold Selected testName
   * @type {string}
   */
  public testName: string;

    /**
   * Variable to hold Selected testId
   * @type {string}
   */
  public testId: string;

   /**
   * Variable to hold Selected testId
   * @type {TestRecord}
   */
  public exam: TestRecord;

  /**
    * Variable to hold Selected BrandingInfo
   * @type {BrandingInfo}
   */
  public brandinginfo: BrandingInfo;

  /**
   * Variable to hold Test Status (finished or not)
   */
  public testFinished = false;

  /**
   * Creates an instance of TestTopbarComponent.
   * @param {NgbModal} modalService NgbModal Instance
   * @param {CustomTestHelperService} customTestHelper CustomTestHelperService Instance
   * @param {Router} router Router Instancce
   * @param {TimerService} timerService TimerService Instance
   * @param {TranslateService} translator TranslateService Instance
   */
  constructor(
    private modalService: NgbModal,
    private customTestHelper: CustomTestHelperService,
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
    this.brandinginfo = JSON.parse(localStorage.getItem('partner-brandingInfo'));
    let obj = JSON.parse(localStorage.getItem('customTestData'));
    if (obj === null) {
      this.testFinished = true;
      obj = JSON.parse(localStorage.getItem('customTestResultData'));
    } else {
      console.log(' test is refreshed or restarted ');
      if ( this.customTestHelper.isReady === false ) {
        this.customTestHelper.setCustomTest((obj));
      }
    }
    const testDetailObj = JSON.parse(localStorage.getItem('customTestDetail'));
    if ( testDetailObj ) {
      const exam: TestRecord = testDetailObj.exam;
      this.course = testDetailObj.course;
      this.testName = exam.testName;
      this.testId =  exam.partnerTestId;
      this.exam = exam;
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
      this.customTestHelper.savePracticeTest(PracticeTestStatus.FINISH, 0).subscribe(
        (response: any) => {
          this.timerService.stopTimer();
          this.testFinished = true;
          this.customTestHelper.calculateTestResult(response);
          const testResultData = { course: this.course, subject: {}, testName: this.testName };
          localStorage.setItem('customTestResultData', JSON.stringify(testResultData));
          localStorage.setItem('customTestDetail', JSON.stringify(testResultData));
          if ( this.exam.showResultToStudents && this.exam.showResultToStudents === true  ) {
            this.router.navigate(['/test', 'result', { testId: response.id }]);
          }else if ( this.exam.messageForResultDisplay ) {
            const modalCustMsgRef = this.modalService.open(TestResultCustomMsgComponent, { backdrop: 'static' });
            modalCustMsgRef.componentInstance.customMsgHtml = this.exam.messageForResultDisplay;
            modalCustMsgRef.componentInstance.title = this.translator.instant('TEST_RESULT');
            modalCustMsgRef.result.then( res => {
              this.router.navigate(['/student', 'dashboard', this.course.id]);
              }
            );
          }else {
            this.router.navigate(['/student', 'dashboard', this.course.id]);
          }
      });

    }, close => {
      // Nothing to do
    });
  }

  closeTestResult() {
    this.customTestHelper.removeResultDataFromLocalStorage();
    this.router.navigate(['/student', 'dashboard', this.course.id]);
  }
}

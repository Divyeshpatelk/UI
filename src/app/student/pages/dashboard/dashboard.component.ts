import { TranslateService } from '@ngx-translate/core';
import { TestResultCustomMsgComponent } from './../../../custom-test/pages/test-result-custom-msg/test-result-custom-msg.component';
import { CustomTestService } from './../../shared/services/custom-test.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTabChangeEvent, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { Subject } from './../../../_models/subject';
import { Course } from './../../../_models/course';
import { CourseManagerService } from './../../shared/services/course-manager.service';
import { TestHistoryService } from './../../shared/services/test-history.service';
import { TestHistory, TestRecord } from '../../../_models/test-result';
import { CustomTestHelperService } from './../../../shared/services/custom-test-helper.service';

@Component({
  selector: 'pdg-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  /**
   *  Record per Page for Grids
   */
  recordPerPage = 10;

  /**
   *  List of parctice tests for student
   */
  practiceTestRecords: TestRecord[];

  /**
   *  List of subjects for selected course
   */
  subjects: any[];

  /**
   *  Current Practice Test page in Grid
   */
  currentPracticeTestPage = 0;

  /**
   *  Total No of Practice Test
   */
  totalPracticeTestElements = 0;

  /**
   *  Current Selected CourseId
   */
  currentCourseId: string;

  /**
   *  Current selected acive subject from Practice Test Tabs
   */
  currentSubjectId: string;

  /**
   *  Currently selected Course
   */
  currentCourse: Course;

  /**
   *  List of custom test for student
   */
  customTestRecords: TestRecord[];

  /**
   *  Current Custom Test page in Grid
   */
  currentCustomTestPage = 0;

  /**
   *  Total No of Custom Test
   */
  totalCustomTestElements = 0;

  constructor(
    private modalService: NgbModal,
    private courseManagerService: CourseManagerService,
    private testHistoryService: TestHistoryService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private customTestHelperService: CustomTestHelperService,
    private customTestService: CustomTestService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    // Get courseId from Request
    this.currentCourseId = this.activeRoute.snapshot.params['courseId'];
    if (this.currentCourseId) {
      // Call Service to get List of subject for this course
      this.courseManagerService
        .getCourseDetails(this.currentCourseId)
        .subscribe((courseDetail: { course: Course; subjects: Subject[] }) => {
          // set Current Subject
          if (courseDetail && courseDetail.subjects && courseDetail.subjects.length > 0) {
            this.subjects = courseDetail.subjects;
            this.currentSubjectId = courseDetail.subjects[0].id;
            this.currentCourse = courseDetail.course;
          }
        });
    } else {
      this.subjects = [];
      this.practiceTestRecords = [];
      this.customTestRecords = [];
    }
  }

  //  Reload Practice Test Data
  loadPracticeTestData(event) {
    this.currentPracticeTestPage = event.first / this.recordPerPage;
    this.fetchPracticeTestRecords();
  }

  // Fetch Practice Test History for particular course of student.
  fetchPracticeTestRecords() {
    this.testHistoryService
      .getPracticeTestHistoryForStudent(
        this.currentCourseId,
        this.currentSubjectId,
        this.currentPracticeTestPage,
        this.recordPerPage
      )
      .subscribe((res: TestHistory) => {
        this.totalPracticeTestElements = res.totalElements;
        this.practiceTestRecords = res.content;
      });
  }

  //  Reload Practice Test Data
  loadCustomTestData(event) {
    this.currentCustomTestPage = event.first / this.recordPerPage;
    this.fetchCustomTestRecords();
  }

  // Fetch Custom Test History for particular course of student.
  fetchCustomTestRecords() {
    // Call Service to get List of Custom Test for student
    this.testHistoryService
      .getCustomTestHistory(this.currentCourseId, this.currentCustomTestPage, this.recordPerPage)
      .subscribe((res: TestHistory) => {
        this.totalCustomTestElements = res.totalElements;
        this.customTestRecords = res.content;
      });
  }

  // set Current subject if subject tabs are changed
  beforeChange(event: NgbTabChangeEvent) {
    this.currentPracticeTestPage = 0;
    if (event.nextId) {
      this.currentSubjectId = event.nextId[0];
    }
  }

  findCurrentSubject(): Subject {
    for (let i = 0; i < this.subjects.length; i++) {
      if (this.subjects[i].id === this.currentSubjectId) {
        return this.subjects[i];
      }
    }
    return null;
  }

  // go to Practice Test result review page
  viewDetailResult(testId: string) {
    const testResultData = { course: this.currentCourse, subject: this.findCurrentSubject() };
    localStorage.setItem('testResultData', JSON.stringify(testResultData));
    this.router.navigate(['/practice-test', 'result', { testId: testId }]);
  }

  // go to custom page section wise result
  viewCustomTestDetailResult(testId: string, testName: string) {
    console.log('viewCustomTestDetailResult');
    localStorage.removeItem('customTestResultData');
    localStorage.removeItem('customTestDetail');
    localStorage.removeItem('customTestData');
    const testResultData = { course: this.currentCourse, subject: this.findCurrentSubject(), testName: testName };
    localStorage.setItem('customTestResultData', JSON.stringify(testResultData));
    localStorage.setItem('customTestDetail', JSON.stringify(testResultData));
    this.router.navigate(['/test', 'result', { testId: testId }]);
  }

  // Get custom test data and navigate to custom test
  startCustomTest(exam: TestRecord) {
    this.customTestService.takeCustomTest(exam.partnerTestId).subscribe((testData: any) => {
      localStorage.removeItem('customTestResultData');
      localStorage.removeItem('customTestDetail');
      testData.isShowRightAnsOptionEnabled = false;
      const customTestDetail = { course: this.currentCourse, exam: exam };
      localStorage.setItem('customTestDetail', JSON.stringify(customTestDetail));
      console.log('%%%%%%%%%%%%%%%%%%%%%%%%');
      console.log(testData);
      console.log('%%%%%%%%%%%%%%%%%%%%%%%%');
      this.customTestHelperService.removeTestDataFromLocalStorage();
      this.customTestHelperService.setCustomTest(testData);
      this.router.navigate(['/test']);
    });
  }

  canStartExam(exam: TestRecord) {
    if ( !exam.currentTime || !exam.endTime || !exam.startTime ) {
      return 0;
    }
    if ( exam.status === 'PARTNER_CREATED' ) {
      const curDate = new Date( exam.currentTime);
      const startDate = this.prepareDateObj(exam.startTime);
      const endDate = this.prepareDateObj(exam.endTime);
      if ( curDate >= startDate && curDate <= endDate ) {
        return 0;
      }else if ( curDate >  endDate ) {
        return 1;
      }else if ( curDate <  startDate ) {
        return -1;
      }
    }
    return 0;
  }

  getFormateDT(strTime: string) {
     if ( strTime ) {
       const dt: Date = this.prepareDateObj(strTime);
      return ( dt.toLocaleString());
      }else {
       return '';
     }
  }

  prepareDateObj(strTime: string) {
    let dt: Date = null;
    const strDt: string = strTime;
    const arr: string[] = strDt.split('@');
    if ( arr && arr.length > 0 ) {
      dt = new Date (arr[0]);
    }
    if ( dt && arr && arr.length > 1 ) {
      const timeStr = arr[1].substr(0, arr[1].indexOf('.'));
      if ( timeStr ) {
        const timeArr: string[] = timeStr.split(':');
        if ( timeArr && timeArr.length > 2 ) {
          dt.setHours(+timeArr[0]);
          dt.setMinutes(+timeArr[1]);
        }
      }
    }
    return dt;
  }

  viewLockedResultPopup(exam: TestRecord) {
    const modalCustMsgRef = this.modalService.open(TestResultCustomMsgComponent, { backdrop: 'static' });
      modalCustMsgRef.componentInstance.customMsgHtml = exam.messageForResultDisplay;
      modalCustMsgRef.componentInstance.title = this.translator.instant('TEST_RESULT');
      modalCustMsgRef.result.then( res => {
          console.log('closed');
        }
      );
  }
}

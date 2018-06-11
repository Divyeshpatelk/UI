import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewChecked,
  ChangeDetectorRef,
  AfterViewInit,
  ElementRef,
  HostListener
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbTabset, NgbTabChangeEvent, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CustomTestGeneratorService } from '../../services/custom-test-generator.service';
import { Section, CustomTest, Question } from '../../../_models';
import { QuestionFormComponent } from '../../shared/components/question-form/question-form.component';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'pdg-custom-test-editor-modal',
  templateUrl: './custom-test-editor-modal.component.html',
  styleUrls: ['./custom-test-editor-modal.component.scss']
})
export class CustomTestEditorModalComponent implements OnInit, AfterViewChecked {
  @Input() courseId;
  @Input() subjectId;
  @Input() indexId = '1.0.0';
  @Input() testId;
  @Input() testStatus;
  @Input() test: CustomTest;

  editedSectionSbj: BehaviorSubject<Section> = null;

  displayTestConfiguration = false;
  displayTestTimeWindowConfig = false;
  displaySectionForm = false;
  testConfigFormGroup: FormGroup;
  sectionQuestions: { [key: string]: Question[] } = {};
  removedSectionQuestions: { [key: string]: Question[] } = {};
  selectedSectionId = 'add-sec-btn';
  nextSectionId = null;
  selectedQuestionLocation: { sectionId: string; index: number } = null;
  selectedQuestion: Question;
  testStartFromTime: any;
  testStartToTime: any;
  uploadQuestionsFlag = true;

  @ViewChild('sectionTabSet') tabSet: NgbTabset;
  @ViewChild(QuestionFormComponent) questionForm: QuestionFormComponent;
  @ViewChild('questionFormDiv') questionFormDiv: ElementRef;
  @ViewChild('testStartFromDate') datepicker1;
  @ViewChild('testStartToDate') datepicker2;

  testStartFromDateModel: any = null;
  testStartToDateModel: any = null;
  chkdtconfigModel: any = null;
  customMsgModel: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private customTestGenerater: CustomTestGeneratorService,
    private cdr: ChangeDetectorRef,
    private activeModal: NgbActiveModal,
    private notification: NotificationsService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.editedSectionSbj = this.customTestGenerater.createBehaviorSubjectForSection();
    this.testConfigFormGroup = this.formBuilder.group({
      testName: ['', Validators.required],
      duration: ['', Validators.required]
    });

    if (this.testId) {
      this.customTestGenerater.getTest(this.testId).subscribe((test: CustomTest) => {
        this.test = test;
        this.testStatus = test.status;
        this.customMsgModel = {
          html: this.test.messageForResultDisplay ? this.test.messageForResultDisplay : '',
          delta: this.test.messageForResultDisplayDelta ? this.test.messageForResultDisplayDelta : ''
        };
        this.editedSectionSbj.next(null);
        this.prepareSections();
        if (this.test.sections.length > 0) {
          this.nextSectionId = this.test.sections[0].id;
        } else {
          this.showSectionForm();
        }
        this.hideTestConfiguration();
        this.hideTestTimeWindowConfig();
      });
    } else {
      this.showTestConfiguration();
    }
    this.hideTestTimeWindowConfig();
  }

  ngAfterViewChecked() {
    if (this.tabSet && this.nextSectionId) {
      this.tabSet.select(this.nextSectionId);
      this.nextSectionId = null;
      this.cdr.detectChanges();
    }
  }

  showTestConfiguration() {
    this.displayTestConfiguration = true;
  }

  hideTestConfiguration() {
    this.displayTestConfiguration = false;
  }

  prepareDateObj(strTime: string) {
    let dt: Date = null;
    console.log(strTime);
    const strDt: string = strTime;
    const arr: string[] = strDt.split('@');
    if (arr && arr.length > 0) {
      dt = new Date(arr[0]);
    }
    if (dt && arr && arr.length > 1) {
      const timeStr = arr[1].substr(0, arr[1].indexOf('.'));
      if (timeStr) {
        const timeArr: string[] = timeStr.split(':');
        if (timeArr && timeArr.length > 2) {
          dt.setHours(+timeArr[0]);
          dt.setMinutes(+timeArr[1]);
        }
      }
    }
    return dt;
  }

  showTestTimeWindowConfig() {
    this.displayTestTimeWindowConfig = true;
    let startDateTime: Date = null;
    let enddDateTime: Date = null;

    console.log(this.test);
    console.log(this.datepicker1);
    console.log(JSON.stringify(this.datepicker1));
    if (this.test.startTime) {
      startDateTime = this.prepareDateObj(this.test.startTime);
    }
    if (this.test.endTime) {
      enddDateTime = this.prepareDateObj(this.test.endTime);
    }
    if (startDateTime && startDateTime !== null) {
      this.testStartFromDateModel = {
        year: startDateTime.getFullYear(),
        month: startDateTime.getMonth() + 1,
        day: startDateTime.getDate()
      };
      this.testStartFromTime = {
        hour: startDateTime.getHours(),
        minute: startDateTime.getMinutes()
      };
      this.chkdtconfigModel = true;
    }
    if (enddDateTime && enddDateTime !== null) {
      this.testStartToDateModel = {
        year: enddDateTime.getFullYear(),
        month: enddDateTime.getMonth() + 1,
        day: enddDateTime.getDate()
      };
      this.testStartToTime = {
        hour: enddDateTime.getHours(),
        minute: enddDateTime.getMinutes()
      };
      this.chkdtconfigModel = true;
    }

    console.log(startDateTime);
    console.log(enddDateTime);
    console.log(this.testStartFromDateModel);
    console.log(this.testStartToDateModel);
  }

  hideTestTimeWindowConfig() {
    this.displayTestTimeWindowConfig = false;
  }
  prepareSections() {
    if (this.test.sections && this.test.sections.length > 0) {
      this.test.sections.forEach((section: Section) => (this.sectionQuestions[section.id] = []));
      const that = this;
      if (this.test.questions) {
        this.test.questions.forEach((question: Question) => {
          const sectionId = question.courses[0].sectionId;
          that.sectionQuestions[sectionId].push(question);
        });
      }
    } else {
      this.test.sections = [];
    }
  }

  createOrUpdateTestConfig() {
    const testConfig = {
      testName: this.testConfigFormGroup.value.testName,
      duration: this.testConfigFormGroup.value.duration,
      courses: [{ mappingId: this.courseId, subjectid: this.subjectId, indexid: this.indexId }]
    };

    this.customTestGenerater.createTest(testConfig).subscribe((test: CustomTest) => {
      this.test = test;
      this.showTestEditor();
      this.prepareSections();
    });
  }

  showTestEditor() {
    this.displayTestConfiguration = false;
    if (!this.test.sections || this.test.sections.length === 0) {
      this.showSectionForm();
    }
  }

  showSectionForm() {
    this.displaySectionForm = true;
  }

  hideSectionForm() {
    this.displaySectionForm = false;
  }

  createSection(section: Section) {
    this.customTestGenerater.createSection(section).subscribe(
      (newSection) => {
        this.test.sections.push(newSection);
        this.sectionQuestions[newSection.id] = [];
        this.nextSectionId = newSection.id;
        this.hideSectionForm();
        this.notification.success(this.translator.instant('SECTION_ADD_SUCCESS'));
      },
      (error) => {
        this.notification.error(this.translator.instant('ERROR1'));
      }
    );
  }

  updateSection(section: Section) {
    const reqJson = section;
    reqJson['sectionId'] = section.id;
    this.customTestGenerater.updateSection(reqJson).subscribe(
      (response: any) => {
        let sIndex = -1;
        this.test.sections.forEach((sec: Section, index) => {
          if (sec.id === section.id) {
            sIndex = index;
          }
        });
        if (sIndex > -1) {
          this.test.sections.splice(sIndex, 1, section);
        }
        console.log(JSON.stringify(this.test.sections));
        console.log('---------------');
        console.log(JSON.stringify(response));
        this.hideSectionForm();
        this.notification.success(this.translator.instant('SECTION_UPDATE_SUCCESS'));
      },
      (error) => {
        this.notification.error(this.translator.instant('ERROR1'));
      }
    );
  }

  editSection(section: Section) {
    this.editedSectionSbj = this.customTestGenerater.createBehaviorSubjectForSection();
    this.showSectionForm();
    this.selectedSectionId = section.id;
    this.editedSectionSbj.next(section);
  }

  addOrUpdateQuestion(question: Question) {
    if (this.selectedQuestionLocation) {
      this.sectionQuestions[this.selectedQuestionLocation.sectionId][this.selectedQuestionLocation.index] = question;
      this.deselectQuestion();
    } else {
      this.sectionQuestions[this.selectedSectionId].push(question);
    }
    this.questionForm.reset();
    this.questionFormDiv.nativeElement.scrollTo(0, 0);
  }

  handleTabChange(tabChangeEvent: NgbTabChangeEvent) {
    console.log('handleTabChange called');
    console.log(JSON.stringify(tabChangeEvent));
    this.deselectQuestion();
    this.hideSectionForm();
    if (tabChangeEvent.nextId === 'add-sec-btn') {
      this.editedSectionSbj = this.customTestGenerater.createBehaviorSubjectForSection();
      this.editedSectionSbj.next(null);
      this.showSectionForm();
      this.selectedSectionId = 'add-sec-btn';
    } else {
      this.hideSectionForm();
      this.selectedSectionId = tabChangeEvent.nextId;
    }
  }

  selectQuestion(sectionId, index) {
    this.hideSectionForm();
    this.selectedQuestionLocation = { sectionId, index };
    this.selectedQuestion = this.sectionQuestions[sectionId][index];
  }

  deselectQuestion() {
    this.selectedQuestionLocation = null;
    this.selectedQuestion = null;
    if (this.questionFormDiv) {
      this.questionFormDiv.nativeElement.scrollTo(0, 0);
    }
  }

  removeQuestion(sectionId, index) {
    const removedQuestion: Question = this.sectionQuestions[sectionId].splice(index, 1)[0];
    if (removedQuestion === this.selectedQuestion) {
      this.deselectQuestion();
    }

    if (removedQuestion.id) {
      if (this.removedSectionQuestions[sectionId]) {
        this.removedSectionQuestions[sectionId] = [...this.removedSectionQuestions[sectionId], removedQuestion];
      } else {
        this.removedSectionQuestions[sectionId] = [removedQuestion];
      }
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  saveTest(): Observable<any> {
    const testQuestionArr = [];

    this.test.sections.forEach((section: Section) => {
      this.sectionQuestions[section.id].forEach((question: Question) => {
        question.courses = [
          {
            mappingId: this.courseId,
            subjectid: this.subjectId,
            indexid: this.indexId,
            sectionId: section.id
          }
        ];
        question.purpose = 'PARTNER_SECTION';
        question.testId = this.test.id;
        question.type = 'SINGLE';
        testQuestionArr.push(question);
      });

      if (this.removedSectionQuestions[section.id]) {
        this.removedSectionQuestions[section.id].forEach((question: Question) => {
          question.courses = [
            {
              mappingId: this.courseId,
              subjectid: this.subjectId,
              indexid: this.indexId,
              sectionId: section.id
            }
          ];
          question.purpose = 'PARTNER_SECTION';
          question.testId = this.test.id;
          question.type = 'SINGLE';
          question.status = 'DELETE';
          testQuestionArr.push(question);
        });
      }
    });

    if (testQuestionArr.length > 0) {
      return this.customTestGenerater.saveTestAsDraft(testQuestionArr);
    } else {
      return;
    }
  }

  saveTestAsDraft() {
    const saveDraft$ = this.saveTest();
    if (saveDraft$) {
      saveDraft$.subscribe(
        (success) => {
          this.notification.success(this.translator.instant('SAVED'));
          this.closeModal();
        },
        (error) => this.notification.error(this.translator.instant('ERROR1'))
      );
    } else {
      this.notification.success(this.translator.instant('SAVED'));
      this.closeModal();
    }
  }

  backToQuestionForm() {
    this.hideTestTimeWindowConfig();
    this.hideSectionForm();
  }

  proceedToPublish() {
    const saveDraft$ = this.saveTest();
    if (saveDraft$) {
      saveDraft$.subscribe((success) => {
        this.hideTestConfiguration();
        this.showTestTimeWindowConfig();
      });
    } else {
      this.notification.error(this.translator.instant('ADD_AT_LEAST_ONE_QUESTION'));
    }
  }

  publishTest(frm) {
    console.log(frm.value);
    const testTimeWindowConfig = {};
    testTimeWindowConfig['id'] = this.test.id;
    testTimeWindowConfig['testName'] = frm.value.tname;
    if (frm.value.chkdtconfig && frm.value.chkdtconfig === true) {
      if (!frm.value.testStartFromDate || !frm.value.testStartToDate) {
        this.notification.error(this.translator.instant('TEST_TIMING_VALUE'));
        return false;
      } else {
        if (frm.value.testStartFromDate) {
          testTimeWindowConfig['startTime'] = this.prepareDateParam(
            frm.value.testStartFromDate,
            frm.value.testStartFromTime
          );
        }
        if (frm.value.testStartToDate) {
          testTimeWindowConfig['endTime'] = this.prepareDateParam(frm.value.testStartToDate, frm.value.testStartToTime);
        }
        if (
          this.validateDates(
            frm.value.testStartFromDate,
            frm.value.testStartFromTime,
            frm.value.testStartToDate,
            frm.value.testStartToTime
          ) === false
        ) {
          this.notification.error(this.translator.instant('TEST_TIMING_INVALID1'));
          return false;
        }
      }
    }
    testTimeWindowConfig['duration'] = frm.value.tduration;
    testTimeWindowConfig['messageForResultDisplay'] = this.customMsgModel.html;
    testTimeWindowConfig['messageForResultDisplayDelta'] = this.customMsgModel.delta;
    testTimeWindowConfig['showResultToStudents'] =
      frm.value.chkshowresult && frm.value.chkshowresult === true ? true : false;
    console.log(this.customMsgModel);
    console.log(JSON.stringify(testTimeWindowConfig));
    this.customTestGenerater.saveTestTimeWindowConfig(testTimeWindowConfig).subscribe(
      (response) => {
        this.customTestGenerater.publishTest(this.test.id).subscribe(
          (success) => {
            this.notification.success(this.translator.instant('PUBLISHED'));
            this.closeModal();
          },
          (error) => {
            this.notification.error(this.translator.instant('ERROR1'));
          }
        );
      },
      (err) => {
        if (err.error && err.error.responseMessage) {
          this.notification.error(err.error.responseMessage);
        } else {
          this.notification.error(this.translator.instant('ERROR1'));
        }
      }
    );
  }

  prepareDateParam(dtObj, timeObj) {
    let dt: string;
    if (timeObj) {
      dt =
        dtObj.year + '-' + dtObj.month + '-' + dtObj.day + '@' + timeObj.hour + ':' + timeObj.minute + ':00.000+0000';
    } else {
      dt = dtObj.year + '-' + dtObj.month + '-' + dtObj.day + '@00:00:00.000+0000';
    }
    return dt;
  }

  validateDates(fromDt, fromTime, toDt, toTime) {
    let dateFrom: Date = null,
      dateTo: Date = null;
    const curDate = new Date();
    curDate.setHours(0);
    curDate.setMinutes(0);
    curDate.setSeconds(0);
    if (fromTime) {
      dateFrom = new Date(fromDt.year, fromDt.month - 1, fromDt.day, fromTime.hour, fromTime.minute, 0);
    } else {
      dateFrom = new Date(fromDt.year, fromDt.month - 1, fromDt.day, 0, 0, 0);
    }
    if (toTime) {
      dateTo = new Date(toDt.year, toDt.month - 1, toDt.day, toTime.hour, toTime.minute, 0);
    } else {
      dateTo = new Date(toDt.year, toDt.month - 1, toDt.day, 0, 0, 0);
    }
    console.log('valid date & time:' + dateFrom);
    console.log('valid date & time:' + dateTo);
    console.log('valid date & time:' + curDate);
    if (dateFrom && dateTo && dateFrom <= dateTo) {
      console.log('valid date & time:' + dateFrom);
      console.log('valid date & time:' + dateTo);
      console.log('valid date & time:' + curDate);
      return true;
    } else {
      return false;
    }
  }

  toggleDatePicker1(event) {
    this.datepicker1.toggle();
    event.stopPropagation();
  }

  toggleDatePicker2(event) {
    this.datepicker2.toggle();
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  closeDatepickerOnclick(event) {
    if (event.target.offsetParent !== null && event.target.offsetParent.tagName !== 'NGB-DATEPICKER') {
      if (this.datepicker2) {
        this.datepicker2.close();
      }
      if (this.datepicker1) {
        this.datepicker1.close();
      }
    }
  }

  uploadQuestions() {
    if (this.uploadQuestionsFlag === true) {
      this.uploadQuestionsFlag = false;
    } else {
      this.uploadQuestionsFlag = true;
    }

    console.log('courseId is :- ', this.courseId);
    console.log('subjectId is :- ', this.subjectId);
    console.log('testId is :- ', this.testId);
    console.log('test is :- ', this.test);
  }
}

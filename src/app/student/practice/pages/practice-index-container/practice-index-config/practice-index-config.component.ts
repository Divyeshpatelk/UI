import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

import { SubjectIndex, Subject, Course, PracticeTestData } from '../../../../../_models';
import { PracticeTestService } from '../../../services';
import { CourseIndexCreatorService } from '../../../../shared/services';
import { PracticeTestHelperService } from '../../../../../shared/services';

@Component({
  selector: 'pdg-practice-index-config',
  templateUrl: './practice-index-config.component.html',
  styleUrls: ['./practice-index-config.component.scss']
})
export class PracticeIndexConfigComponent implements OnInit {

  private static MAX_SELECTED_QUESTION_LIMIT = 50;
  public practiceTestConfigForm: FormGroup;
  public selectedQuestionCount = 0;
  private selectedSubject: Subject;
  private selectedIndexes: SubjectIndex[];
  private selectedCourse: Course;
  @ViewChild('numOfQues') rangeControl;

  constructor(
    private courseIndexCreator: CourseIndexCreatorService,
    private formBuilder: FormBuilder,
    private practiceTestService: PracticeTestService,
    private practiceTestHelperService: PracticeTestHelperService,
    private router: Router,
    private notifyService: NotificationsService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.selectedCourse = this.courseIndexCreator.course;

    this.practiceTestConfigForm = this.formBuilder.group({
      questionType: ['', Validators.required],
      showRightAns: [false],
      timeConfig: [0],
      numOfQues: [0]
    });

    this.courseIndexCreator.selectedSubject.subscribe((subject: Subject) => {
      this.selectedSubject = subject;
    });

    this.courseIndexCreator.selectedIndexes.subscribe((subjectIndexes: SubjectIndex[]) => {
      this.selectedQuestionCount = 0;
      this.selectedIndexes = [];
      this.disableForm();

      if (subjectIndexes !== null) {
        this.selectedIndexes = subjectIndexes;
        this.calculateSelectedCount(subjectIndexes);
      }
      if (this.practiceTestConfigForm.get('questionType').value === '') {
        this.practiceTestConfigForm.get('questionType').setValue('random');
      }
    });
  }
  calculateSelectedCount(indexes: SubjectIndex[]) {
    indexes.forEach((index) => {
      this.selectedQuestionCount += index.contentUnitCount.questions;
    });
    if (this.selectedQuestionCount > PracticeIndexConfigComponent.MAX_SELECTED_QUESTION_LIMIT) {
      this.selectedQuestionCount = PracticeIndexConfigComponent.MAX_SELECTED_QUESTION_LIMIT;
    }
    if (this.selectedQuestionCount !== 0) {
      // Disable the Practice Test Config Form
      this.enableForm();
      if (this.practiceTestConfigForm.get('timeConfig').value === 0) {
        this.rangeControl.nativeElement.min = 0;
        this.rangeControl.nativeElement.max = this.selectedQuestionCount;
        this.practiceTestConfigForm.get('numOfQues').setValue(this.selectedQuestionCount);
      }
    } else {
      this.rangeControl.nativeElement.min = 0;
      this.rangeControl.nativeElement.max = 0;
      this.practiceTestConfigForm.get('numOfQues').setValue(0);
    }
  }

  enableForm() {
    this.practiceTestConfigForm.get('questionType').enable();
    this.practiceTestConfigForm.get('showRightAns').enable();
    this.practiceTestConfigForm.get('timeConfig').enable();
    this.practiceTestConfigForm.get('numOfQues').enable();
  }

  disableForm() {
    this.practiceTestConfigForm.get('questionType').disable();
    this.practiceTestConfigForm.get('showRightAns').disable();
    this.practiceTestConfigForm.get('timeConfig').disable();
    this.practiceTestConfigForm.get('numOfQues').disable();
  }

  resetOtherConfig(formControl: AbstractControl) {
    formControl.setValue(0);
  }

  generatePracticeTest() {
    const practiceTestObj = {};
    // Step - 1: Select type of questions
    practiceTestObj[this.practiceTestConfigForm.value.questionType] = true;

    // Step - 2: Time Config
    // Number of questions are specified
    if (this.practiceTestConfigForm.value.numOfQues) {
      practiceTestObj['questionLimit'] = this.practiceTestConfigForm.value.numOfQues;
    } else {
      practiceTestObj['timeLimit'] = this.practiceTestConfigForm.value.timeConfig;
    }

    practiceTestObj['courses'] = [];

    // Create select indexes array
    this.selectedIndexes.forEach((index) => {
      const coursesObj = {
        mappingId: this.selectedCourse.id,
        subjectid: this.selectedSubject.id,
        indexid: index.indexId
      };
      practiceTestObj['courses'].push(coursesObj);
    });

    practiceTestObj['showAnswer'] = this.practiceTestConfigForm.value.showRightAns;

    this.practiceTestService.generatePracticeTest(practiceTestObj).subscribe(
      (response: PracticeTestData) => {
        const object = {
          course: this.selectedCourse,
          subject: this.selectedSubject,
          practiceTest: response,
          isShowRightAnsOptionEnabled: this.practiceTestConfigForm.value.showRightAns,
          selectedIndexes: this.selectedIndexes
        };

        localStorage.setItem('testData', JSON.stringify(object));
        this.practiceTestHelperService.setPracticeTest(object);
        this.router.navigate(['/practice-test']);
      },
      (error) => {
        let errorMsg = null;
        switch (this.practiceTestConfigForm.value.questionType) {
          case 'previousincorrect':
            errorMsg = 'NO_PREVIOUSLY_UNANSWERD';
            break;

          case 'pastExam':
            errorMsg = 'NO_PAST_EXAMS';
            break;

          case 'flag':
            errorMsg = 'NO_FLAGGED_QUESTIONS';
            break;

          default:
            errorMsg = 'GENERATE_PRACTICE_TEST_ERROR';
            break;
        }
        this.notifyService.error(this.translator.instant(errorMsg), error.error.error_description, {
          clickToClose: false
        });
      }
    );
  }
}

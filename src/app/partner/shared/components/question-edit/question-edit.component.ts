import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { MyLibraryService } from '../../../services';
import { Question } from '../../../../_models';
import { ConfirmModalConfig } from '../../../../shared/directives/confirm.directive';

@Component({
  selector: 'pdg-question-edit',
  templateUrl: './question-edit.component.html',
  styleUrls: ['./question-edit.component.scss']
})
export class QuestionEditComponent implements OnInit {
  @Input() question: Question;

  /**
   * Confirm Dialof Options
   * @type {ConfirmModalConfig}
   */
  options: ConfirmModalConfig = {
    title: this.translator.instant('WARNING'),
    text: 'You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.',
    confirmButtonText: this.translator.instant('OK'),
    cancelButtonText: this.translator.instant('CANCEL')
  };

  /**
   * Array of years for Past Exams Year Dropdown
   * @type {Array<any>}
   */
  yearsArray: Array<any> = [];

  /**
   * Update Question Form
   * @type {FormGroup}
   */
  updateQuestionForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private notifyService: NotificationsService,
    public activeModal: NgbActiveModal,
    private libraryService: MyLibraryService,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    let currentYear = new Date().getFullYear();
    for (let loop = 0; loop < 16; loop++) {
      this.yearsArray.push(--currentYear);
    }
    this.updateQuestionForm = this.formBuilder.group({
      question: [''],
      difficulty: [''],
      explanation: [''],
      choices: this.formBuilder.array([]),
      pastExamName: [''],
      pastExams: this.formBuilder.array([])
    });

    this.initializeform();
  }

  get pastExams(): FormArray {
    return this.updateQuestionForm.get('pastExams') as FormArray;
  }

  get choices(): FormArray {
    return this.updateQuestionForm.get('choices') as FormArray;
  }

  initializeform() {
    this.updateQuestionForm.controls['question'].setValue({
      html: this.question.question,
      delta: this.question.questionDelta
    });
    this.updateQuestionForm.controls['difficulty'].setValue(this.question.difficultyLevel.toString());
    this.updateQuestionForm.controls['explanation'].setValue({
      html: this.question.explanation,
      delta: this.question.explanationDelta
    });

    const choicesArray = <FormArray>this.updateQuestionForm.controls.choices;
    const pastExamsArray = <FormArray>this.updateQuestionForm.controls.pastExams;

    this.question.choices.forEach((choice) => {
      const group = this.formBuilder.group({
        choiceCheckBox: [this.question.rightAnswers.indexOf(choice.id) > -1],
        choiceText: [{ html: choice.text, delta: choice.textDelta }]
      });
      choicesArray.push(group);
    });

    this.question.pastExams.forEach((pastExam) => {
      const control = this.formBuilder.control(pastExam);
      pastExamsArray.push(control);
    });
  }

  /**
   * Method to dynamically add answer choice
   */
  addAnotherChoice() {
    const arrayControl = <FormArray>this.updateQuestionForm.controls.choices;
    const group = this.formBuilder.group({
      choiceCheckBox: [false],
      choiceText: ['']
    });
    arrayControl.push(group);
  }

  /**
   * Method to remove choice at index
   * @param index Choice Index
   */
  removeChoice(index: any) {
    const arrayControl = <FormArray>this.updateQuestionForm.controls.choices;
    arrayControl.removeAt(index);
  }

  /**
   * Method to add past exam entry
   */
  addPastExam() {
    const pastExam = `${this.updateQuestionForm.value.pastExamName}`;
    if (this.updateQuestionForm.value.pastExams.indexOf(pastExam) === -1) {
      if (this.updateQuestionForm.value.pastExamName !== '') {
        const arrayControl = <FormArray>this.updateQuestionForm.controls.pastExams;
        const control = this.formBuilder.control(pastExam);
        arrayControl.push(control);
      }
    } else {
      this.notifyService.error(this.translator.instant('DUPLICATE_PAST_EXAM_ERROR'), '', {
        clickToClose: false
      });
    }
    this.updateQuestionForm.controls.pastExamName.setValue('');
  }

  /**
   * Method to remove past exam
   * @param {*} index Past Exam Item index
   */
  removePastExam(index: any) {
    const arrayControl = <FormArray>this.updateQuestionForm.controls.pastExams;
    arrayControl.removeAt(index);
  }

  /**
   * Custom method to reset add question form
   */
  resetForm() {
    this.updateQuestionForm.reset();

    // Need to do this, as form reset doesnt work for formArray
    // Reset Anser Choices
    const choices = <FormArray>this.updateQuestionForm.controls.choices;
    for (let i = choices.length - 1; i >= 0; i--) {
      choices.removeAt(i);
    }

    // Reset Past Exams
    const exams = <FormArray>this.updateQuestionForm.controls.pastExams;
    for (let index = exams.length - 1; index >= 0; index--) {
      exams.removeAt(index);
    }

    // Need to do this, as form reset doesnt set the select default value on reset
    this.updateQuestionForm.controls.pastExamName.setValue('-1');
  }

  updateQuestion() {
    const updatedQuestion = this.question;

    updatedQuestion.question = this.updateQuestionForm.value.question.html;
    updatedQuestion.questionDelta = this.updateQuestionForm.value.question.delta;
    if (this.updateQuestionForm.value.explanation) {
      updatedQuestion.explanation = this.updateQuestionForm.value.explanation.html;
      updatedQuestion.explanationDelta = this.updateQuestionForm.value.explanation.delta;
    }
    updatedQuestion.difficultyLevel = this.updateQuestionForm.value.difficulty;
    updatedQuestion.choices = [];
    updatedQuestion.rightAnswers = [];

    this.updateQuestionForm.value.choices.forEach((element, index) => {
      const obj = {
        id: index + 1,
        text: element.choiceText.html,
        textDelta: element.choiceText.delta
      };
      if (element.choiceCheckBox) {
        updatedQuestion.rightAnswers.push(index + 1);
      }
      updatedQuestion.choices.push(obj);
    });

    updatedQuestion.pastExams = this.updateQuestionForm.value.pastExams;

    if (updatedQuestion.choices.length < 2) {
      this.notifyService.error('', this.translator.instant('MIN_ANS_CHOICES_ERROR'), {
        clickToClose: false
      });
      return;
    }

    if (updatedQuestion.rightAnswers.length === 0) {
      this.notifyService.error('', this.translator.instant('MIN_RIGHT_ANS_CHOICE_ERROR'), {
        clickToClose: false
      });
      return;
    }

    this.libraryService.updateQuestion(updatedQuestion).subscribe(
      (response) => {
        this.activeModal.close();
        this.notifyService.success(this.translator.instant('UPDATE_QUES_SUCCESS'));
      },
      (error: HttpErrorResponse) => {
        this.notifyService.error(this.translator.instant('UPDATE_QUES_FAILED'), '', { clickToClose: false });
      }
    );
  }
}

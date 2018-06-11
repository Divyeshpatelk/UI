import {
  Component,
  OnInit,
  Input,
  OnChanges,
  EventEmitter,
  Output,
  ViewChild,
  ViewChildren,
  QueryList
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

import { Question } from '../../../_models';
import { MyLibraryService } from '../../services';

@Component({
  selector: 'pdg-update-question',
  templateUrl: './update-question.component.html',
  styleUrls: ['./update-question.component.scss']
})
export class UpdateQuestionComponent implements OnInit, OnChanges {
  /**
   * Question to be updated
   * @type {Question}
   */
  @Input() question: Question;
  @Input() isCsvQuestion: boolean;
  @Output() update: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();

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
  requestInProgress = false;

  /**
   * Creates an instance of UpdateQuestionComponent.
   * @param {FormBuilder} formBuilder
   * @param {NotificationsService} notifyService
   * @param {MyLibraryService} libraryService
   * @param {TranslateService} translator
   */
  constructor(
    private formBuilder: FormBuilder,
    private notifyService: NotificationsService,
    private libraryService: MyLibraryService,
    private translator: TranslateService
  ) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.updateQuestionForm) {
      this.resetForm();
    } else {
      let currentYear = new Date().getFullYear();
      for (let loop = 0; loop < 16; loop++) {
        this.yearsArray.push(--currentYear);
      }
      this.updateQuestionForm = this.formBuilder.group({
        question: ['', Validators.required],
        difficulty: ['', Validators.required],
        explanation: [''],
        choices: this.formBuilder.array([]),
        pastExamName: [''],
        pastExams: this.formBuilder.array([])
      });
    }

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
        choiceText: [{ html: choice.text, delta: choice.textDelta }, Validators.required]
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
      choiceText: ['', Validators.required]
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
    this.updateQuestionForm.controls.pastExamName.setValue('');
  }

  updateQuestion() {
    this.requestInProgress = true;
    const updatedQuestion = this.question;

    // Format Question
    this.question.question = this.updateQuestionForm.value.question.html;
    this.question.questionDelta = this.updateQuestionForm.value.question.delta;

    // Format Explanation
    if (this.updateQuestionForm.value.explanation) {
      this.question.explanation = this.updateQuestionForm.value.explanation.html;
      this.question.explanationDelta = this.updateQuestionForm.value.explanation.delta;
    }

    this.question.difficultyLevel = this.updateQuestionForm.value.difficulty;

    this.question.choices = [];
    this.question.rightAnswers = [];
    this.question.courses = [];
    this.question.updated = true;

    this.updateQuestionForm.value.choices.forEach((element, index) => {
      const obj = {
        id: index + 1,
        text: element.choiceText.html,
        textDelta: element.choiceText.delta
      };
      if (element.choiceCheckBox) {
        this.question.rightAnswers.push(index + 1);
      }
      this.question.choices.push(obj);
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

    if (this.isCsvQuestion === false) {
      this.libraryService.updateQuestion(updatedQuestion).subscribe(
        (response) => {
          this.notifyService.success(this.translator.instant('UPDATE_QUES_SUCCESS'));
          this.resetForm();
          this.update.emit(response);
        },
        (error: HttpErrorResponse) => {
          this.notifyService.error(this.translator.instant('UPDATE_QUES_FAILED'), '', { clickToClose: false });
        },
        () => {
          this.requestInProgress = false;
        }
      );
    } else {
      this.resetForm();
      if (updatedQuestion.errorMessage && updatedQuestion.errorMessage !== null) {
        updatedQuestion.errorMessage = null;
      }
      this.update.emit(updatedQuestion);
    }
  }

  emitCancel() {
    this.cancel.emit();
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';

import { Question } from '../../../_models';
import { UploadContentService, MyLibraryService } from '../../services';
import { ConfirmComponent } from '../../../shared/components';

/**
 * Component class for Add Question Screen.
 *
 * @export
 * @class AddQuestionComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'pdg-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {
  /**
   * Unique ID of the course
   * @type {string}
   */
  @Input() courseId: string;

  /**
   * Unique ID of the subject
   * @type {string}
   */
  @Input() subjectId: string;

  /**
   * Unique ID of the index on which question is added
   * @type {string}
   */
  @Input() indexId: string;

  /**
   * Add Question Form
   * @type {FormGroup}
   */
  addQuestionForm: FormGroup;

  /**
   * Model for Question
   * @type {Question}
   */
  question: Question = {};

  /**
   * Array of questions added in the database
   * @type {Array<Question>}
   */
  questionList: Array<Question> = [];

  /**
   * Selected Question for update
   * @type {Question}
   */
  selectedQuestion: Question;

  /**
   * Editing Mode
   */
  editing = false;

  /**
   * Quill Editor Toolbar Config.
   * This can be customized based on the requirement
   */
  editorConfig;

  /**
   * Array of years for Past Exams Year Dropdown
   * @type {Array<any>}
   */
  yearsArray: Array<any> = [];
  requestInProgress = false;

  /**
   * Creates an instance of AddQuestionComponent.
   * @param {FormBuilder} formBuilder
   * @param {NgbActiveModal} activeModal
   * @param {UploadContentService} uploadService
   * @param {NotificationsService} notifyService
   * @param {MyLibraryService} libraryService
   * @param {TranslateService} translator,
   * @param {NgbModal} NgbModal
   */
  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private uploadService: UploadContentService,
    private notifyService: NotificationsService,
    private libraryService: MyLibraryService,
    private translator: TranslateService,
    private modalService: NgbModal
  ) {
    let currentYear = new Date().getFullYear();
    for (let loop = 0; loop < 16; loop++) {
      this.yearsArray.push(--currentYear);
    }

    this.addQuestionForm = this.formBuilder.group({
      question: ['', Validators.required],
      difficulty: ['', Validators.required],
      explanation: [''],
      choices: this.formBuilder.array([]),
      pastExamName: [''],
      pastExams: this.formBuilder.array([])
    });
  }

  /**
   * Overridden method invoked when component is loaded
   */
  ngOnInit() {
    // Add two choices by default
    this.addAnotherChoice();
    this.addAnotherChoice();
    this.addAnotherChoice();
    this.addAnotherChoice();
  }

  get pastExams(): FormArray {
    return this.addQuestionForm.get('pastExams') as FormArray;
  }

  get choices(): FormArray {
    return this.addQuestionForm.get('choices') as FormArray;
  }

  /**
   * Method invoked when form is submitted
   */
  addQuestion() {
    /**
     * Step 1: Validate Answer Choices and Right Answers
     * Step 2: Call Service API
     * Step 3: Show result of the Service API call.
     *      a) For success, show success message and clear all the fields
     *      b) For error, show error message and keep the form filled.
     * Step 4: Update Questions Array to be displayed in Preview section
     */
    this.requestInProgress = true;
    this.question.type = 'SINGLE';

    // Format Question
    this.question.question = this.addQuestionForm.value.question.html;
    this.question.questionDelta = this.addQuestionForm.value.question.delta;

    // Format Explanation
    if (this.addQuestionForm.value.explanation) {
      this.question.explanation = this.addQuestionForm.value.explanation.html;
      this.question.explanationDelta = this.addQuestionForm.value.explanation.delta;
    }

    this.question.difficultyLevel = this.addQuestionForm.value.difficulty;

    this.question.choices = [];
    this.question.rightAnswers = [];
    this.question.courses = [];

    this.addQuestionForm.value.choices.forEach((element, index) => {
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

    const courseObj = {
      mappingId: this.courseId,
      subjectid: this.subjectId,
      indexid: this.indexId
    };
    this.question.courses.push(courseObj);
    this.question.pastExams = this.addQuestionForm.value.pastExams;

    if (this.question.choices.length < 2) {
      this.notifyService.error('', this.translator.instant('MIN_ANS_CHOICES_ERROR'), {
        clickToClose: false
      });
      return;
    }

    if (this.question.rightAnswers.length === 0) {
      this.notifyService.error('', this.translator.instant('MIN_RIGHT_ANS_CHOICE_ERROR'), {
        clickToClose: false
      });
      return;
    }

    this.uploadService.uploadQuestion(this.question).subscribe(
      (response) => {
        this.notifyService.success(this.translator.instant('ADD_QUES_SUCCESS'));
        this.questionList.unshift(response);
        this.question = {};
        this.resetAddQuestionForm();
      },
      (error: HttpErrorResponse) => {
        this.notifyService.error(this.translator.instant('ADD_QUES_FAILED'), '', { clickToClose: false });
      },
      () => {
        this.requestInProgress = false;
      }
    );
  }

  /**
   * Method to dynamically add answer choice
   */
  addAnotherChoice() {
    const arrayControl = <FormArray>this.addQuestionForm.controls.choices;
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
    const arrayControl = <FormArray>this.addQuestionForm.controls.choices;
    arrayControl.removeAt(index);
  }

  /**
   * Method to add past exam entry
   */
  addPastExam() {
    const pastExam = `${this.addQuestionForm.value.pastExamName}`;
    if (this.addQuestionForm.value.pastExams.indexOf(pastExam) === -1) {
      if (this.addQuestionForm.value.pastExamName !== '') {
        const arrayControl = <FormArray>this.addQuestionForm.controls.pastExams;
        const control = this.formBuilder.control(pastExam);
        arrayControl.push(control);
      }
      this.addQuestionForm.controls.pastExamName.setValue('');
    } else {
      this.notifyService.error(this.translator.instant('DUPLICATE_PAST_EXAM_ERROR'), '', {
        clickToClose: false
      });
    }
  }

  /**
   * Method to remove past exam
   * @param {*} index Past Exam Item index
   */
  removePastExam(index: any) {
    const arrayControl = <FormArray>this.addQuestionForm.controls.pastExams;
    arrayControl.removeAt(index);
  }

  /**
   * Custom method to reset add question form
   */
  resetAddQuestionForm() {
    this.addQuestionForm.reset();

    // Need to do this, as form reset doesnt work for formArray
    // Reset Anser Choices
    const choices = <FormArray>this.addQuestionForm.controls.choices;
    for (let i = choices.length - 1; i >= 4; i--) {
      choices.removeAt(i);
    }

    // Reset Past Exams
    const exams = <FormArray>this.addQuestionForm.controls.pastExams;
    for (let index = exams.length - 1; index >= 0; index--) {
      exams.removeAt(index);
    }

    // Need to do this, as form reset doesnt set the select default value on reset
    this.addQuestionForm.controls.pastExamName.setValue('');
  }

  /**
   * Question Update callback from Question Update Component
   * @param {any} event
   */
  onQuestionUpdate(event) {
    this.editing = false;
    this.resetAddQuestionForm();
  }

  /**
   * Question Update Cancel Callback from Question Update Component
   * @param {any} event
   */
  onQuestionUpdateCancel(event) {
    this.editing = false;
    this.selectedQuestion = {};
    this.resetAddQuestionForm();
  }

  close() {
    // Check if Add Question Form or Update Question Form has one or more fields filled, then show confirm dialog

    // Update Question Mode
    if (this.editing) {
      const modalRef = this.modalService.open(ConfirmComponent);
      modalRef.componentInstance.title = this.translator.instant('WARNING');
      modalRef.componentInstance.text = this.translator.instant('ADD_QUES_UNSAVED_CHANGES');
      modalRef.componentInstance.confirmButtonText = this.translator.instant('OK');
      modalRef.result.then(
        (result) => {
          this.activeModal.dismiss();
        },
        (close) => {
          // Need to add for escape key
        }
      );
    } else {
      if (this.addQuestionForm.touched) {
        const modalRef = this.modalService.open(ConfirmComponent);
        modalRef.componentInstance.title = this.translator.instant('WARNING');
        modalRef.componentInstance.text = this.translator.instant('ADD_QUES_UNSAVED_CHANGES');
        modalRef.componentInstance.confirmButtonText = this.translator.instant('OK');
        modalRef.result.then(
          (result) => {
            this.activeModal.dismiss();
          },
          (close) => {
            // Need to add for escape key
          }
        );
      } else {
        this.activeModal.dismiss();
      }
    }
  }
}

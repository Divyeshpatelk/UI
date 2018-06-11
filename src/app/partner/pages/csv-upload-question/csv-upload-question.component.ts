import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import * as d3 from 'd3-dsv';

import { UploadContentService } from './../../services/upload-content.service';
import { ConfirmComponent } from './../../../shared/components/confirm/confirm.component';
import { Question } from './../../../_models/library-questions';
import { csvConstant } from './../../../_config/mcq-config';


@Component({
  selector: 'pdg-csv-upload-question',
  templateUrl: './csv-upload-question.component.html',
  styleUrls: ['./csv-upload-question.component.scss']
})
export class CsvUploadQuestionComponent implements OnInit {

  /**
   * Array of questions added in the database
   * @type {Array<Question>}
   */
  parsedQuestionList: Array<Question>;

  /**
     * Array of questions recieved from bulk question upload response
     * @type {Array<Question>}
     */
  responseQuestionList: Array<Question>;

  /**
    * Add Csv Question Form
    * @type {FormGroup}
    */
  addCsvQuestionForm: FormGroup;

  /**
   * File element
   * @type {File}
   */
  @Input() fileInput: File;

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
   * Model for Question
   * @type {Question}
   */
  question: Question = {};

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

  get pastExams(): FormArray { return this.addCsvQuestionForm.get('pastExams') as FormArray; }

  get choices(): FormArray { return this.addCsvQuestionForm.get('choices') as FormArray; }


  /**
     * Creates an instance of AddQuestionComponent.
     * @param {FormBuilder} formBuilder
     * @param {NgbActiveModal} activeModal
     * @param {NotificationsService} notifyService
     * @param {TranslateService} translator,
     * @param {NgbModal} NgbModal
     * @param {UploadContentService} uploadService
     */
  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private notifyService: NotificationsService,
    private translator: TranslateService,
    private modalService: NgbModal,
    private uploadContentService: UploadContentService

  ) {
    // Quill Module Config
    this.editorConfig = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],          // toggled buttons
        ['blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],       // superscript/subscript
        ['clean'],                                          // remove formatting button
        ['image']                                           // link and image, video
      ]
    };

    let currentYear = new Date().getFullYear();
    for (let loop = 0; loop < 16; loop++) {
      this.yearsArray.push(--currentYear);
    }
    this.initForm();
  }

  ngOnInit() {
    // Read file when component initialized
    this.readFile(this.fileInput);
  }

  close() {
    const modalRef = this.modalService.open(ConfirmComponent);
    modalRef.componentInstance.title = this.translator.instant('WARNING');
    modalRef.componentInstance.text = this.translator.instant('UPLOAD_CANCEL_CSV_CONFIRM_TEXT');
    modalRef.componentInstance.confirmButtonText = this.translator.instant('YES');
    modalRef.componentInstance.cancelButtonText = this.translator.instant('NO');
    modalRef.result.then((result) => {
      this.activeModal.dismiss();
    }, (error) => {
    });
  }

  /**
     * Method to read csv file
     * @param {any} fileInput
     */
  readFile(fileInput: any): void {
    const file: File = fileInput;
    const fileReader: FileReader = new FileReader();
    fileReader.onloadend = (event: ProgressEvent) => {

      const result = d3.csvParse(fileReader.result, (row) => {
        const questionObj: Question = {
          type: 'SINGLE',
          choices: [],
          rightAnswers: [],
          pastExams: []
        };
        if (row[csvConstant.QUESTION]) {
          questionObj['question'] = row[csvConstant.QUESTION];
        }

        if (row[csvConstant.DIFFICULTY_LEVEL]) {
          questionObj['difficultyLevel'] = row[csvConstant.DIFFICULTY_LEVEL];
        }

        if (row[csvConstant.CHOICE_1]) {
          questionObj.choices.push({
            'id': 1,
            'text': row[csvConstant.CHOICE_1]
          });
        }

        if (row[csvConstant.CHOICE_2]) {
          questionObj.choices.push({
            'id': 2,
            'text': row[csvConstant.CHOICE_2]
          });
        }
        if (row[csvConstant.CHOICE_3]) {
          questionObj.choices.push({
            'id': 3,
            'text': row[csvConstant.CHOICE_3]
          });
        }
        if (row[csvConstant.CHOICE_4]) {
          questionObj.choices.push({
            'id': 4,
            'text': row[csvConstant.CHOICE_4]
          });
        }
        if (row[csvConstant.CHOICE_5]) {
          questionObj.choices.push({
            'id': 5,
            'text': row[csvConstant.CHOICE_5]
          });
        }
        if (row[csvConstant.CHOICE_6]) {
          questionObj.choices.push({
            'id': 6,
            'text': row[csvConstant.CHOICE_6]
          });
        }

        if (row[csvConstant.CORRECT_CHOICE]) {
          const correctChoices = row[csvConstant.CORRECT_CHOICE].split(',').map((element) => {
            return +element;
          });
          questionObj.rightAnswers = correctChoices;
        }

        if (row[csvConstant.EXPLANATION]) {
          questionObj['explanation'] = row[csvConstant.EXPLANATION];
        }
        if (row[csvConstant.PAST_EXAMS]) {
          const pastExams = row[csvConstant.PAST_EXAMS].split(',').map((element) => {
            return element;
          });
          questionObj['pastExams'] = pastExams;
        }

        if (row[csvConstant.KNOWLEDGE_AREA]) {
          questionObj['knowledgeArea'] = row[csvConstant.KNOWLEDGE_AREA];
        }
        return questionObj;
      });
      this.parsedQuestionList = result;
    },
      fileReader.readAsText(file);
  }

  /**
    * Method to initialize form
    */
  initForm() {
    this.addCsvQuestionForm = this.formBuilder.group({
      'question': ['', Validators.required],
      'difficulty': ['', Validators.required],
      'explanation': [''],
      'choices': this.formBuilder.array([]),
      'pastExamMonth': ['-1'],
      'pastExamYear': ['-1'],
      'pastExams': this.formBuilder.array([])
    });
    this.addAnotherChoice();
    this.addAnotherChoice();
  }


  /**
    * Question Update callback from Question Update Component
    * @param {any} event
    */
  onQuestionUpdate(event) {
    this.editing = false;
  }

  /**
   * Method to remove choice at index
   * @param index Choice Index
   */
  removeChoice(index: any) {
    const arrayControl = <FormArray>this.addCsvQuestionForm.controls['choices'];
    arrayControl.removeAt(index);
  }

  /**
   * Method to dynamically add answer choice
   */
  addAnotherChoice() {
    const arrayControl = <FormArray>this.addCsvQuestionForm.controls.choices;
    const group = this.formBuilder.group({
      choiceCheckBox: [false],
      choiceText: ['', Validators.required]
    });
    arrayControl.push(group);
  }

  /**
   * Method to add past exam entry
   */
  addPastExam() {
    const pastExam = `${this.addCsvQuestionForm.value.pastExamMonth} ${this.addCsvQuestionForm.value.pastExamYear}`;
    if (this.addCsvQuestionForm.value.pastExams.indexOf(pastExam) === -1) {
      if (this.addCsvQuestionForm.value.pastExamMonth !== '-1' && this.addCsvQuestionForm.value.pastExamYear !== '-1') {
        const arrayControl = <FormArray>this.addCsvQuestionForm.controls.pastExams;
        const control = this.formBuilder.control(pastExam);
        arrayControl.push(control);
      }

    } else {
      this.notifyService.error(this.translator.instant('DUPLICATE_PAST_EXAM_ERROR'), '', {
        clickToClose: false
      });
    }

    this.addCsvQuestionForm.controls.pastExamMonth.setValue('-1');
    this.addCsvQuestionForm.controls.pastExamYear.setValue('-1');
  }


  /**
   * Method to remove past exam
   * @param {*} index Past Exam Item index
   */
  removePastExam(index: any) {
    const arrayControl = <FormArray>this.addCsvQuestionForm.controls.pastExams;
    arrayControl.removeAt(index);
  }


  /**
    * Method to reset form
    */
  resetAddCsvQuestionForm() {
    this.addCsvQuestionForm.reset();
    // Reset choices and pastExams
    this.addCsvQuestionForm.controls.choices = this.formBuilder.array([]);
    this.addCsvQuestionForm.controls.pastExams = this.formBuilder.array([]);

    // Need to do this, as form reset doesnt set the select default value on reset
    this.addCsvQuestionForm.controls.pastExamMonth.setValue('-1');
    this.addCsvQuestionForm.controls.pastExamYear.setValue('-1');
  }


  /**
    * Question Update Cancel Callback from Question Update Component
    * @param {any} event
    */
  onQuestionUpdateCancel(event) {
    this.editing = false;
    this.selectedQuestion = {};
    this.resetAddCsvQuestionForm();
  }

  /**
    * Method to Add all uploaded questions from csv file.
    */
  submit() {

    if (this.editing) {
      const modalRef = this.modalService.open(ConfirmComponent);
      modalRef.componentInstance.title = this.translator.instant('WARNING');
      modalRef.componentInstance.text = this.translator.instant('ADD_QUES_UNSAVED_CHANGES');
      modalRef.componentInstance.confirmButtonText = this.translator.instant('OK');
      modalRef.result.then((result) => {
        this.activeModal.dismiss();
      }, (error) => {

      });
    } else {
      if (this.parsedQuestionList) {
        const courseObj = {
          'mappingId': this.courseId,
          'subjectid': this.subjectId,
          'indexid': this.indexId
        };
        this.parsedQuestionList[0].courses = [courseObj];
        this.uploadContentService.uploadBulkMcq(this.parsedQuestionList).subscribe(response => {
          this.notifyService.success(
            this.translator.instant('ADD_BULK_QUES_SUCCESS', { count: response.length })
          );
          this.activeModal.close();
        }, (error: HttpErrorResponse) => {
          // store response in new array
          this.responseQuestionList = error.error.responseObject;
          if (this.responseQuestionList && (this.responseQuestionList !== null || this.responseQuestionList !== undefined)) {
            // get the questions having error from response
            this.parsedQuestionList = this.responseQuestionList.filter(question => {
              return question.errorMessage !== null;
            });
            const totalQuestionCount = this.responseQuestionList.length;
            const succcessQuestionCount = totalQuestionCount - this.parsedQuestionList.length;
            this.notifyService.error(
              this.translator.instant('ADD_BULK_QUES_SUCCESS', { count: succcessQuestionCount }),
              this.translator.instant('ADD_BULK_QUES_ERROR', { count: this.parsedQuestionList.length })
            );
          }

        });
      } else {
        return;
      }
    }
  }

}



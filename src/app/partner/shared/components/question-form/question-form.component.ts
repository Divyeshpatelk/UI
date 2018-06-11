import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

import { Question } from '../../../../_models';

const defaultChoiceCount = 4;
const pastYearCount = 16;

export function correctAnswerValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const answers: any[] = control.value;
    const notEmptyAnswers = answers.filter((answer) => answer.choiceText);
    const correctAnswers = notEmptyAnswers.filter((answer) => answer.choiceCheckBox);
    return correctAnswers.length > 0
      ? null
      : {
          choices: {
            message: 'No right answer selected'
          }
        };
  };
}

@Component({
  selector: 'pdg-question-form',
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss']
})
export class QuestionFormComponent implements OnInit, OnChanges {
  questionForm: FormGroup;
  choices: FormArray;
  pastExams: FormArray;

  yearsArr = [];
  isUpdate = false;

  @Input() question: Question;
  @Output() submitEvent: EventEmitter<Question> = new EventEmitter();
  @Output() resetEvent: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    let currentYear = new Date().getFullYear();
    for (let i = 0; i < pastYearCount; i++) {
      this.yearsArr.push(--currentYear);
    }

    this.choices = this.formBuilder.array([], correctAnswerValidator());
    this.pastExams = this.formBuilder.array([]);
    this.questionForm = this.formBuilder.group({
      question: ['', Validators.required],
      difficulty: ['', Validators.required],
      choices: this.choices,
      explanation: [''],
      pastExamName: [''],
      pastExams: this.pastExams
    });

    if (this.question) {
      this.patchValue(this.question);
      this.isUpdate = true;
    } else {
      this.createChoices(defaultChoiceCount);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.question && changes.question.currentValue) {
      this.reset(0);
      this.patchValue(changes.question.currentValue);
      this.isUpdate = true;
    } else if (!changes.question.firstChange) {
      this.reset();
    }
  }

  createChoices(count) {
    for (let i = 0; i < 4; i++) {
      this.addChoice();
    }
  }

  patchValue(question) {
    const value = {
      question: {
        html: question.question,
        delta: question.questionDelta
      },
      difficulty: question.difficultyLevel.toString(),
      explanation: {
        html: question.explanation,
        delta: question.explanationDelta
      }
    };

    this.questionForm.patchValue(value);

    question.choices.forEach((choice) => this.addChoice(choice));
    question.pastExams.forEach((pastExam) => this.addPastExam(pastExam));
  }

  createChoice(choice?): FormGroup {
    let checkBoxValue = false;
    let choiceText = null;
    if (choice) {
      checkBoxValue = this.question.rightAnswers.indexOf(choice.id) > -1;
      choiceText = { html: choice.text, delta: choice.textDelta };
    }
    return this.formBuilder.group({
      choiceCheckBox: [checkBoxValue],
      choiceText: [choiceText]
    });
  }

  addChoice(choice?): void {
    this.choices.push(this.createChoice(choice));
  }

  removeChoice(index: any) {
    this.choices.removeAt(index);
  }

  createPastExam(pastExam) {
    return this.formBuilder.control(pastExam);
  }

  addPastExam(pastExam?): void {
    if (!pastExam) {
      const examName = this.questionForm.value.pastExamName;

      if (examName !== '') {
        pastExam = `${examName}`;
        if (this.questionForm.value.pastExams.indexOf(pastExam) === -1) {
          this.pastExams.push(this.createPastExam(pastExam));
          this.questionForm.get('pastExamName').reset('');
        }
      }
    } else {
      this.pastExams.push(this.createPastExam(pastExam));
    }
  }

  removePastExam(index: any) {
    this.pastExams.removeAt(index);
  }

  reset(choiceCount = defaultChoiceCount) {
    for (let count = this.choices.length; count > 0; count--) {
      const controlIndex = count - 1;
      if (count > choiceCount) {
        this.choices.removeAt(controlIndex);
      } else {
        this.choices.at(controlIndex).reset();
      }
    }

    if (this.choices.length < choiceCount) {
      this.createChoices(choiceCount - this.choices.length);
    }

    for (let count = this.pastExams.length; count > 0; count--) {
      this.pastExams.removeAt(count - 1);
    }

    this.questionForm.reset();
    this.isUpdate = false;
  }

  resetQuestionForm() {
    this.reset();
    this.resetEvent.emit();
  }

  submitForm() {
    const notEmptyChoices = this.questionForm.value.choices.filter((choice) => choice.choiceText);
    const choicesWithId = notEmptyChoices.map((choice, index) => {
      choice['id'] = index + 1;
      return choice;
    });
    const rightAnswers = choicesWithId.filter((choice) => choice.choiceCheckBox).map((choice) => choice.id);
    const choicesForQuestion = choicesWithId.map((choice) => {
      return {
        id: choice.id,
        text: choice.choiceText.html,
        textDelta: choice.choiceText.delta
      };
    });

    const question: Question = {
      question: this.questionForm.value.question.html,
      questionDelta: this.questionForm.value.question.delta,
      choices: choicesForQuestion,
      difficultyLevel: this.questionForm.value.difficulty,
      explanation: this.questionForm.value.explanation && this.questionForm.value.explanation.html,
      explanationDelta: this.questionForm.value.explanation && this.questionForm.value.explanation.delta,
      pastExams: this.questionForm.value.pastExams,
      rightAnswers
    };
    if (this.question && this.question.id) {
      question.id = this.question.id;
      question.created = this.question.created;
      question.createdDate = this.question.createdDate;
      question.deleted = this.question.deleted;
      question.deletedOn = this.question.deletedOn;
      question.errorMessage = this.question.errorMessage;
      question.hint = this.question.hint;
      question.lastModified = this.question.lastModified;
      question.lastModifiedDate = this.question.lastModifiedDate;
      question.sourceName = this.question.sourceName;
      question.testId = this.question.testId;
    }

    this.submitEvent.emit(question);
    this.isUpdate = false;
  }
}

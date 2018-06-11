import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Question } from '../../../../_models';
import { CustomTestHelperService, TimerService } from '../../../../shared/services';
import { QuestionInfo, QuestionBundle } from '../../../../_models/practice-test';

@Component({
  selector: 'pdg-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  /**
   * Flags Model (Flag / MarkedReview)
   * @type {*}
   */
  public flags: any = {};

  /**
   * Variable to hold Show Right ans option config
   * @type {boolean}
   */
  public isShowRightAnsEnabled: boolean;

  /**
   * Variable to Show / hide Details
   */
  public showDetails = false;

  /**
   * Variable to enable disable reset button
   */
  public enableReset = false;

  /**
   * Variable to hold Current Question
   * @type {Question}
   */
  public question: Question;

  /**
   * Variable to hold Current Question Index in section
   */
  public quesIndex = 0;

  /**
   * Variable to hold Current Section Index
   */
  public sectionId = 0;

  /**
   * Variable to hold timer Value
   */
  public timer = 0;

  /**
   * Creates an instance of QuestionComponent.
   * @param {CustomTestHelperService} customTestHelper CustomTestHelperService Instance
   * @param {TimerService} timerService TimerService Instance
   */
  constructor(
    private customTestHelper: CustomTestHelperService,
    private timerService: TimerService) {
    this.flags = {
      'flag': false,
      'markedReview': false
    };
  }

  ngOnInit() {
    this.isShowRightAnsEnabled = this.customTestHelper.isShowRightAnsOptionEnabled;

    // Question Changed Subscription
    this.customTestHelper._currentQuestion.subscribe((questionBundle: QuestionBundle) => {
      if (questionBundle !== null) {

        this.question = questionBundle.question;
        this.quesIndex = questionBundle.localIndex;
        if (this.isShowRightAnsEnabled) {
          // question already visited
          if (questionBundle.questionFlagData.validated) {
            this.showDetails = true;
            if (questionBundle.questionInfo.userAnswers !== null) {
              this.setAnswerChoices(questionBundle.questionInfo.userAnswers);

            } else {
              this.resetAnswerChoices();
            }

            this.timer = questionBundle.questionInfo.timeTaken;

            // Question is not visited yet
          } else {
            this.showDetails = false;
            this.resetAnswerChoices();
            this.timerService.startQuestionTimer(questionBundle.questionInfo.timeTaken);
            this.timerService.questionTimer$.subscribe((v) => this.timer = v);
          }

        } else {
          /**
           * Check in question bundle, if question bundle contains user answers object.
           * It implies this is a answered question. So initialize it accordingly.
           * Also check for flag data in question bundle and set it accordingly
           */
          if (questionBundle.questionInfo.userAnswers !== null && questionBundle.questionInfo.userAnswers.length !== 0) {
            this.enableReset = true;
            this.setAnswerChoices(questionBundle.questionInfo.userAnswers);

          } else {
            this.enableReset = false;
            this.resetAnswerChoices();
          }

          this.timerService.startQuestionTimer(questionBundle.questionInfo.timeTaken);
          this.timerService.questionTimer$.subscribe((v) => this.timer = v);
        }

        this.flags.flag = questionBundle.questionInfo.flag;
        this.flags.markedReview = questionBundle.questionFlagData.markedReview;
      }
    });
  }

  markFlagged() {
    this.customTestHelper.updateQuestionFlags(this.question.id, 'flag', this.flags.flag);
  }

  markForReview() {
    this.customTestHelper.updateQuestionFlags(this.question.id, 'markedReview', this.flags.markedReview);
  }

  /**
   * This method is invoked when user selects answer choices
   */
  onUserAnswerChange(userChoice?) {
    const questionObj = this.updateQuestionInfoObject(userChoice);
    this.customTestHelper.updateCurrentQuestion(questionObj);
  }

  /**
   * This method is invoked when user explicitly clicks on Show Right Ans Button
   */
  validateAnswer() {
    this.showDetails = true;
    const questionObj = this.updateQuestionInfoObject();
    this.customTestHelper.validateUserAnswer(questionObj);
  }

  private updateQuestionInfoObject(userChoice?) {
    /**
     * Get the question object from local storage. So that we have the latest object of the current question
     */
    const answeredQuestions: QuestionInfo[] = (JSON.parse(localStorage.getItem('customTestData')).questionInfo);

    const updatedQuestion: QuestionInfo = answeredQuestions.filter(question => question.questionId === this.question.id)[0];
    updatedQuestion.userAnswers = [];

    if (this.question.rightAnswers.length === 1) {
      this.question.choices.map((choice) => {
        if (choice.id !== userChoice) {
          choice.selected = false;
        }
      });

    }
    // checkbox values
    const answerArray = this.question.choices.filter(choice => choice.selected === true);
    if (answerArray.length) {
      this.enableReset = true;
    } else {
      this.enableReset = false;
    }

    answerArray.forEach(answer => {
      updatedQuestion.userAnswers.push(answer.id);
    });

    return updatedQuestion;
  }

  /**
   * This method is used to set answer choices when user comes back to the same question
   * @private
   * @param {any} userAnswers UserAnswers Array
   */
  private setAnswerChoices(userAnswers) {
    // Set the Radio buttons and Checkbox state
    userAnswers.forEach(answer => {
      const _choice = this.question.choices.filter(choice => choice.id === answer)[0];
      _choice.selected = true;
    });
  }

  /**
   * This method is used to reset the choices when user comes back to same question and choice needs to be reset
   * @private
   */
  resetAnswerChoices(hard?: boolean) {
    this.question.choices.forEach((choice) => {
      choice.selected = false;
    });

    if (hard) {
      this.onUserAnswerChange(0);
    }

  }

  @HostListener('contextmenu')
  rightClickFalse() {
    return false;
  }

  @HostListener('copy') onCopy() {
    return false;
  }
}

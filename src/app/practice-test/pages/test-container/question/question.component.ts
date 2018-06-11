import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Question } from '../../../../_models';
import { PracticeTestHelperService, TimerService } from '../../../../shared/services';
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
   * Variable to hold selected ans in case of radio button
   */
  public selectedAns;

  /**
   * Variable to hold Current Question
   * @type {Question}
   */
  public question: Question;

  /**
   * Variable to hold Current Question Index
   */
  public quesIndex = 0;

  /**
   * Variable to hold timer Value
   */
  public timer = 0;

  /**
   * Creates an instance of QuestionComponent.
   * @param {PracticeTestHelperService} practiceTestHelper PracticeTestHelperService Instance
   * @param {TimerService} timerService TimerService Instance
   */
  constructor(
    private practiceTestHelper: PracticeTestHelperService,
    private timerService: TimerService) {
    this.flags = {
      'flag': false,
      'markedReview': false
    };
  }

  ngOnInit() {
    this.isShowRightAnsEnabled = this.practiceTestHelper.isShowRightAnsOptionEnabled;

    // Question Changed Subscription
    this.practiceTestHelper._currentQuestion.subscribe((questionBundle: QuestionBundle) => {
      if (questionBundle !== null) {

        this.question = questionBundle.question;
        this.quesIndex = questionBundle.questionFlagData.index;

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
          if (questionBundle.questionInfo.userAnswers !== null) {
            this.setAnswerChoices(questionBundle.questionInfo.userAnswers);

          } else {
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
    this.practiceTestHelper.updateQuestionFlags(this.question.id, 'flag', this.flags.flag);
  }

  markForReview() {
    this.practiceTestHelper.updateQuestionFlags(this.question.id, 'markedReview', this.flags.markedReview);
  }

  /**
   * This method is invoked when user selects answer choices
   */
  onUserAnswerChange() {
    const questionObj = this.updateQuestionInfoObject();
    this.practiceTestHelper.updateCurrentQuestion(questionObj);
  }

  /**
   * This method is invoked when user explicitly clicks on Show Right Ans Button
   */
  validateAnswer() {
    this.showDetails = true;
    const questionObj = this.updateQuestionInfoObject();
    this.practiceTestHelper.validateUserAnswer(questionObj);
  }

  private updateQuestionInfoObject() {
    /**
     * Get the question object from local storage. So that we have the latest object of the current question
     */
    const answeredQuestions: QuestionInfo[] = (JSON.parse(localStorage.getItem('testData')).questionsInfo);

    const updatedQuestion: QuestionInfo = answeredQuestions.filter(question => question.questionId === this.question.id)[0];
    updatedQuestion.userAnswers = [];

    if (this.question.rightAnswers.length === 1) {
      updatedQuestion.userAnswers.push(parseInt(this.selectedAns, 0));

    } else {
      // checkbox values
      const answerArray = this.question.choices.filter(choice => choice.selected === true);
      answerArray.forEach(answer => {
        updatedQuestion.userAnswers.push(answer.id);
      });
    }

    return updatedQuestion;
  }

  /**
   * This method is used to set answer choices when user comes back to the same question
   * @private
   * @param {any} userAnswers UserAnswers Array
   */
  private setAnswerChoices(userAnswers) {
    // Set the Radio buttons and Checkbox state
    if (userAnswers.length === 1) {
      this.selectedAns = userAnswers[0].toString();

    } else {
      // Checkbox scenario
      userAnswers.forEach(answer => {
        const _choice = this.question.choices.filter(choice => choice.id === answer)[0];
        _choice.selected = true;
      });
    }
  }

  /**
   * This method is used to reset the choices when user comes back to same question and choice needs to be reset
   * @private
   */
  private resetAnswerChoices() {
    this.selectedAns = 0;
    this.question.choices.forEach(choice => {
      choice.selected = false;
    });
  }

  @HostListener('contextmenu') rightClickFalse() {
    return false;
  }

  @HostListener('copy') onCopy() {
    return false;
  }

}

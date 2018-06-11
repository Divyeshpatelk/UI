import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {
  Course,
  PracticeTestData,
  PracticeTestStatus,
  Question,
  QuestionInfo,
  QuestionFlagsData,
  QuestionBundle,
  Subject
} from '../../_models';
import { APIConfig } from '../../_config/api-config';
import { TimerService } from './timer.service';
import { SubjectIndex } from '../../_models/subject';

@Injectable()
export class PracticeTestHelperService {

  /**
   * Array of Questions
   * @private
   * @type {Question[]}
   */
  private questions: Question[];

  /**
   * Array of QuestionsInfo Objects.
   * QuestionInfo is the array used for sending updated data to server
   * @private
   * @type {QuestionInfo[]}
   */
  private questionsInfo: QuestionInfo[];

  /**
   * Array of QuestionFlagsData
   * Designed to hold flags (attended, unattended, markedReview, correct, incorrect, skipped) status for each question
   * @private
   * @type {QuestionFlagsData[]}
   */
  private questionFlagsData: QuestionFlagsData[];

  /**
   * Object of the Generated Practice Test
   * @private
   * @type {PracticeTestData}
   */
  private generatedPracticeTest: PracticeTestData;

  /**
   * Object to hold current viewing question
   *
   * @private
   * @type {QuestionBundle} Question bundle contains Question, Question Info and Question flag data.
   */
  private currentQuestionBundle: QuestionBundle = {};

  /**
   * Array of Selected Subject Indexes
   * @type {SubjectIndex[]}
   */
  private selectedIndexes: SubjectIndex[];

  /**
   * Variable to hold Show Right Ans Option Config
   */
  public isShowRightAnsOptionEnabled = false;

  /**
   * Variable to hold time limit value
   * @type {*}
   */
  public timeLimit: any;

  /**
   * Observable for Current Selected Question
   * @type {BehaviorSubject<QuestionBundle>}
   */
  public _currentQuestion: BehaviorSubject<QuestionBundle>;

  /**
   * Observable for Questions Flag Data
   * @type {BehaviorSubject<QuestionFlagsData[]>}
   */
  public _quesFlagsData: BehaviorSubject<QuestionFlagsData[]>;

  /**
   * Creates an instance of PracticeTestHelperService.
   * @param {HttpClient} http HttpClient Instance
   * @param {TimerService} timerService TimerService Instance
   */
  constructor(private http: HttpClient, private timerService: TimerService) {
    this._currentQuestion = new BehaviorSubject<QuestionBundle>(null);
    this._quesFlagsData = new BehaviorSubject<QuestionFlagsData[]>(null);

    this.currentQuestionBundle.question = {};
    this.currentQuestionBundle.questionInfo = {};
    this.currentQuestionBundle.questionFlagData = {};

    const practiceTestData = this.getTestDataFromLocalStorage();
    if (practiceTestData !== null) {
      this.setPracticeTest(practiceTestData);
    }
  }

  /**
   * Initial method called when practice test is generated
   * This method is responsible for setting the Flags data and local storage on test startup
   *
   * @param {PracticeTestData} practiceTest PracticeTestData
   */
  setPracticeTest(practiceTestData) {
    this.selectedIndexes = practiceTestData.selectedIndexes;
    this.generatedPracticeTest = practiceTestData.practiceTest;

    this.questions = this.generatedPracticeTest.questions;

    // If questionsInfo is null / undefined, then it means it is generated test and its reloaded again
    if (practiceTestData.questionsInfo === null || practiceTestData.questionsInfo === undefined) {
      this.questionsInfo = this.generatedPracticeTest.questionInfo;
      this.setQuestionsInfoArrayInLocalStorage(this.questionsInfo);

      // else take it from the localstorage object
    } else {
      this.questionsInfo = practiceTestData.questionsInfo;
    }

    // Similarly for QuestionsFlagData
    if (practiceTestData.questionFlagsData === null || practiceTestData.questionFlagsData === undefined) {
      this.setUpQuestionsFlagData();

    } else {
      this.questionFlagsData = practiceTestData.questionFlagsData;
    }

    this.isShowRightAnsOptionEnabled = practiceTestData.isShowRightAnsOptionEnabled;
    this.timeLimit = this.generatedPracticeTest.timeLimit * 60;

    this.setQuestionsFlagDataInLocalStorage(this.questionFlagsData);
    this._quesFlagsData.next(this.questionFlagsData);

    // Select First question when test is generated
    if (this.timerService.timer$) {
      this.timerService.stopTimer();
    }
    this.timerService.startTimer(this.timeLimit);
    this.selectQuestion(0);
  }

  /**
   * Method to set the data in localstorage
   * @private
   * @param {any} array
   */
  private setQuestionsInfoArrayInLocalStorage(array) {
    const obj = JSON.parse(localStorage.getItem('testData'));
    obj.questionsInfo = array;
    localStorage.setItem('testData', JSON.stringify(obj));
  }

  /**
   * Method to get the data from local storage
   * @private
   * @returns QuestionsInfoArray
   */
  private getQuestionsInfoArrayFromLocalStorage() {
    const obj = JSON.parse(localStorage.getItem('testData'));
    return obj.questionsInfo;
  }

  /**
   * Method to clear the test data saved in local storage on test finish
   */
  private removeTestDataFromLocalStorage() {
    localStorage.removeItem('testData');
  }

  /**
   * Method to set QuestionsFlagData in localStorage
   * @private
   * @param {any} array
   */
  private setQuestionsFlagDataInLocalStorage(array) {
    const obj = JSON.parse(localStorage.getItem('testData'));
    obj.questionFlagsData = array;
    localStorage.setItem('testData', JSON.stringify(obj));
  }

  /**
   * Method to get the QuestionFlagsData from localStorage
   * @private
   * @returns
   */
  private getQuestionsFlagDataFromLocalStorage() {
    const obj = JSON.parse(localStorage.getItem('testData'));
    return obj.questionFlagsData;
  }

  private getTestDataFromLocalStorage() {
    return JSON.parse(localStorage.getItem('testData'));
  }

  /**
   * This method initializes the flags data for each question on test startup
   * @private
   */
  private setUpQuestionsFlagData() {
    this.questionFlagsData = [];

    this.questions.forEach((question, index) => {
      const quesMetaData: QuestionFlagsData = {
        index: index,
        markedReview: false,
        unattended: true,
        skipped: false,
        correct: false,
        incorrect: false,
        attended: false,
        validated: false
      };
      this.questionFlagsData.push(quesMetaData);
    });
  }

  /**
   * This method is called when user navigates to other question using Next, Prev or Direct Jump
   * This method updates the currentQuestionBundle with the selected Question
   *
   * @param {number} index Index of the selected Question
   */
  selectQuestion(index: number) {

    // Set the Current Question Object
    // Set Question Object
    this.currentQuestionBundle.question = this.questions[index];

    // Get the question info object from localStorage
    const questionsInfoArray = this.getQuestionsInfoArrayFromLocalStorage();

    // Set QuestionInfo Object
    this.currentQuestionBundle.questionInfo = questionsInfoArray[index];

    // Get the QuestionsFlag data from local Storage
    const questionsFlagArray = this.getQuestionsFlagDataFromLocalStorage();

    // Set QuestionFlagData Object
    this.currentQuestionBundle.questionFlagData = questionsFlagArray[index];

    // Send the current question subscription
    this._currentQuestion.next(this.currentQuestionBundle);
  }

  /**
   * This method is invoked when user selects answer for any question
   * This method updates the currentQuestionBundle Object with the updated status
   * send by the user.
   * It also updates the flags for the selected question. (ATTENDED : true, UNATTENDED : false, SKIPPED : false)
   * Also updates the FlagsData Array and send the subscription to the subscriber
   *
   * @param {QuestionInfo} _questionInfo Updated Question Info Object
   */
  updateCurrentQuestion(_questionInfo: QuestionInfo) {

    // Update the current Question Object
    this.currentQuestionBundle.questionInfo = _questionInfo;

    // Also update the flags status
    const index = this.questions.findIndex(question => question.id === _questionInfo.questionId);
    const quesFlagData: QuestionFlagsData = this.questionFlagsData[index];
    quesFlagData.unattended = false;
    quesFlagData.skipped = false;

    if (!this.isShowRightAnsOptionEnabled) {
      quesFlagData.attended = true;
    }

    this.currentQuestionBundle.questionFlagData = quesFlagData;

    this.setQuestionsFlagDataInLocalStorage(this.questionFlagsData);
    this._quesFlagsData.next(this.questionFlagsData);
  }

  /**
   * This method is invoked on NEXT, PREV or direct question jump click.
   * This method is responsible for handling the scenarios of whether PracticeTest save needs to be called or not.
   *
   * @param {number} currentIndex Current Question index
   * @param {number} nextIndex Next Question Index
   */
  moveToNextQuestion(currentIndex: number, nextIndex: number) {

    /**
     * Stop the Question Timer and update the timetaken attribute for the question in current question bundle
     * as well as in local storage.
     */
    const timeTaken = this.timerService.stopQuestionTimer();
    if (timeTaken !== undefined) {
      this.currentQuestionBundle.questionInfo.timeTaken = timeTaken;
    }

    // Get the questionsInfo array from local storage.
    const array = this.getQuestionsInfoArrayFromLocalStorage();

    // Update the data in local storage
    const updatedQuestion: QuestionInfo = array[currentIndex];
    if (timeTaken !== undefined) {
      updatedQuestion.timeTaken = timeTaken;
    }

    this.setQuestionsInfoArrayInLocalStorage(array);

    /**
     * If Show Right Ans Option is enabled, then check whether the question was already validated
     * or not. If validated->true, then we don't need to do anything, else validate the answer
     */
    if (this.isShowRightAnsOptionEnabled) {
      // Show Right Ans option is enabled
      if (!this.currentQuestionBundle.questionFlagData.validated) {
        this.validateUserAnswer(this.currentQuestionBundle.questionInfo);
      }

      /**
       * Show Right Ans option is disabled.
       * Step 1: Get the QuestionInfo Object for the current index from local storage
       * Step 2: Get the QuestionInfo Object from the current question bundle Object
       * Step 3: Compare the userAnswers Property in both the above objects.
       *      3.1: If both are null,
       *           a) set SKIPPED -> true, UNATTENDED -> false
       *           b) Check for flag status, if different -> call the savePracticeTest API
       *      3.2: If Step 1 array is null and Step 2 array is not null
       *           a) Call savePracticeTest API
       *      3.3: If both are not null and are not equal or flag status is different
       *           a) call savePracticeTest API
       * Step 4: Call selectQuestion method with next question index
       */
    } else {
      // Get the questionsInfo array from local storage.
      const quesInfoArray = this.getQuestionsInfoArrayFromLocalStorage();

      // Get the Question Object of the current index from question info array
      const questionInfoObj: QuestionInfo = quesInfoArray[currentIndex];

      // arr1 is the user answers array from local storage questionsInfo array
      const arr1 = questionInfoObj.userAnswers;

      // arr2 is the user answers array from current question object
      const arr2 = this.currentQuestionBundle.questionInfo.userAnswers;

      // if both are null, then it means user didn't attended that question, so marking it as skipped
      if (arr1 === null && arr2 === null) {
        const quesFlagData: QuestionFlagsData = this.questionFlagsData[currentIndex];
        quesFlagData.skipped = true;
        quesFlagData.unattended = false;

        this.setQuestionsFlagDataInLocalStorage(this.questionFlagsData);
        this._quesFlagsData.next(this.questionFlagsData);

        if (questionInfoObj.flag !== this.currentQuestionBundle.questionInfo.flag) {
          this.savePracticeTest(PracticeTestStatus.RUNNING, 0).subscribe(response => {
            console.log(response);
          });
        }

      } else if (arr1 === null && arr2 !== null) {
        this.savePracticeTest(PracticeTestStatus.RUNNING, 0).subscribe(response => {
          console.log(response);
        });

      } else if (!this.isArraysEqual(questionInfoObj.userAnswers, this.currentQuestionBundle.questionInfo.userAnswers)
        || (questionInfoObj.flag !== this.currentQuestionBundle.questionInfo.flag)) {
        this.savePracticeTest(PracticeTestStatus.RUNNING, 0).subscribe(response => {
          console.log(response);
        });
      }
    }

    // Move to the next index question
    this.selectQuestion(nextIndex);
  }

  /**
   * This method is invoked when user clicks on Flag / Mark For Review button
   *
   * @param {string} questionId Question Id of the marked Question
   * @param {string} flagName Flag Name (flag / markedReview)
   * @param {boolean} state Flag status (true / false)
   */
  updateQuestionFlags(questionId: string, flagName: string, state: boolean) {

    /**
     * FlagName === 'flag', update only the currentQuestionBundle Object flag status
     */
    if (flagName === 'flag') {
      this.currentQuestionBundle.questionInfo.flag = state;

      /**
       * Flag is other then 'flag', then
       * a) Get the index of the Question Marked
       * b) Update the QuestionFlagsData Array and send the subscription
       * c) Update the Current Question Bundle Flags Data
       */
    } else {
      const index = this.questionsInfo.findIndex(question => question.questionId === questionId);
      const markedQuestion: QuestionFlagsData = this.questionFlagsData[index];
      markedQuestion[flagName] = state;

      this.currentQuestionBundle.questionFlagData = markedQuestion;

      this.setQuestionsFlagDataInLocalStorage(this.questionFlagsData);
      this._quesFlagsData.next(this.questionFlagsData);
    }
  }

  private isArraysEqual(arr1: Array<number>, arr2: Array<number>) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = arr1.length; i--;) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * This method is used when showRightAns Option is enabled in Practice Test Config Page.
   * When user moves from one question to other, the answer is validated.
   * a) If user didnt attempted the question, then its marked as incorrect.
   * b) If user attempted the question, then check the user answer and mark it correct / incorrect
   * c) Mark Validated flag -> true
   * d) Update the currentQuestionBundle Object
   * e) Update the QuestionFlagsData Array and send the subscription
   * f) Call the SavePracticeTest API
   *
   * @param {QuestionInfo} questionInfo QuestionInfo Object of the attempted Question
   */
  validateUserAnswer(questionInfo: QuestionInfo) {
    const index = this.questionsInfo.findIndex(question => question.questionId === questionInfo.questionId);
    const markedQuestion: QuestionFlagsData = this.questionFlagsData[index];
    markedQuestion.unattended = false;

    if (questionInfo.userAnswers === null || questionInfo.userAnswers.length === 0) {
      markedQuestion.incorrect = true;

    } else {
      if (this.isArraysEqual(questionInfo.rightAnswers, questionInfo.userAnswers)) {
        markedQuestion.correct = true;

      } else {
        markedQuestion.incorrect = true;
      }
    }

    markedQuestion.validated = true;
    this.currentQuestionBundle.questionInfo = questionInfo;
    this.currentQuestionBundle.questionFlagData = markedQuestion;

    this.setQuestionsFlagDataInLocalStorage(this.questionFlagsData);
    this._quesFlagsData.next(this.questionFlagsData);

    this.savePracticeTest(PracticeTestStatus.RUNNING, 0).subscribe(response => {
      console.log(response);
    });
  }

  /**
   * This method is responsible for actual API call to save the practice test data
   * a) Get the QuestionInfo Array from LocalStorage
   * b) Updates the QuestionInfo for Current Question Bundle object
   * c) Set the QuestionInfo back to localstorage
   * d) Call backend API
   *
   * @param {string} status Status of the Test (RUNNING, FINISH)
   * @param {number} time Time taken, -> ignored in case of status running or question limit based test
   * @returns
   */
  savePracticeTest(status: PracticeTestStatus, time: number) {

    // const timeTaken = this.timerService.stopQuestionTimer();
    // this.currentQuestionBundle.questionInfo.timeTaken = timeTaken;

    // Get the questionsInfo array from local storage.
    const quesInfoArray = this.getQuestionsInfoArrayFromLocalStorage();

    // Update the data in local storage
    const updatedQuestion: QuestionInfo = quesInfoArray.filter(question =>
      question.questionId === this.currentQuestionBundle.question.id)[0];

    updatedQuestion.userAnswers = this.currentQuestionBundle.questionInfo.userAnswers;
    updatedQuestion.flag = this.currentQuestionBundle.questionInfo.flag;
    updatedQuestion.timeTaken = this.currentQuestionBundle.questionInfo.timeTaken;

    this.setQuestionsInfoArrayInLocalStorage(quesInfoArray);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const practiceTestData = {
      'id': this.generatedPracticeTest.id,
      'questionInfo': this.getQuestionsInfoArrayFromLocalStorage(),
      'status': status,
      'timeTaken': this.timerService.timer$.value
    };
    return this.http.post(APIConfig.PRACTICE_TEST_SAVE, practiceTestData, { headers });
  }

  /**
   * This method is called when the test is finished by any of the two ways.
   * 1) clicking on finish button
   * 2) Time Up
   *
   *
   *
   * @param {any} result
   * @memberof PracticeTestHelperService
   */
  calculateTestResult(result) {

    const resultObj = {};
    resultObj['course'] = this.getTestDataFromLocalStorage().course;
    resultObj['subject'] = this.getTestDataFromLocalStorage().subject;
    resultObj['selectedIndexes'] = this.selectedIndexes;
    resultObj['questions'] = this.questions;
    resultObj['questionInfo'] = result.questionInfo;
    resultObj['questionFlagData'] = [];
    resultObj['timeTaken'] = result.timeTaken;

    const totalQuestions = this.questions.length;
    let totalTime = 0;
    let correct = 0;
    let incorrect = 0;
    let unattended = 0;

    result.questionInfo.forEach((question, index) => {
      totalTime = totalTime + question.timeTaken;

      const flagDataObj: QuestionFlagsData = {};
      flagDataObj.index = index;

      if (question.userAnswers === null) {
        flagDataObj.unattended = true;
        unattended++;

      } else if (this.isArraysEqual(question.userAnswers, question.rightAnswers)) {
        flagDataObj.correct = true;
        correct++;

      } else {
        flagDataObj.incorrect = true;
        incorrect++;
      }

      resultObj['questionFlagData'].push(flagDataObj);
    });

    resultObj['avgTimePerMcq'] = Math.floor(totalTime / totalQuestions);
    let accuracy = (correct / (correct + incorrect)) * 100;

    if (isNaN(accuracy)) {
      accuracy = 0;
    }

    resultObj['accuracy'] = accuracy;
    const calculatedCount = {
      'correct': correct,
      'incorrect': incorrect,
      'unattended': unattended
    };

    const calculatedPer = {
      'correct': (correct / totalQuestions) * 100,
      'incorrect': (incorrect / totalQuestions) * 100,
      'unattended': (unattended / totalQuestions) * 100
    };

    resultObj['calculatedCount'] = calculatedCount;
    resultObj['calculatedPer'] = calculatedPer;

    // Set the test result data in local storage for enabling browser refresh on result screen
    localStorage.setItem('testResultData', JSON.stringify(resultObj));

    // Remove the Test Data from Local Storage
    this.removeTestDataFromLocalStorage();
  }

  /**
   * This method is called when close button is clicked on result screen.
   */
  public removeResultDataFromLocalStorage() {
    localStorage.removeItem('testResultData');
  }
}

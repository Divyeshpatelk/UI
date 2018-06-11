import { QuestionFlagMessage } from './../../_models/practice-test';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {
  Course,
  PracticeTestData,
  PracticeTestStatus,
  Question,
  QuestionInfo,
  CustomTestQuestionFlagsData,
  QuestionBundle,
  Subject,
} from '../../_models';
import { APIConfig } from '../../_config/api-config';
import { TimerService } from './timer.service';
import { SubjectIndex } from '../../_models/subject';

@Injectable()
export class CustomTestHelperService {
  /**
   * is Test is ready or not;
   */
  public isReady = false;
  /**
   * Array of Sections
   */
  public sections: any[];

  private currentSection: any;
  /**
   * Array of Questions for all the sections
   * @private
   * @type {Question[]}
   */
  private allQuestions: Question[];

  /**
   * Array of Questions for perticular section
   * @private
   * @type {Question[]}
   */
  // private currentQuestions: Question[];

  /**
   * Array of all QuestionsInfo Objects.
   * QuestionInfo is the array used for sending updated data to server
   * @private
   * @type {QuestionInfo[]}
   */
  private allQuestionsInfo: QuestionInfo[];

  //   /**
  //  * Array of QuestionsInfo Objects for particular section.
  //  * QuestionInfo is the array used for sending updated data to server
  //  * @private
  //  * @type {QuestionInfo[]}
  //  */
  // private currentQuestionsInfo: QuestionInfo[];

  /**
   * Array of CustomTestQuestionFlagsData
   * Designed to hold flags (attended, unattended, markedReview, correct, incorrect, skipped) status for each question
   * @private
   * @type {CustomTestQuestionFlagsData[]}
   */
  private allQuestionFlagsData: CustomTestQuestionFlagsData[];
  /**
   * Array of CustomTestQuestionFlagsData for paticular section
   * Designed to hold flags (attended, unattended, markedReview, correct, incorrect, skipped) status for each question
   * @private
   * @type {CustomTestQuestionFlagsData[]}
   */
  private currentQuestionFlagsData: CustomTestQuestionFlagsData[];

  /**
   * Object of the Generated Practice Test
   * @private
   * @type {PracticeTestData}
   */
  private generatedTest: PracticeTestData;

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
   * @type {BehaviorSubject<QuestionFlagMessage}
   */
  public _quesFlagsData: BehaviorSubject<QuestionFlagMessage>;

  /**
   * Creates an instance of CustomTestHelperService.
   * @param {HttpClient} http HttpClient Instance
   * @param {TimerService} timerService TimerService Instance
   */
  constructor(private http: HttpClient, private timerService: TimerService) {
    this._currentQuestion = new BehaviorSubject<QuestionBundle>(null);
    this._quesFlagsData = new BehaviorSubject<QuestionFlagMessage>(null);

    this.currentQuestionBundle.question = {};
    this.currentQuestionBundle.questionInfo = {};
    this.currentQuestionBundle.questionFlagData = {};

    // const practiceTestData = this.getTestDataFromLocalStorage();
    // if (practiceTestData !== null && practiceTestData !== '' ) {
    //   this.seCustomTest(practiceTestData);
    // }
  }

  /**
   * Initial method called when practice test is generated
   * This method is responsible for setting the Flags data and local storage on test startup
   *
   * @param {PracticeTestData} practiceTest PracticeTestData
   */
  setCustomTest(customTestData) {
    this.isReady = true;
    console.log(this.isReady);
    let firstIndex = 0;
    this.selectedIndexes = customTestData.selectedIndexes;
    this.generatedTest = {
      id: customTestData.id,
      courses: customTestData.courses,
      questionInfo: customTestData.questionInfo,
      questions: customTestData.questions,
      sections: customTestData.sections,
      timeLimit: customTestData.duration ? customTestData.duration : ( customTestData.timeLimit / 60 )
    };

    this.allQuestions = this.generatedTest.questions;
    this.sections = customTestData.sections;

    if (this.sections && this.sections.length > 0) {
      this.currentSection = this.sections[0];
      //  this.currentQuestions = this.getQuestionsForSection(this.currentSection.id);
    }

    localStorage.setItem('customTestData', JSON.stringify(this.generatedTest));

    // If questionsInfo is null / undefined, then it means it is generated test and its reloaded again
    if (customTestData.questionInfo === null || customTestData.questionInfo === undefined) {
      this.allQuestionsInfo = this.generatedTest.questionInfo;
      this.setQuestionsInfoArrayInLocalStorage(this.allQuestionsInfo);

      // else take it from the localstorage object
    } else {
      this.allQuestionsInfo = customTestData.questionInfo;
    }

    // Similarly for QuestionsFlagData
    if (customTestData.questionFlagsData === null || customTestData.questionFlagsData === undefined) {
      this.setUpQuestionsFlagData();

    } else {
      this.allQuestionFlagsData = customTestData.questionFlagsData;
    }
    this.currentQuestionFlagsData = this.getQuestionFlagsDataForSection(this.currentSection.id);
    this.isShowRightAnsOptionEnabled = customTestData.isShowRightAnsOptionEnabled;
    this.timeLimit = this.generatedTest.timeLimit * 60;
    if ( this.currentQuestionFlagsData ) {
      firstIndex = this.currentQuestionFlagsData[0].index;
    }
    this.setQuestionsFlagDataInLocalStorage(this.allQuestionFlagsData);
    this.setQuestionFlagsBeforeQuestionSelection(firstIndex);
    this._quesFlagsData.next({ questionFlags: this.currentQuestionFlagsData });

    // Select First question when test is generated
    if (this.timerService.timer$) {
      this.timerService.stopTimer();
    }
    this.timerService.startTimer(this.timeLimit);
    this.selectQuestion(firstIndex);
  }

  setQuestionFlagsBeforeQuestionSelection(qIndex: number) {
    const qId = this.allQuestions[qIndex].id;
    const curQuestionFlag: CustomTestQuestionFlagsData =  this.getQuestionFlagByQuestionId(qId);
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
    console.log(JSON.stringify(curQuestionFlag));
    console.log(JSON.stringify(this.allQuestionFlagsData));
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
    if ( curQuestionFlag.unVisited && curQuestionFlag.unVisited === true ) {
      curQuestionFlag.unAnswered = true;
      curQuestionFlag.unVisited = false;
      this.setQuestionsFlagDataInLocalStorage(this.allQuestionFlagsData);
    }
  }

  /**
   *  This method is called to handle section change event
   */
  public changeTestSection(selectedSection) {
    this.savePracticeTest(PracticeTestStatus.RUNNING, 0).subscribe(response => {
      console.log(response);
    });
    let nextIndex = -1;
    this.currentSection = selectedSection;
    this.currentQuestionFlagsData = this.getQuestionFlagsDataForSection(this.currentSection.id);
    if (this.currentQuestionFlagsData && this.currentQuestionFlagsData.length > 0) {
      nextIndex = this.currentQuestionFlagsData[0].index;
    }
    this.setQuestionFlagsBeforeQuestionSelection(nextIndex);
    this._quesFlagsData.next({
      questionFlags: this.currentQuestionFlagsData,
      currentSection: this.currentSection,
      sectionChangeFlag: true
    });
    this.selectQuestion(nextIndex);
  }

  /**
   * Method to set the data in localstorage
   * @private
   * @param {any} array
   */
  private setQuestionsInfoArrayInLocalStorage(array) {
    const obj = JSON.parse(localStorage.getItem('customTestData'));
    obj.questionInfo = array;
    localStorage.setItem('customTestData', JSON.stringify(obj));
  }

  /**
   * Method to get the data from local storage
   * @private
   * @returns QuestionsInfoArray
   */
  private getQuestionsInfoArrayFromLocalStorage() {
    const obj = JSON.parse(localStorage.getItem('customTestData'));
    return obj.questionInfo;
  }

  /**
   * Method to clear the test data saved in local storage on test finish
   */
  public removeTestDataFromLocalStorage() {
    localStorage.removeItem('customTestData');
  }

  /**
   * Method to set QuestionsFlagData in localStorage
   * @private
   * @param {any} array
   */
  private setQuestionsFlagDataInLocalStorage(array) {
    const obj = JSON.parse(localStorage.getItem('customTestData'));
    obj.questionFlagsData = array;
    localStorage.setItem('customTestData', JSON.stringify(obj));
  }

/**
   * Method to set persist test time in localStorage
   * @private
   * @param {any} timeLimit
   */
  public setAvailableTestTimeLimitInLocalStorage(timeLimit) {
    const obj = JSON.parse(localStorage.getItem('customTestData'));
    obj.timeLimit = timeLimit;
    localStorage.setItem('customTestData', JSON.stringify(obj));
  }

  /**
   * Method to get the CustomTestQuestionFlagsData from localStorage
   * @private
   * @returns
   */
  private getQuestionsFlagDataFromLocalStorage() {
    const obj = JSON.parse(localStorage.getItem('customTestData'));
    return obj.questionFlagsData;
  }

  private getTestDataFromLocalStorage() {
    if (localStorage.getItem('customTestData') !== '') {
      return JSON.parse(localStorage.getItem('customTestData'));
    } else {
      return null;
    }
  }

  /**
   * This method initializes the flags data for each question on test startup
   * @private
   */
  private setUpQuestionsFlagData() {
    this.allQuestionFlagsData = [];

    this.allQuestions.forEach((question, index) => {
      const secId = question.courses && question.courses.length > 0 && question.courses[0].sectionId ?
        question.courses[0].sectionId : null;
      const quesMetaData: CustomTestQuestionFlagsData = {
        index: index,
        qId: question.id,
        sectionId: secId,
        answered: false,
        unAnswered: false,
        markedReview: false,
        unVisited: true,
        correct: false,
        incorrect: false,
        validated: false
      };
      this.allQuestionFlagsData.push(quesMetaData);
    });
  }

  /**
   * This method is called when user navigates to other question using Next, Prev or Direct Jump
   * This method updates the currentQuestionBundle with the selected Question
   *
   * @param {number} index Index of the selected Question
   */
  selectQuestion(index1: number) {

    // Set the Current Question Object
    // Set Question Object
    this.currentQuestionBundle.question = this.allQuestions[index1];

    // Get the question info object from localStorage
    const questionsInfoArray = this.getQuestionsInfoArrayFromLocalStorage();

    // Set QuestionInfo Object
    this.currentQuestionBundle.questionInfo = this.getQuestionInfoFromArrayByQuestionId(questionsInfoArray, this.allQuestions[index1].id);

    // Get the QuestionsFlag data from local Storage
    const questionsFlagArray = this.getQuestionsFlagDataFromLocalStorage();
    // Set QuestionFlagData Object
    this.currentQuestionBundle.questionFlagData = this.getQuestionFlagFromArrayByQuestionId(questionsFlagArray,
      this.allQuestions[index1].id);

    this.currentQuestionBundle.localIndex = this.findQuestionIndexForSectionFromGlobalIndex(index1);

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
    // const curIndex1 =    this.allQuestions.findIndex(question => question.id === _questionInfo.questionId);
    const quesFlagData: CustomTestQuestionFlagsData = this.getQuestionFlagByQuestionId(_questionInfo.questionId);
    // this.allQuestionFlagsData[curIndex];
    quesFlagData.unVisited = false;
    quesFlagData.answered = true;
    quesFlagData.unAnswered = false;

    if (!this.isShowRightAnsOptionEnabled) {
      quesFlagData.answered = true;
    }
    if (_questionInfo.userAnswers.length === 0) {
      quesFlagData.unAnswered = true;
      quesFlagData.answered = false;
      quesFlagData.unVisited = false;
    }

    this.currentQuestionBundle.questionFlagData = quesFlagData;

    this.setQuestionsFlagDataInLocalStorage(this.allQuestionFlagsData);

    this._quesFlagsData.next({ questionFlags: this.currentQuestionFlagsData });
  }

  /**
   * This method is invoked on NEXT, PREV or direct question jump click.
   * This method is responsible for handling the scenarios of whether PracticeTest save needs to be called or not.
   *
   * @param {number} currentIndex Current Question index
   * @param {number} nextIndex Next Question Index
   */
  moveToNextQuestion(currentIndex1: number, nextIndex1: number) {
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
    const updatedQuestion: QuestionInfo = this.getQuestionInfoFromArrayByQuestionId(array, this.allQuestions[currentIndex1].id);
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
      const questionInfoObj: QuestionInfo = this.getQuestionInfoFromArrayByQuestionId(quesInfoArray, this.allQuestions[currentIndex1].id);

      // arr1 is the user answers array from local storage questionsInfo array
      const arr1 = questionInfoObj.userAnswers;

      // arr2 is the user answers array from current question object
      const arr2 = this.currentQuestionBundle.questionInfo.userAnswers;

      this.setQuestionFlagsBeforeQuestionSelection(nextIndex1);

      // if both are null, then it means user didn't attended that question, so marking it as skipped
      if (arr1 === null && arr2 === null) {
        const quesFlagData: CustomTestQuestionFlagsData = this.getQuestionFlagByQuestionId(this.allQuestions[currentIndex1].id);
        //  this.allQuestionFlagsData[currentIndex];
        quesFlagData.unAnswered = true;
        quesFlagData.answered = false;
        quesFlagData.unVisited = false;

        this.setQuestionsFlagDataInLocalStorage(this.allQuestionFlagsData);

        if (questionInfoObj.flag !== this.currentQuestionBundle.questionInfo.flag) {
          this.savePracticeTest(PracticeTestStatus.RUNNING, 0).subscribe(response => {
            console.log(response);
          });
        }

      } else if (arr2 !== null) {
        if (arr2.length === 0) {
          const quesFlagData: CustomTestQuestionFlagsData = this.getQuestionFlagByQuestionId(this.allQuestions[currentIndex1].id);
          quesFlagData.unVisited = false;
          quesFlagData.answered = false;
          quesFlagData.unAnswered = true;
          this.setQuestionsFlagDataInLocalStorage(this.allQuestionFlagsData);
          this._quesFlagsData.next({ questionFlags: this.currentQuestionFlagsData });
        }

        this.savePracticeTest(PracticeTestStatus.RUNNING, 0).subscribe(response => {
          console.log(response);
        });

      } else if (!this.isArraysEqual(questionInfoObj.userAnswers, this.currentQuestionBundle.questionInfo.userAnswers)
        || (questionInfoObj.flag !== this.currentQuestionBundle.questionInfo.flag)) {
        if (arr2.length === 0) {
          const quesFlagData: CustomTestQuestionFlagsData = this.getQuestionFlagByQuestionId(this.allQuestions[currentIndex1].id);
          quesFlagData.unVisited = false;
          quesFlagData.answered = false;
          quesFlagData.unAnswered = true;
          this.setQuestionsFlagDataInLocalStorage(this.allQuestionFlagsData);
          this._quesFlagsData.next({ questionFlags: this.currentQuestionFlagsData });
        }

        this.savePracticeTest(PracticeTestStatus.RUNNING, 0).subscribe(response => {
          console.log(response);
        });
      }
    }
    this._quesFlagsData.next({ questionFlags: this.currentQuestionFlagsData });
    // Move to the next index question
    this.selectQuestion(nextIndex1);
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
       * b) Update the CustomTestQuestionFlagsData Array and send the subscription
       * c) Update the Current Question Bundle Flags Data
       */
    } else {
      const markedQuestion = this.getQuestionFlagByQuestionId(questionId);
      markedQuestion[flagName] = state;
      this.currentQuestionBundle.questionFlagData = markedQuestion;
      this.setQuestionsFlagDataInLocalStorage(this.allQuestionFlagsData);
      this._quesFlagsData.next({ questionFlags: this.currentQuestionFlagsData });
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
   * e) Update the CustomTestQuestionFlagsData Array and send the subscription
   * f) Call the SavePracticeTest API
   *
   * @param {QuestionInfo} questionInfo QuestionInfo Object of the attempted Question
   */
  validateUserAnswer(questionInfo: QuestionInfo) {
    const markedQuestion: CustomTestQuestionFlagsData = this.getQuestionFlagByQuestionId(questionInfo.questionId);

    markedQuestion.unAnswered = false;
    markedQuestion.unVisited = false;
    markedQuestion.answered = true;
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

    this.setQuestionsFlagDataInLocalStorage(this.allQuestionFlagsData);
    this._quesFlagsData.next({ questionFlags: this.currentQuestionFlagsData });

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
      'id': this.generatedTest.id,
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
   * @memberof CustomTestHelperService
   */
  calculateTestResult(result) {

    const resultObj = {};
    resultObj['course'] = this.getTestDataFromLocalStorage().course;
    resultObj['subject'] = this.getTestDataFromLocalStorage().subject;
    resultObj['selectedIndexes'] = this.selectedIndexes;
    resultObj['questions'] = this.allQuestions;
    resultObj['questionInfo'] = result.questionInfo;
    resultObj['questionFlagData'] = [];
    resultObj['timeTaken'] = result.timeTaken;

    const totalQuestions = this.allQuestions.length;
    let totalTime = 0;
    let correct = 0;
    let incorrect = 0;
    let unattended = 0;

    result.questionInfo.forEach((question, index) => {
      totalTime = totalTime + question.timeTaken;

      const flagDataObj: CustomTestQuestionFlagsData = {};
      flagDataObj.index = index;

      if (question.userAnswers === null) {
        flagDataObj.unAnswered = true;
        unattended++;

      } else if (this.isArraysEqual(question.userAnswers, question.rightAnswers)) {
        flagDataObj.correct = true;
        correct++;

      } else {
        flagDataObj.incorrect = true;
        incorrect++;
        if (question.userAnswers.length === 0) {
          flagDataObj.incorrect = false;
          flagDataObj.unAnswered = true;
          incorrect--;
          unattended++;
        }
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

  /**
   * This method will return questions belonging to particular section
   */
  public getQuestionsForSection(inSectionId: string) {
    return this.allQuestions.filter(
      curQuestion => curQuestion.courses && curQuestion.courses.length > 0 &&
        (!curQuestion.courses[0].sectionId || curQuestion.courses[0].sectionId === inSectionId)
    );
  }

  /**
  * This method will return questions flag data belonging to particular section
  */
  public getQuestionFlagsDataForSection(inSectionId: string) {
    return this.allQuestionFlagsData.filter(
      (curQuestionFlagData: CustomTestQuestionFlagsData) => curQuestionFlagData.sectionId === inSectionId
    );
  }

  public findQuestionIndexForSectionFromGlobalIndex(globalIndex: number) {
    const globalQId = this.allQuestions[globalIndex].id;
    for (let i = 0; i < this.currentQuestionFlagsData.length; i++) {
      if (this.currentQuestionFlagsData[i].qId === globalQId) {
        return i;
      }
    }
    return 0;
  }

  public getQuestionFlagByQuestionId(questionId: string): CustomTestQuestionFlagsData {
    const arr = this.allQuestionFlagsData.filter(
      (curQuestionFlagData: CustomTestQuestionFlagsData) => curQuestionFlagData.qId === questionId
    );
    let markedQuestion: CustomTestQuestionFlagsData;
    if (arr && arr.length > 0) {
      markedQuestion = arr[0];
    }
    return markedQuestion;
  }

  public getQuestionFlagFromArrayByQuestionId(arrAll: any, questionId: string): CustomTestQuestionFlagsData {
    const arr = arrAll.filter(
      (curQuestionFlagData: CustomTestQuestionFlagsData) => curQuestionFlagData.qId === questionId
    );
    let markedQuestion: CustomTestQuestionFlagsData;
    if (arr && arr.length > 0) {
      markedQuestion = arr[0];
    }
    return markedQuestion;
  }

  public getQuestionInfoByQuestionId(questionId: string) {
    const arr = this.allQuestionsInfo.filter(
      (curQuestionInfo: QuestionInfo) => curQuestionInfo.questionId === questionId
    );
    let currentQuestionInfo: QuestionInfo;
    if (arr && arr.length > 0) {
      currentQuestionInfo = arr[0];
    }
    return currentQuestionInfo;
  }

  public getQuestionInfoFromArrayByQuestionId(allArr: any, questionId: string) {
    const arr = allArr.filter(
      (curQuestionInfo: QuestionInfo) => curQuestionInfo.questionId === questionId
    );
    let currentQuestionInfo: QuestionInfo;
    if (arr && arr.length > 0) {
      currentQuestionInfo = arr[0];
    }
    return currentQuestionInfo;
  }
}

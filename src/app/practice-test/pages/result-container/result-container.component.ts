import { TestHistoryService } from './../../../student/shared/services/test-history.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Question, QuestionInfo, QuestionFlagsData, QuestionBundle, SubjectIndex } from '../../../_models';
import { PracticeTestHelperService } from '../../../shared/services';

/**
 * Component class for Practice Test Result Page
 *
 * @export
 * @class ResultContainerComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'pdg-result-container',
  templateUrl: './result-container.component.html',
  styleUrls: ['./result-container.component.scss']
})
export class ResultContainerComponent implements OnInit {
  /**
   * Filters Object
   * @type {*}
   */
  public filters: any = {};

  /**
   * Filter Args for Question Filter Pipe
   * @type {*}
   */
  public filterArgs: any = [];

  /**
   * Variable to hold Practice Test Result Data
   */
  public testResultData;

  /**
   * Array of Question Info from Test Result Data
   * @type {QuestionInfo[]}
   */
  public resultQuestionsInfo: QuestionInfo[];

  /**
   * Array of QuestionFlagsData from Test Result Data
   * @type {QuestionFlagsData[]}
   */
  public resultQuestionsFlagData: QuestionFlagsData[];

  /**
   * Array of Questions from test result data
   * @type {Question[]}
   */
  public questions: Question[];

  /**
   * Variable to hold current question index
   */
  public quesIndex = 0;

  /**
   * Variable to Hold Current Question Data
   * @type {QuestionBundle}
   */
  public selectedQuestion: QuestionBundle = {};

  /**
   * Variable to hold Selected Ans in case of radio button
   */
  public selectedAns;

  /**
   * Variable to hold Custom Width for Progressbars
   */
  public percentage;

  /**
   * Array Of Subject Indexes selected for the Practice test
   * @type {SubjectIndex[]}
   */
  public selectedIndexes: SubjectIndex[];

  /**
   * Array of Question Related Topics
   */
  public selectedQuestionRelatedTopics = [];

  private isPageOpenAfterTest = true;
  /**
   * Creates an instance of ResultContainerComponent.
   * @param {Router} router Router Instance
   */
  constructor(private practiceTestHelperService: PracticeTestHelperService, private router: Router,
              private activeRoute: ActivatedRoute, private testHistoryService: TestHistoryService) {
    this.filters = {
      unattended: false,
      correct: false,
      incorrect: false
    };
  }

  /**
   * Overridden method invoked when component is loaded
   */
  ngOnInit() {
    // Check for Test Id from Request Param in case of Page request come from student dashboard
    if (this.activeRoute.snapshot && this.activeRoute.snapshot.params && this.activeRoute.snapshot.params['testId']) {
      const testId = this.activeRoute.snapshot.params['testId'];
      // Get Test Detail from Service
      this.testHistoryService.getPracticeTestDetailByTestId(testId).subscribe(
        (res: any) => {
          // Format data as per page requirement
          this.prepareDataForDispayResult(res);
          this.prepareForDispayResult();
          this.isPageOpenAfterTest = false;
        }
      );
    } else {
      // Get the result data from practice test helper service
      this.testResultData = JSON.parse(localStorage.getItem('testResultData'));
      this.prepareForDispayResult();
    }
  }


  prepareForDispayResult() {
    this.selectedIndexes = this.testResultData.selectedIndexes;

    this.questions = this.testResultData.questions;
    this.resultQuestionsInfo = this.testResultData.questionInfo;
    this.resultQuestionsFlagData = this.testResultData.questionFlagData;

    this.percentage = {
      correct: {
        width: `${this.testResultData.calculatedPer.correct}%`
      },
      incorrect: {
        width: `${this.testResultData.calculatedPer.incorrect}%`
      },
      unattended: {
        width: `${this.testResultData.calculatedPer.unattended}%`
      }
    };
    this.selectQuestion();
  }

  // Initialize data from request
  prepareDataForDispayResult(reqJson: any) {
    this.testResultData = {};
    this.testResultData['questions'] = reqJson.questions;
    this.testResultData['questionInfo'] = reqJson.questionInfo;
    const arr = [];
    // prepare questionFlag
    let ansFlag, qestionFlag;
    let timeForQuestions = 0;
    if ( reqJson.questions ) {
      for (let i = 0; i < reqJson.questions.length; i++) {
        qestionFlag = {index : i};
        const questionInfo = this.getQuestionDetailFromReq(reqJson.questions[i].id, reqJson);
        console.log(questionInfo);
        if (questionInfo) {
          timeForQuestions = timeForQuestions + ( questionInfo.timeTaken ? questionInfo.timeTaken : 0 );
          // prepare selected choices
          if (reqJson.questions[i].choices) {
            for (let cnt = 0 ; cnt < reqJson.questions[i].choices.length ; cnt++) {
              if ( questionInfo.userAnswers &&
                  questionInfo.userAnswers.indexOf(reqJson.questions[i].choices[cnt].id) !== -1 ) {
                reqJson.questions[i].choices[cnt]['selected'] = true;
              } else {
                reqJson.questions[i].choices[cnt]['selected'] = false;
              }
            }
          }
          // prepare questionflags
          if (questionInfo.rightAnswers) {
            if (questionInfo.rightAnswers.length === 1) {
              // single choice answer
              if (questionInfo.userAnswers && questionInfo.userAnswers.length === 1  &&
                  questionInfo.rightAnswers[0] === questionInfo.userAnswers[0]) {
                qestionFlag['correct'] = true;
              }else if (questionInfo.userAnswers && questionInfo.userAnswers.length > 0 ) {
                // user has given 1 or more answer but it is not correct
                qestionFlag['incorrect'] = true;
              }else {
                // user has not selected any answer
                qestionFlag['unattended'] = true;
              }
            }else if (questionInfo.rightAnswers.length > 1 ) {
              // multichoice answer
              if (questionInfo.userAnswers && questionInfo.userAnswers.length > 0  &&
                  questionInfo.rightAnswers.length === questionInfo.userAnswers.length) {
                ansFlag = true;
                for (let j = 0 ; j < questionInfo.userAnswers.length ; j++) {
                    if (questionInfo.rightAnswers.indexOf(questionInfo.userAnswers[j]) === -1) {
                      ansFlag = false;
                      break;
                    }
                }
                if (ansFlag) {
                  qestionFlag['correct'] = true;
                }else {
                  qestionFlag['incorrect'] = true;
                }
              }else if (questionInfo.userAnswers && questionInfo.userAnswers.length > 0) {
                qestionFlag['incorrect'] = true;
              } else {
                qestionFlag['unattended'] = true;
              }
            }
            arr.push(qestionFlag);
          }
        }
      }
    }
    this.testResultData['questionFlagData'] = arr;

    const total = reqJson.historyData.right + reqJson.historyData.wrong + reqJson.historyData.unattended;
    const accuracy = (reqJson.historyData.right / (reqJson.historyData.right + reqJson.historyData.wrong) * 100);

    this.testResultData['calculatedPer'] = {};
    this.testResultData['calculatedCount'] = {};

    this.testResultData['calculatedPer'].correct = reqJson.historyData.right * 100 / total;
    this.testResultData['calculatedPer'].incorrect = reqJson.historyData.wrong * 100 / total;
    this.testResultData['calculatedPer'].unattended = reqJson.historyData.unattended * 100 / total;

    this.testResultData['calculatedCount'].correct = reqJson.historyData.right;
    this.testResultData['calculatedCount'].incorrect = reqJson.historyData.wrong;
    this.testResultData['calculatedCount'].unattended = reqJson.historyData.unattended;

    this.testResultData['accuracy'] = accuracy ? accuracy : 0;
    this.testResultData['timeTaken'] = reqJson.timeTaken;
    this.testResultData['avgTimePerMcq'] = Math.floor(timeForQuestions / total);
  }

  /**
   * This method is invoked when user selects particular question from question list
   * @param {any} index Index of the question
   */
  jumpToQues(index) {
    this.quesIndex = index;
    this.selectQuestion();
  }

  /*** This method is invoked when user clicks on Prev Question
   *
   * @memberof QuestionNavComponent
   */
  showPreviousQues() {
    --this.quesIndex;
    this.selectQuestion();
  }

  /**
   * This method is invoked when user clicks on next question
   */
  showNextQues() {
    ++this.quesIndex;
    this.selectQuestion();
  }

  /**
   * This method is invoked when user clicks on Clear Filter
   */
  clearFilter() {
    this.filters = {
      unattended: false,
      correct: false,
      incorrect: false
    };
    this.addRemoveFilterArgs();
  }

  /**
   * This method is invoked when user enable / disable any filter
   */
  addRemoveFilterArgs() {
    const filterKeys = Object.keys(this.filters);
    this.filterArgs = filterKeys.filter((keyName) => this.filters[keyName] === true);
  }


  // get questioninfo for given questionId from request json
  getQuestionDetailFromReq(qId: string, reqJson: any): any {
    for (let count = 0; count < reqJson.questionInfo.length; count++) {
      if (reqJson.questionInfo[count].questionId === qId) {
        return reqJson.questionInfo[count];
      }
    }
    return null;
  }

  // get resultQuestionsInfo for current question index
  getQuestionInfoDetail(qIndex: number): any {
    const qId = this.questions[qIndex].id;
    for (let count = 0; count < this.resultQuestionsInfo.length; count++) {
      if (this.resultQuestionsInfo[count].questionId === qId) {
        return this.resultQuestionsInfo[count];
      }
    }
    return null;
  }

  /**
   * this method will populate the selectedQuestion Bundle with the data
   */
  selectQuestion() {
    this.selectedQuestionRelatedTopics = [];
    this.selectedQuestion.question = this.questions[this.quesIndex];
    this.selectedQuestion.questionInfo = this.getQuestionInfoDetail(this.quesIndex);
    this.selectedQuestion.questionFlagData = this.resultQuestionsFlagData[this.quesIndex];

    const userAnswers = this.selectedQuestion.questionInfo.userAnswers;

    if (userAnswers !== null) {
      if (userAnswers.length === 1) {
        this.selectedAns = userAnswers[0].toString();
      } else {
        // Checkbox scenario
        userAnswers.forEach((answer) => {
          const _choice = this.selectedQuestion.question.choices.filter((choice) => choice.id === answer)[0];
          _choice.selected = true;
        });
      }
    } else {
      this.selectedAns = 0;
      this.selectedQuestion.question.choices.forEach((choice) => {
        choice.selected = false;
      });
    }

    this.selectedQuestion.questionInfo.courses.forEach((course) => {
      if (this.selectedIndexes) {
        const obj = this.selectedIndexes.filter((subjectIndex) => subjectIndex.indexId === course.indexid)[0];
        this.selectedQuestionRelatedTopics.push(obj);
      }
    });
  }

  /**
   * This method is responsible to go to the study mode when a topic is selected from related topics section
   * @param {any} indexId Index Id on which the question was mapped
   */
  goToStudyPage(indexId) {
    const courseId = this.testResultData.course.id;
    const subjectId = this.testResultData.subject.id;
    window.open(
      `${window.location.origin}/student/study/course/${courseId}?subject=${subjectId}&index=${indexId}`,
      '_blank'
    );
  }

  /**
   * This is used to handle browser back key when user is on results page
   * @param {any} event
   */
  @HostListener('window:popstate', ['$event'])
  public onPopState(event) {
    if (this.isPageOpenAfterTest) {
      window.history.forward();
    }
    return false;
  }

  @HostListener('contextmenu')
  rightClickFalse() {
    return false;
  }
}

import { TestHistoryService } from './../../../student/shared/services/test-history.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Question, QuestionInfo, CustomTestQuestionFlagsData, QuestionBundle, SubjectIndex } from '../../../_models';

/**
 * Component class for Practice Test Result Page
 *
 * @export
 * @class CustomResultContainerComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'pdg-result-container',
  templateUrl: './custom-test-result-container.component.html',
  styleUrls: ['./custom-test-result-container.component.scss']
})
export class CustomTestResultContainerComponent implements OnInit {

  sections: any[];

  selectedSectionId: any = null;

  sectionHistoryData: any[] = null;
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
   * Variable to hold Custom Test Section Result Data
   */
  public currentSectionResult: any = {
      correct: 0,
      incorrect: 0,
      unvisited: 0,
      unanswered: 0
  };

  /**
   * Array of Question Info for current section from Test Result Data
   * @type {QuestionInfo[]}
   */
  public currentResultQuestionsInfo: QuestionInfo[];

  /**
   * Array of Question Info from Test Result Data
   * @type {QuestionInfo[]}
   */
  public allResultQuestionsInfo: QuestionInfo[];

/**
   * Array of QuestionFlagsData from Test Result Data
   * @type {QuestionFlagsData[]}
   */
  public curSectionResultQuestionsFlagData: CustomTestQuestionFlagsData[];

  /**
   * Array of QuestionFlagsData from Test Result Data
   * @type {QuestionFlagsData[]}
   */
  public allResultQuestionsFlagData: CustomTestQuestionFlagsData[];

  /**
   * Array of Questions from test result data
   * @type {Question[]}
   */
  public allQuestions: Question[];

  /**
   * Array of Questions for current section from test result data
   * @type {Question[]}
   */
  public currentQuestions: Question[];

  /**
   * Variable to hold current question index
   */
  public quesIndex1 = 0;

  public currentQuesIndex = 0;
  /**
   * Variable to Hold Current Question Data
   * @type {QuestionBundle}
   */
  public selectedQuestion: QuestionBundle = {};


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
   * Creates an instance of CustomTestResultContainerComponent.
   * @param {Router} router Router Instance
   */
  constructor(private router: Router,
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
      this.testResultData = JSON.parse(localStorage.getItem('customTestResultData'));
      this.prepareForDispayResult();
    }
  }

  // ngOnInit() {
  //   const res = JSON.parse(localStorage.getItem('atit'));
  //   this.prepareDataForDispayResult(res);
  //   this.prepareForDispayResult();
  //   this.isPageOpenAfterTest = false;
  // }


  getSectionWiseQuestions() {
    let arr: Question[] = null;
    if ( this.selectedSectionId && this.selectedSectionId !== -1 ) {
      arr = this.allQuestions.filter(
          (ele: Question) => {
              return ele.courses[0].sectionId === this.selectedSectionId;
          }
      );
    }else if ( this.selectedSectionId === -1 ) {
      return this.allQuestions;
    }
    return arr;
  }

  getSectionWiseQuestionFlagData() {
    let arr: CustomTestQuestionFlagsData[] = null;
    if ( this.selectedSectionId  && this.selectedSectionId !== -1 ) {
      arr = this.allResultQuestionsFlagData.filter(
          (ele: CustomTestQuestionFlagsData) => {
              return ele.sectionId === this.selectedSectionId;
          }
      );
    }else if ( this.selectedSectionId === -1 ) {
      return this.allResultQuestionsFlagData;
    }

    return arr;
  }

  getSectionWiseQuestionInfo() {
    let arr: QuestionInfo[] = null;
    if ( this.selectedSectionId && this.selectedSectionId !== -1  ) {
      arr = this.allResultQuestionsInfo.filter(
          (ele: QuestionInfo) => {
              return ele.courses[0].sectionId === this.selectedSectionId;
          }
      );
    }else if ( this.selectedSectionId === -1 ) {
      return this.allResultQuestionsInfo;
    }
    return arr;
  }

  prepareForDispayResult() {
    this.selectedIndexes = this.testResultData.selectedIndexes;

    this.allQuestions = this.testResultData.questions;
    this.currentQuestions = this.getSectionWiseQuestions();
    this.allResultQuestionsInfo = this.testResultData.questionInfo;
    this.currentResultQuestionsInfo = this.getSectionWiseQuestionInfo();
    this.allResultQuestionsFlagData = this.testResultData.questionFlagData;
    this.curSectionResultQuestionsFlagData = this.getSectionWiseQuestionFlagData();
    this.calculateSectionWiseResult();
    console.log('----------------------------------');
    console.log('----------------------------------');
    console.log(this.allQuestions);
    console.log(this.currentQuestions);
    console.log('----------------------------------');
    console.log('----------------------------------');
    console.log(this.allResultQuestionsInfo);
    console.log(this.currentResultQuestionsInfo);
    console.log('----------------------------------');
    console.log('----------------------------------');
    console.log(this.allResultQuestionsFlagData);
    console.log(this.curSectionResultQuestionsFlagData);
    console.log('----------------------------------');
    console.log('----------------------------------');
    console.log('----------------------------------');
    this.percentage = {
      correct: {
        width: `${this.testResultData.calculatedPer.correct}%`
      },
      incorrect: {
        width: `${this.testResultData.calculatedPer.incorrect}%`
      },
      unanswered: {
        width: `${this.testResultData.calculatedPer.unanswered}%`
      }
    };
    this.selectQuestion();
  }

  // section change event
  beforeSectionChange(event: any) {
    console.log(event);
    console.log(this.sections);
    this.selectedSectionId = event.nextId[0];
    console.log('****************************:' + this.selectedSectionId);
    this.currentQuesIndex = 0;
    this.currentQuestions = this.getSectionWiseQuestions();
    this.curSectionResultQuestionsFlagData = this.getSectionWiseQuestionFlagData();
    this.currentResultQuestionsInfo = this.getSectionWiseQuestionInfo();
    console.log(this.currentQuestions);
    console.log(this.allQuestions);
    console.log('****************************');

    console.log(this.curSectionResultQuestionsFlagData);
    console.log(this.allResultQuestionsFlagData);
    console.log('****************************');

    console.log(this.currentResultQuestionsInfo);
    console.log(this.allResultQuestionsInfo );
    console.log('****************************');
    this.calculateSectionWiseResult();
    this.selectQuestion();
    console.log('****************************');
  }

  // Initialize data from request
  prepareDataForDispayResult(reqJson: any) {
    this.sections = reqJson.sections;
    this.sectionHistoryData = reqJson.sectionHistoryData;

    if (this.sections && this.sections.length > 0) {
      this.selectedSectionId = this.sections[0].id;
    }else {
      this.sections = [
        {id: -1, name: 'Exam Section'}
      ];
      this.selectedSectionId = -1;
    }

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
        console.log('"""""""""""""""""""questionInfo"""""""""""""""""""');
        console.log(questionInfo);
        console.log('"""""""""""""""""""questionInfo"""""""""""""""""""');
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
                // user has not selected any answer or not visited this question
                qestionFlag['unAnswered'] = true;
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
                // user has not selected any answer or not visited this question
                qestionFlag['unAnswered'] = true;
              }
            }
            qestionFlag['sectionId'] = reqJson.questions[i].courses[0].sectionId;
            qestionFlag['qId'] = reqJson.questions[i].id;
            arr.push(qestionFlag);
          }
        }
      }
    }
    let correctScore = 0, incorrectScore = 0 , unattendedScore = 0;
    for ( let i = 0 ; i < this.sectionHistoryData.length ; i++ ) {
      correctScore = correctScore + this.sectionHistoryData[i].rightMarks;
      incorrectScore = incorrectScore + this.sectionHistoryData[i].wrongMarks;
      unattendedScore = unattendedScore + this.sectionHistoryData[i].unattendedMarks;
    }
    this.testResultData['questionFlagData'] = arr;
    this.testResultData['correctScore'] = correctScore;
    this.testResultData['incorrectScore'] = incorrectScore;
    this.testResultData['unattendedScore'] = unattendedScore;

    const total = reqJson.historyData.total;
    const accuracy = (reqJson.historyData.right / (reqJson.historyData.right + reqJson.historyData.wrong) * 100);
    this.testResultData['calculatedPer'] = {};
    this.testResultData['calculatedCount'] = {};

    this.testResultData['calculatedPer'].correct = reqJson.historyData.right * 100 / total;
    this.testResultData['calculatedPer'].incorrect = reqJson.historyData.wrong * 100 / total;
    this.testResultData['calculatedPer'].unanswered = reqJson.historyData.unattended * 100 / total;

    this.testResultData['calculatedCount'].correct = reqJson.historyData.right;
    this.testResultData['calculatedCount'].incorrect = reqJson.historyData.wrong;
    this.testResultData['calculatedCount'].unanswered = reqJson.historyData.unattended ;

    this.testResultData['accuracy'] = accuracy ? accuracy : 0;
    this.testResultData['timeTaken'] = reqJson.timeTaken;
    this.testResultData['avgTimePerMcq'] = Math.floor(timeForQuestions / total);

    let totalObtainedMarks = 0 , tatalExamMarks = 0;
    for ( let i = 0 ; i < this.sectionHistoryData.length ; i++ ) {
      const rightMarkPerQues = this.sectionHistoryData[i].rightMarks / this.sectionHistoryData[i].rightCount;
      totalObtainedMarks = totalObtainedMarks + this.sectionHistoryData[i].totalMarks;
      tatalExamMarks = tatalExamMarks + ( ( this.sectionHistoryData[i].rightCount + this.sectionHistoryData[i].unattendedCount
      + this.sectionHistoryData[i].wrongCount )
      * ( rightMarkPerQues ? rightMarkPerQues : 0 ) );
    }
    this.testResultData['totalObtainedMarks'] = totalObtainedMarks;
    this.testResultData['tatalExamMarks'] = tatalExamMarks;
    console.log('this.testResultData');
    console.log('this.testResultData');
    console.log(this.testResultData);
    console.log('this.testResultData');
    console.log('this.testResultData');
  }

  /**
   * This method is invoked when user selects particular question from question list
   * @param {any} index Index of the question
   */
  jumpToQues(index) {
    this.currentQuesIndex = index;
    this.selectQuestion();
  }

  /*** This method is invoked when user clicks on Prev Question
   *
   * @memberof QuestionNavComponent
   */
  showPreviousQues() {
   this.currentQuesIndex--;
    this.selectQuestion();
  }

  /**
   * This method is invoked when user clicks on next question
   */
  showNextQues() {
    this.currentQuesIndex++;
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
  getQuestionInfoDetail(cIndex: number): any {
    const qId = this.currentQuestions[cIndex].id;
    for (let count = 0; count < this.currentResultQuestionsInfo.length; count++) {
      if (this.currentResultQuestionsInfo[count].questionId === qId) {
        return this.currentResultQuestionsInfo[count];
      }
    }
    return null;
  }

  /**
   * this method will populate the selectedQuestion Bundle with the data
   */
  selectQuestion() {
    this.selectedQuestionRelatedTopics = [];
    this.selectedQuestion.question = this.currentQuestions[this.currentQuesIndex];
    this.selectedQuestion.questionInfo = this.getQuestionInfoDetail(this.currentQuesIndex);
    this.selectedQuestion.questionFlagData = this.curSectionResultQuestionsFlagData[this.currentQuesIndex];

    const userAnswers = this.selectedQuestion.questionInfo.userAnswers;

    if (userAnswers !== null) {
      userAnswers.forEach((answer) => {
        const _choice = this.selectedQuestion.question.choices.filter((choice) => choice.id === answer)[0];
        _choice.selected = true;
      });
    } else {
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

  calculateSectionWiseResult() {
    let correct = 0, incorrect = 0, unanswered = 0;
    for ( let i = 0 ; i < this.curSectionResultQuestionsFlagData.length; i++ ) {
        if ( this.curSectionResultQuestionsFlagData[i].correct ) {
          correct++;
        }else if ( this.curSectionResultQuestionsFlagData[i].incorrect ) {
          incorrect++;
        }else  {
           unanswered++;
        }
    }

    let curSecHistory: any = null;
    for ( let i = 0 ; i < this.sectionHistoryData.length ; i++ ) {
          if ( this.sectionHistoryData[i].sectionId === this.selectedSectionId ) {
              curSecHistory = this.sectionHistoryData[i];
          }
    }

    this.currentSectionResult['correct'] = correct;
    this.currentSectionResult['correctScore'] = curSecHistory.rightMarks;
    this.currentSectionResult['incorrect'] = incorrect;
    this.currentSectionResult['incorrectScore'] = curSecHistory.wrongMarks;
    this.currentSectionResult['unanswered'] = unanswered;
    this.currentSectionResult['unansweredScore'] = curSecHistory.unattendedMarks;
    this.currentSectionResult['total'] =  this.curSectionResultQuestionsFlagData.length;


    const accuracy = (correct / (correct + incorrect) * 100);
    const tm = ( this.curSectionResultQuestionsFlagData.length *
      ( curSecHistory.rightMarks / curSecHistory.rightCount ) );
    this.currentSectionResult['totalmark'] = tm ? tm : 0;
    this.currentSectionResult['obtaninedmark'] = curSecHistory.totalMarks;
    this.currentSectionResult['accuracy'] = (accuracy ? accuracy : 0);

    let sectionTimeTaken = 0;
    for ( let i = 0 ; i < this.currentResultQuestionsInfo.length ; i++ ) {
      sectionTimeTaken = sectionTimeTaken +
       ( this.currentResultQuestionsInfo[i].timeTaken ? this.currentResultQuestionsInfo[i].timeTaken : 0 );
    }
    this.currentSectionResult['sectionTimeTaken'] = sectionTimeTaken;
    const sectionAvgTime = ( sectionTimeTaken / this.curSectionResultQuestionsFlagData.length );
    this.currentSectionResult['sectionAvgTime'] = ( sectionAvgTime ? sectionAvgTime : 0);
  }
}

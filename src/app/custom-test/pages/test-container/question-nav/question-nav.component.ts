import { QuestionFlagMessage } from './../../../../_models/practice-test';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { CustomTestQuestionFlagsData, PracticeTestStatus } from '../../../../_models';
import { CustomTestHelperService, TimerService } from '../../../../shared/services';
import { AlertComponent } from '../../../../shared/components';

@Component({
  selector: 'pdg-question-nav',
  templateUrl: './question-nav.component.html',
  styleUrls: ['./question-nav.component.scss']
})
export class QuestionNavComponent implements OnInit, OnDestroy {

  /**
   * Variable to hold Show right Ans Option config
   * @type {boolean}
   */
  public isShowRightAnsOptionEnabled: boolean;

  /**
   * Questions Flag Data Array
   * @type {CustomTestQuestionFlagsData[]}
   */
  public questionFlagsData: CustomTestQuestionFlagsData[];

  /**
   * Variable to hold the current question index
   */
  public quesIndex = 0;

  public currentQuesIndex = 0;

  /**
   * filters Object
   * @type {*}
   */
  public filters: any = {};

  public questionFlagCount: any = {};

  /**
   * Filter Args for Question Filter Pipe
   * @type {Array<any>}
   */
  public filterArgs: Array<any> = [];

  /**
   * Variable to show timer
   */
  public timer;

  /**
   * Variable to hold FlagData subscription object
   */
  private flagDataSubscription;

  /**
   * Creates an instance of QuestionNavComponent.
   * @param {NgbModal} modalService ModalService Instance
   * @param {CustomTestHelperService} customTestHelperService CustomTestHelperService Instance
   * @param {Router} router Router Instance
   * @param {TimerService} timerService TimerService Instance
   * @param {TranslateService} translator TranslateService Instance
   */
  constructor(
    private modalService: NgbModal,
    private customTestHelperService: CustomTestHelperService,
    private router: Router,
    private timerService: TimerService,
    private translator: TranslateService) {
    this.filters = {
      'unattended': false,
      'skipped': false,
      'markedReview': false,
      'answeredAndMarkedReview': false,
      'attended': false,
      'correct': false,
      'incorrect': false
    };
    this.questionFlagCount = {
      'unattended': 0,
      'attended': 0,
      'skipped': 0,
      'markedReview': 0,
      'answeredAndMarkedReview': 0
    };
  }

  /**
   * Overridden method invoked when component is loaded
   */
  ngOnInit() {
    this.isShowRightAnsOptionEnabled = this.customTestHelperService.isShowRightAnsOptionEnabled;

    if (!this.timerService.timer$) {
      this.timerService.startTimer(this.customTestHelperService.timeLimit);
    }
    this.timerService.timer$.subscribe(
      (seconds) => {
        const avTime = this.customTestHelperService.timeLimit ? (this.customTestHelperService.timeLimit) - seconds : seconds;
        this.timer = avTime;
        if ( seconds % 5 === 0  && this.customTestHelperService.timeLimit ) {
          this.customTestHelperService.setAvailableTestTimeLimitInLocalStorage(avTime);
        }
      },
      (error) => { },
      () => {
        const modalRef = this.modalService.open(AlertComponent, { backdrop: 'static' });
        modalRef.componentInstance.title = this.translator.instant('WARNING');
        modalRef.componentInstance.text = this.translator.instant('TIME_UP_PRACTICE_TEST');

        this.customTestHelperService.savePracticeTest(PracticeTestStatus.FINISH, 0).subscribe(response => {
          this.customTestHelperService.removeTestDataFromLocalStorage();
          this.router.navigate(['/student', 'courses']);
        });
      }
    );

    this.flagDataSubscription = this.customTestHelperService._quesFlagsData.subscribe((qestionChangeMsg: QuestionFlagMessage) => {
      this.questionFlagsData = qestionChangeMsg.questionFlags;
      console.log('----------------------------------');
      console.log(JSON.stringify(this.questionFlagsData));
      console.log('----------------------------------');
      if ( qestionChangeMsg.sectionChangeFlag && qestionChangeMsg.sectionChangeFlag === true ) {
          this.quesIndex = this.questionFlagsData[0].index;
          this.currentQuesIndex = 0;
      }
      this.calculateQuestionFlagCounts();
    });

  }

  calculateQuestionFlagCounts() {
    this.questionFlagCount = {
      'answered': 0,
      'unAnswered': 0,
      'markedReview': 0,
      'unVisited': 0,
      'answeredMarkedReview': 0
    };

    for ( let i = 0 ; i < this.questionFlagsData.length ; i++ ) {
      if ( this.questionFlagsData[i].unVisited && this.questionFlagsData[i].unVisited === true) {
        this.questionFlagCount.unVisited++;
      }else if ( this.questionFlagsData[i].answered && this.questionFlagsData[i].answered === true &&
           this.questionFlagsData[i].markedReview && this.questionFlagsData[i].markedReview === true ) {
        this.questionFlagCount.answeredMarkedReview++;
      }else if ( this.questionFlagsData[i].markedReview && this.questionFlagsData[i].markedReview === true ) {
        this.questionFlagCount.markedReview++;
      }else if ( this.questionFlagsData[i].answered && this.questionFlagsData[i].answered === true) {
        this.questionFlagCount.answered++;
      }else if ( this.questionFlagsData[i].unAnswered && this.questionFlagsData[i].unAnswered === true) {
        this.questionFlagCount.unAnswered++;
      }
    }
   console.log(this.questionFlagCount);
  }

  /**
   * This method is invoked when user selects particular question from question list
   * @param {any} index Index of the question
   */
  jumpToQues(index) {
    const currentIndex = this.quesIndex;
    this.quesIndex = index;
    this.currentQuesIndex = this.findCurrentIndex(this.quesIndex);
    this.customTestHelperService.moveToNextQuestion(currentIndex, this.quesIndex);
  }

  /**
   * This method is invoked when user clicks on Prev Question
   *
   * @memberof QuestionNavComponent
   */
  showPreviousQues() {
    console.log(this.questionFlagsData);
    const currentIndex = this.quesIndex;
    this.quesIndex = this.findIndexOfPreviousQues(currentIndex);
    this.currentQuesIndex--;
    this.customTestHelperService.moveToNextQuestion(currentIndex, this.quesIndex);
  }

  /**
   * This method is invoked when user clicks on next question
   */
  showNextQues() {
    console.log(this.questionFlagsData);
    const currentIndex = this.quesIndex;
    this.quesIndex = this.findIndexOfNextQues(currentIndex);
    this.currentQuesIndex++;
    this.customTestHelperService.moveToNextQuestion(currentIndex, this.quesIndex);
  }

  findIndexOfNextQues(currentIndex) {
    let returnIndex = 0;
    this.questionFlagsData.forEach(
        ( qFlagData , index) => {
            if (  qFlagData.index === currentIndex) {
              returnIndex = this.questionFlagsData[index + 1].index;
            }
        }
    );
    return returnIndex;
  }

  findIndexOfPreviousQues(currentIndex) {
    let returnIndex = 0;
    this.questionFlagsData.forEach(
        ( qFlagData , index) => {
            if (  qFlagData.index === currentIndex) {
              returnIndex = this.questionFlagsData[index - 1].index;
            }
        }
    );
    return returnIndex;
  }

  findCurrentIndex(qIndex) {
    let returnIndex = 0;
    this.questionFlagsData.forEach(
        ( qFlagData , index) => {
            if (  qFlagData.index === qIndex) {
              returnIndex = index;
            }
        }
    );
    return returnIndex;
  }
  /**
   * This method is invoked when user clicks on Clear Filter
   */
  clearFilter() {
    this.filters = {
      'unattended': false,
      'skipped': false,
      'markedReview': false,
      'attended': false,
      'correct': false,
      'incorrect': false
    };
    this.addRemoveFilterArgs();
  }

  /**
   * This method is invoked when user enable / disable any filter
   */
  addRemoveFilterArgs() {
    const filterKeys = Object.keys(this.filters);
    this.filterArgs = filterKeys.filter(keyName => this.filters[keyName] === true);
  }

  /**
   * Overridden method invoked when component is destroyed
   */
  ngOnDestroy() {
    if (this.flagDataSubscription) {
      this.flagDataSubscription.unsubscribe();
    }
  }
}

import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { QuestionFlagsData, PracticeTestStatus } from '../../../../_models';
import { PracticeTestHelperService, TimerService } from '../../../../shared/services';
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
   * @type {QuestionFlagsData[]}
   */
  public questionFlagsData: QuestionFlagsData[];

  /**
   * Variable to hold the current question index
   */
  public quesIndex = 0;

  /**
   * filters Object
   * @type {*}
   */
  public filters: any = {};

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
   * @param {PracticeTestHelperService} practiceTestHelperService PracticeTestHelperService Instance
   * @param {Router} router Router Instance
   * @param {TimerService} timerService TimerService Instance
   * @param {TranslateService} translator TranslateService Instance
   */
  constructor(
    private modalService: NgbModal,
    private practiceTestHelperService: PracticeTestHelperService,
    private router: Router,
    private timerService: TimerService,
    private translator: TranslateService) {
    this.filters = {
      'unattended': false,
      'skipped': false,
      'markedReview': false,
      'attended': false,
      'correct': false,
      'incorrect': false
    };
  }

  /**
   * Overridden method invoked when component is loaded
   */
  ngOnInit() {
    this.isShowRightAnsOptionEnabled = this.practiceTestHelperService.isShowRightAnsOptionEnabled;

    this.timerService.timer$.subscribe(
      (seconds) => {
        this.timer = this.practiceTestHelperService.timeLimit ? (this.practiceTestHelperService.timeLimit) - seconds : seconds;
      },
      (error) => { },
      () => {
        const modalRef = this.modalService.open(AlertComponent, { backdrop: 'static' });
        modalRef.componentInstance.title = this.translator.instant('WARNING');
        modalRef.componentInstance.text = this.translator.instant('TIME_UP_PRACTICE_TEST');

        this.practiceTestHelperService.savePracticeTest(PracticeTestStatus.FINISH, 0).subscribe(response => {
          this.practiceTestHelperService.calculateTestResult(response);
          this.router.navigate(['/practice-test', 'result']);
        });
      }
    );

    this.flagDataSubscription = this.practiceTestHelperService._quesFlagsData.subscribe((questionFlagsData: QuestionFlagsData[]) => {
      this.questionFlagsData = questionFlagsData;
    });

  }

  /**
   * This method is invoked when user selects particular question from question list
   * @param {any} index Index of the question
   */
  jumpToQues(index) {
    const currentIndex = this.quesIndex;
    this.quesIndex = index;
    this.practiceTestHelperService.moveToNextQuestion(currentIndex, this.quesIndex);
  }

  /**
   * This method is invoked when user clicks on Prev Question
   *
   * @memberof QuestionNavComponent
   */
  showPreviousQues() {
    const currentIndex = this.quesIndex;
    --this.quesIndex;
    this.practiceTestHelperService.moveToNextQuestion(currentIndex, this.quesIndex);
  }

  /**
   * This method is invoked when user clicks on next question
   */
  showNextQues() {
    const currentIndex = this.quesIndex;
    ++this.quesIndex;
    this.practiceTestHelperService.moveToNextQuestion(currentIndex, this.quesIndex);
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

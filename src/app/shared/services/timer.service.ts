import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/takeWhile';

/**
 * Angular service to display timer in Practice test screen
 *
 * @export
 * @class TimerService
 */
@Injectable()
export class TimerService {
  public timer$: BehaviorSubject<number>;

  public questionTimer$: BehaviorSubject<number>;

  private _timerSubscription: Subscription;

  private _questionTimerSubscription: Subscription;

  /**
   * Creates an instance of TimerService.
   */
  constructor() {}

  startTimer(timeLimitInSec?) {
    let timer = Observable.timer(0, 1000);
    if (timeLimitInSec) {
      timer = timer.takeWhile((sec) => sec <= timeLimitInSec);
    }
    this.timer$ = new BehaviorSubject<number>(0);
    this._timerSubscription = timer.subscribe(
      (second) => this.timer$.next(second),
      (error) => {},
      () => this.timer$.complete()
    );
  }

  stopTimer() {
    this._timerSubscription.unsubscribe();
    this.timer$ = null;
  }

  startQuestionTimer(timeTaken) {
    const startTime = this.timer$.value;
    this.questionTimer$ = new BehaviorSubject<number>(timeTaken);
    this._questionTimerSubscription = this.timer$.subscribe((v) => {
      this.questionTimer$.next(timeTaken + (v - startTime));
    });
  }

  stopQuestionTimer() {
    let endTime;
    if (this.questionTimer$) {
      endTime = this.questionTimer$.value;
      this._questionTimerSubscription.unsubscribe();
      this.questionTimer$ = null;
    }
    return endTime;
  }
}

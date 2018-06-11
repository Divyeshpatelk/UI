import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { TimerService } from '../shared/services/timer.service';

@Component({
  selector: 'pdg-practice-test',
  templateUrl: './practice-test.component.html',
  styleUrls: ['./practice-test.component.scss']
})
export class PracticeTestComponent implements OnInit, OnDestroy {

  constructor(private timerService: TimerService) { }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.timerService.timer$) {
      this.timerService.timer$.unsubscribe();
    }
  }
}

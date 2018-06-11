import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { TimerService } from '../shared/services/timer.service';

@Component({
  selector: 'pdg-custom-test',
  templateUrl: './custom-test.component.html',
  styleUrls: ['./custom-test.component.scss']
})
export class CustomTestComponent implements OnInit, OnDestroy {

  constructor(private timerService: TimerService) { }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.timerService.timer$) {
      this.timerService.timer$.unsubscribe();
    }
  }
}

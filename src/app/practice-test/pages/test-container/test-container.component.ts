import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'pdg-test-container',
  templateUrl: './test-container.component.html',
  styleUrls: ['./test-container.component.scss']
})
export class TestContainerComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {

  }

  /**
   * This method is used to handle browser refresh key.
   * @param {any} $event
   */
  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event) {
    $event.returnValue = 'Are you sure?';
  }

  /**
   * This method is used to handle browser back key.
   * @param {any} event
   */
  @HostListener('window:popstate', ['$event'])
  public onPopState(event) {
    window.history.forward();
  }
}

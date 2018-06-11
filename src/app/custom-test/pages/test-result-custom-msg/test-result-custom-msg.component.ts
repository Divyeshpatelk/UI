import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pdg-test-result-custom-msg',
  templateUrl: './test-result-custom-msg.component.html',
  styleUrls: ['./test-result-custom-msg.component.scss']
})
export class TestResultCustomMsgComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  @Input() customMsgHtml: string;
  title = 'Result1';

  ngOnInit() {
  }
}

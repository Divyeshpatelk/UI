import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pdg-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

}

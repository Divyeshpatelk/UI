import { Component, OnInit, Input } from '@angular/core';
import { log } from 'util';

@Component({
  selector: 'pdg-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss']
})
export class InfoBoxComponent implements OnInit {
  infoComponent = [
    {
      img: './assets/images/learn-anywhere.png',
      title: 'Access Anywhere',
      description: 'Study & practice anytime, anywhere on any device'
    },
    {
      img: './assets/images/expert-teach.png',
      title: 'Result feedback',
      description: 'Get answers for all practice questions'
    },
    {
      img: './assets/images/unlimited-excess.png',
      title: 'Unlimited Practice',
      description: 'Get unlimited access to thousands of questions for practice tests'
    }
  ];
  constructor() {}

  ngOnInit() {}
}

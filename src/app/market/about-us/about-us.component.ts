import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'pdg-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  public contact: string;
  @ViewChild('contactus') contactSection: ElementRef;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.contact = this.route.snapshot.paramMap.get('contact');
    if (this.contact !== null) {
      this.scrollTo(this.contactSection.nativeElement);
    } else {
      window.scrollTo(0, 0);
    }
  }

  scrollTo(el) {
    el.scrollIntoView();
  }
}

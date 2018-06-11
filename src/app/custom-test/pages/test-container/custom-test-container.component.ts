import { TranslateService } from '@ngx-translate/core';
import { CustomTestHelperService } from './../../../shared/services/custom-test-helper.service';
import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'pdg-test-container',
  templateUrl: './custom-test-container.component.html',
  styleUrls: ['./custom-test-container.component.scss']
})
export class CustomTestContainerComponent implements OnInit {

  sections: any[];

  constructor(private customTestHelperService: CustomTestHelperService, private translator: TranslateService) {
  }

  ngOnInit() {
    this.sections = this.customTestHelperService.sections;
    if (!this.sections && localStorage.getItem('customTestData')) {
      const obj = JSON.parse(localStorage.getItem('customTestData'));
      this.sections = obj.sections;
    }
    console.log('**********************************');
    console.log(this.sections);
    console.log('**********************************');
  }

  /**
   * This method is used to handle browser refresh key.
   * @param {any} $event
   */
  @HostListener('window:beforeunload', ['$event'])
  public beforeunloadHandler($event) {
    $event.returnValue = this.translator.instant('COMMON_CONFIRM');
  }

  /**
   * This method is used to handle browser back key.
   * @param {any} event
   */
  @HostListener('window:popstate', ['$event'])
  public onPopState(event) {
    window.history.forward();
  }

  beforeSectionChange(event) {
      console.log(event);
      const nextSection = this.sections.filter(
        (section, index) =>  section.id === event.nextId[0]
      );
      console.log(nextSection);
      this.customTestHelperService.changeTestSection((nextSection && nextSection.length > 0 ? nextSection[0] : null));
  }
}

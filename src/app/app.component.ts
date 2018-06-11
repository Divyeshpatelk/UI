import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';

/**
 * Component class for Root Module
 * This serves the router outlet for child modules and components
 *
 * @export
 * @class AppComponent
 */
@Component({
  selector: 'pdg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // Translate Service Instance Variable
  translate: TranslateService;

  // Options for Toast Notifications
  notificationConfig = {
    position: ['top', 'right'],
    timeOut: 5000,
    showProgressBar: true,
    pauseOnHover: true,
    preventDuplicates: true,
    theClass: 'ped-notification'
  };

  constructor(private _translate: TranslateService, private angulartics2GoogleAnalytics: Angulartics2GoogleTagManager) {
    this.translate = _translate;
    this.translate.setDefaultLang('en');

    // Setting default language in Local Storage for access in API's
    localStorage.setItem('lang', 'en');
  }
}

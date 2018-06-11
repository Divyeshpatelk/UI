import { Injectable } from '@angular/core';

/*
* loading spinner and overlay on full body
*
*/
@Injectable()
export class SpinnerService {
  loadingEle: HTMLElement;
  bodyEle: HTMLElement;

  constructor() {
    this.loadingEle = document.createElement('div');
    this.loadingEle.className = 'loading-overlay';
    const spinner = document.createElement('span');
    spinner.className = 'fa fa-circle-o-notch fa-spin fa-3x spinner';
    this.loadingEle.appendChild(spinner);
    this.bodyEle = document.querySelector('body');
  }

  show() {
    if (this.bodyEle.querySelector('.loading-overlay')) { // loading element found in DOM then don't insert new
      return;
    }
    this.bodyEle.appendChild(this.loadingEle);
  }

  hide() {
    if (this.bodyEle.querySelector('.loading-overlay')) { // loading element found in DOM then remove it
      this.loadingEle.parentNode.removeChild(this.loadingEle);
    }
  }
}

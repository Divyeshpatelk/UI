import { Directive, HostListener } from '@angular/core';
import { Constants } from '../../_const';

@Directive({
  selector: '[pdgLogoClickHandle]'
})
export class LogoClickHandleDirective {
  constructor() {}

  @HostListener('click', ['$event'])
  onClick($event: Event) {
    const subdomainMatch = location.hostname.match(Constants.SUBDOMAIN);
    const subdomain = subdomainMatch && subdomainMatch[2];
    const pid = localStorage.getItem('pid');
    if (subdomain && pid) {
      $event.preventDefault();
      $event.stopImmediatePropagation();
      const win = window.open('https://pedagogy.study', '_blank');
      win.focus();
    }
  }
}

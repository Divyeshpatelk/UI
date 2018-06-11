import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTimer'
})
export class FormatTimerPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const seconds = Math.floor(value % 60);
    const minutes = Math.floor((value / 60) % 60);
    const hours = Math.floor((value / (60 * 60)) % 24);
    return (this.format(hours) + ':' + this.format(minutes) + ':' + this.format(seconds));
  }

  format(value) {
    return (value < 10 ? '0' : '') + value;
  }
}

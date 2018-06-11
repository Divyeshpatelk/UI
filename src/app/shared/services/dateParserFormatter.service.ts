/**
 * @class: DateParserFormatter
 * Description: Custom Date formatter to set Date format in ngb datepicker
 *
 * @version: 1.0
 * @author:
 */

import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

/**
 * Method to add 0 before date and month digit
 * @param  {number} value
 *
 */
function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return '';
  }
}

/**
 * Method to check date and month are Not-a-Number
 * @param  {any} value
 *
 */
function isNumber(value: any): boolean {
  return !isNaN(toInteger(value));
}

/**
 * Method to parse date and month to Integer
 * @param  {any} value
 *
 */
function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}


@Injectable()
export class DateParserFormatter extends NgbDateParserFormatter {

  /**
   * Method to parse full Date
   * @param  {anystring} value
   *
   */
  parse(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.trim().split('/');
      if (dateParts.length === 1 && isNumber(dateParts[0])) {
        return { year: toInteger(dateParts[0]), month: null, day: null };
      } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
        return { year: toInteger(dateParts[1]), month: toInteger(dateParts[0]), day: null };
      } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
        return { year: toInteger(dateParts[2]), month: toInteger(dateParts[1]), day: toInteger(dateParts[0]) };
      }
    }
    return null;
  }

  /**
   * Method to format full Date
   * @param  {NgbDateStruct} date
   *
   */
  format(date: NgbDateStruct): string {
    let stringDate = '';
    if (date) {
      stringDate += isNumber(date.day) ? padNumber(date.day) + '/' : '';
      stringDate += isNumber(date.month) ? padNumber(date.month) + '/' : '';
      stringDate += date.year;
    }
    return stringDate;
  }
}

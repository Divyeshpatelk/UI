import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'questionFilter'
})
export class QuestionFilterPipe implements PipeTransform {

  transform(items: Array<any>, filters?: Array<string>): any {
    if (filters.length !== 0 && Array.isArray(items)) {

      let filtered = [];

      items.forEach(item => {
        filters.forEach(filter => {
          if (item[filter]) {
            filtered.push(item);
            return;
          }
        });
      });

      filtered = Array.from(new Set(filtered));
      return filtered;

    } else {
      return items;
    }
  }
}

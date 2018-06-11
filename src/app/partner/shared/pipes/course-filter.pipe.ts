import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'courseFilter'
})
export class CourseFilterPipe implements PipeTransform {
  transform(courses: any[], filter?: any): any {

    if (filter === 'ALL') {
      return courses;
    }

    return courses.filter(course => course.course.status === filter);
  }
}

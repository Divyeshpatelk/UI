import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contentCount'
})
export class ContentCountPipe implements PipeTransform {

  transform(contents: any[], item?: any): any {
    if (!contents) {
      return 0;
    }

    /**
     * Checking on string index, because content type can be video, refvideo or pdf.
     * And on UI only two filters are shown (Video and PDF)
     */
    return contents.filter(content => content.type.indexOf(item) !== -1).length;
  }
}

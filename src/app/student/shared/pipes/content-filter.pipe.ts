import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contentFilter'
})
export class ContentFilterPipe implements PipeTransform {
  transform(contents: any[], item?: any): any {
    if (item === '') {
      return contents;
    }

    /**
     * Checking on string index, because content type can be video, refvideo or pdf.
     * And on UI only two filters are shown (Video and PDF)
     */
    return contents.filter(content => content.type.indexOf(item) !== -1);
  }
}

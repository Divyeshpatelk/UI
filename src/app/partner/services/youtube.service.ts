import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Constants } from '../../_const';

/**
 * Angular service responsible for all rendering youtube video detail with the help of jsonp.
 *
 * @export
 * @class YoutubeService
 * @version 1.0
 * @author
 */
@Injectable()
export class YoutubeService {
  constructor(private http: HttpClient) {
  }

  public getYoutubeData(url: string): Observable<any> {
    const urlWithNoEmbad = `${Constants.YOUTUBE_FETCH_DATA_API}${url}&format=jsonP&callback=JSONP_CALLBACK`;
    return this.http.jsonp(urlWithNoEmbad, 'callback');
  }
}

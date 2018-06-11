import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pdg-thumbnail-youtube',
  templateUrl: './thumbnail-youtube.component.html',
  styleUrls: ['./thumbnail-youtube.component.scss']
})
export class ThumbnailYoutubeComponent implements OnInit {

  /**
   * Thumbnail url of video passed as input from Parent component
   */
  @Input() src: string;
  @Input() height: number;
  @Input() aspectRatio: string;

  private defaultHeight: number;
  private defaultAspectRatio: string;
  public thumbnail;

  constructor() {
    this.defaultHeight = 100;
    this.defaultAspectRatio = '16:9';
  }

  ngOnInit() {
    const height = this.height || this.defaultHeight;
    const aspectRatio = this.aspectRatio || this.defaultAspectRatio;
    const [widthMultiplier, heightMultiplier] = aspectRatio.split(':');
    this.thumbnail = {
      'height': `${height}px`,
      'width': '100%'
    };
    if (this.src) {
      this.thumbnail['background-image'] = `url(${this.src})`;
      this.thumbnail['background-color'] = `transparent`;
    }
  }
}

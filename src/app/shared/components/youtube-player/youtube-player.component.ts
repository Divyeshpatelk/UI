import { Component, OnInit, Input } from '@angular/core';

/**
 * Custom component for Youtube Player
 *
 * @export
 * @class YoutubePlayerComponent
 * @implements {OnInit}
 * @version 1.0
 * @author
 */
@Component({
  selector: 'pdg-youtube-player',
  templateUrl: './youtube-player.component.html',
  styleUrls: ['./youtube-player.component.scss']
})
export class YoutubePlayerComponent implements OnInit {
  /**
   * Youtube URL
   */
  @Input() src;

  /**
   * Creates an instance of YoutubePlayerComponent.
   */
  constructor() { }

  /**
   * Overridden method invoked when component is loaded
   */
  ngOnInit() {

  }
}

import { Component, OnInit, Input } from '@angular/core';
import { VgAPI } from 'videogular2/core';

/**
 * Custom component for Video Player.
 *
 * @export
 * @class VideoPlayerComponent
 * @implements {OnInit}
 * @version 1.0
 * @author
 */
@Component({
  selector: 'pdg-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  /**
   * Videogular Player Instance
   *
   * @type {VgAPI}
   */
  api: VgAPI;

  /**
   * Video's CDN URL passed from parent component
   */
  @Input() src;

  /**
   * Creates an instance of VideoPlayerComponent.
   */
  constructor() { }

  ngOnInit() {
  }

  /**
   * Callback function invoked when Videogular player is ready
   *
   * @param {VgAPI} api
   */
  onPlayerReady(api: VgAPI) {
    this.api = api;
  }
}

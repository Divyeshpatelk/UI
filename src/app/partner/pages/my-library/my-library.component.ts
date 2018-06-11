import { Component, OnInit } from '@angular/core';

/**
 * Component Class for My Library Screen. Serves router outlet for Study Material and Questions tab.
 *
 * @export
 * @class MyLibraryComponent
 * @implements {OnInit}
 * @version 1.0
 * @author
 */
@Component({
  selector: 'pdg-my-library',
  templateUrl: './my-library.component.html',
  styleUrls: ['./my-library.component.scss']
})
export class MyLibraryComponent implements OnInit {

  /**
   * Creates an instance of MyLibraryComponent.
   */
  constructor() { }

  /**
   * Overridden method invoked when component is loaded.
   */
  ngOnInit() {
  }
}

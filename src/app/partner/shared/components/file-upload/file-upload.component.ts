import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { NotificationsService } from 'angular2-notifications';

/**
 * Custom component for File Uploading feature.
 * This component will be configurable to enable it to be used from different places.
 *
 * @export
 * @class FileUploadComponent
 * @version 1.0
 * @author
 */
@Component({
  selector: 'pdg-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  /**
   * Uploader Options
   * @type {UploaderOptions}
   */
  options: UploaderOptions;

  /**
   * Array of files uploaded to the queue
   * @type {UploadFile[]}
   */
  files: UploadFile[];

  /**
   * Event Emitter Instance
   * @type {EventEmitter<UploadInput>}
   */
  uploadInput: EventEmitter<UploadInput>;

  /**
   * Boolean for drag event
   *
   * @type {boolean}
   */
  dragOver: boolean;

  /**
   *
   * Accepted file formats passed as string
   * @type {string}
   */
  @Input() acceptedFileFormats: string;

  /**
   * Output event emitter
   * @type {EventEmitter<any>}
   */
  @Output() uploadedContent: EventEmitter<any> = new EventEmitter();

  /**
   * Creates an instance of FileUploadComponent.
   */
  constructor(private notifyService: NotificationsService) {
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
  }

  /**
   * Callback Method invoked when file is uploaded via either drag & drop or browse through input
   *
   * @param {UploadOutput} output
   */
  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') { // add file to array when added
      if (output.file.type !== '' && this.acceptedFileFormats.indexOf(output.file.type) !== -1) {
        this.files.push(output.file);
        this.uploadedContent.emit(output.file);

      } else {
        this.uploadInput.emit({ type: 'remove', id: output.file.id });
        this.notifyService.error('File not accepted', 'Expected an image', {
          clickToClose: false
        });
      }

    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);

    } else if (output.type === 'dragOver') {
      this.dragOver = true;

    } else if (output.type === 'dragOut') {
      this.dragOver = false;

    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }

  /**
   * Method to remove one file from the uploader queue
   *
   * @param {string} id Unique Id of the file to be removed
   */
  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  /**
   * Method to remove all files from the uploader queue
   */
  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }
}

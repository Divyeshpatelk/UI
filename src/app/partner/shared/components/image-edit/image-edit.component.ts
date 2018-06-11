import { Component, EventEmitter, Input, AfterViewInit, Output, ViewChild } from '@angular/core';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * Component class for Image Edit Component
 *
 * @export
 * @class ImageEditComponent
 * @implements {OnInit}
 * @version 1.0
 * @author
 */
@Component({
  selector: 'pdg-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.scss']
})
export class ImageEditComponent implements AfterViewInit {

  /**
   * Input Image File
   * @type {File}
   */
  @Input() file: File;

  /**
   * Cropper Width
   * @type {number}
   */
  @Input() width: number;

  /**
   * Cropper Height
   * @type {number}
   */
  @Input() height: number;

  /**
   * Variable for image data
   * @type {*}
   */
  data: any;

  /**
   * ImageCropperComponent Instance
   * @type {ImageCropperComponent}
   */
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

  /**
   * CropperSettings Instance
   * @type {CropperSettings}
   */
  cropperSettings: CropperSettings;

  /**
   * Creates an instance of ImageEditComponent.
   * @param {NgbActiveModal} activeModal
   */
  constructor(public activeModal: NgbActiveModal) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.noFileInput = true;
    this.cropperSettings.width = 302;
    this.cropperSettings.height = 440;
    this.cropperSettings.preserveSize = true;
    this.data = {};
  }

  /**
   * Overridden method invoked when component is loaded
   *
   * @memberof ImageEditComponent
   */
  ngAfterViewInit() {
    const image: any = new Image();
    const that = this;
    const myReader: FileReader = new FileReader();

    // Reading image file as data
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      setTimeout(function () {
        that.cropper.setImage(image);
      }, 5);
    };
    myReader.readAsDataURL(this.file);
  }

  /**
   * Method invoked on submit button click.
   * Cropped Image is saved as base64 string by the Image Cropper Component.
   * base64 string is then converted to File Object to be sent to the server.
   */
  submit() {
    const editedFile = this.dataURLtoFile(this.data.image, this.file.name);

    const editedImage = {
      'url': this.data.image,
      'file': editedFile,
      'width': this.cropperSettings.width,
      'height': this.cropperSettings.height
    };
    this.activeModal.close(editedImage);
  }

  /**
   * Return a File instance
   *
   * @param {any} dataurl Image Data Url
   * @param {any} filename Image Filename
   * @returns File Object
   */
  dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
}

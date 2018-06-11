import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import fscreen from 'fscreen';

/**
 * Custom component for Pdf Reader.
 *
 * @export
 * @class PdfReaderComponent
 * @implements {OnInit}
 * @version 1.0
 * @author
 */
@Component({
  selector: 'pdg-pdf-reader',
  templateUrl: './pdf-reader.component.html',
  styleUrls: ['./pdf-reader.component.scss']
})
export class PdfReaderComponent implements OnInit {

  /**
   * Pdf url passed from parent component
   */
  @Input() src;

  /**
   * Decorator to get/select DOM Element pdfReader
   */
  @ViewChild('pdfReader') pdfReader: ElementRef;

  /**
   * Decorator for Page Number input element
   * @type {ElementRef}
   */
  @ViewChild('pageNumber') input: ElementRef;

  /**
   * Flag to hide/show pdf
   */
  showPdf = false;

  /**
   * Flag to hide/show loader
   */
  showLoader = true;

  /**
   * Flag to hid/show loader
   */
  fitToPage = false;

  /**
   * Flag to hid/show loader
   */
  page = 1;

  /**
   * pdf initial zoom value
   */
  zoom = 1;

  /**
   * pdf initial rotation value
   */
  rotation = 0;

  /**
    * pdf initial zoom percentage
    */
  zoomPercentage = '100%';

  /**
    * pdf initial total page count
    */
  pdfTotalPage = 0;

  /**
    * flag to enable text-redering
    */
  renderText = false;

  /**
   * Flag to enable / disable autoresize
   */
  autoResize = false;

  /**
   * Flag to enable / disable original Size
   */
  originalSize = true;

  prevZoom = 1;

  prevZoomPer = '100%';

  /**
   * Creates an instance of PdfReaderComponent.
   */
  constructor() {}

  ngOnInit() {
    this.autoResize = true;
    if (window.innerWidth <= 991) {
      this.fitToPage = true;
    }
    this.setAutoResize();
  }

  /**
    * Method to increase/decrease zoom of pdf file
    * @param {number} amount
    */
  incrementZoom(amount: number) {
    if (this.autoResize) {
      this.autoResize = false;
      this.originalSize = true;
    }

    if (this.zoom === 0.75 || this.zoom === 1.25) {
      this.zoom = amount < 0 ? this.zoom - 0.05 : this.zoom + 0.05;
    } else {
      this.zoom += amount;
    }
    this.zoomPercentage = (Math.round(this.zoom * 100)).toString();
    this.zoomPercentage += '%';
  }


  /**
    * Method to rotate pdf by given angle
    * @param {number} angle
    */
  rotate(angle: number) {
    this.rotation += angle;
  }


  /**
    * Method to increase/decrease page value
    * @param {number} amount
    */
  incrementPage(amount: number) {
    this.page = (+this.page);
    this.page += amount;
  }

  /**
    * Method to get total pages of pdf
    * @param {PDFDocumentProxy} pdf
    */
  afterLoadComplete(pdf) {
    this.showLoader = false;
    this.showPdf = true;
    this.pdfTotalPage = pdf.numPages;
  }

  /**
    * Method to set apply zoom to pdf by given value
    * @param {number} value
    */
  setZoom(value: number) {
    if (this.autoResize) {
      this.autoResize = false;
      this.originalSize = true;
    }
    this.zoom = value;
    this.zoomPercentage = (Math.round(this.zoom * 100)).toString();
    this.zoomPercentage += '%';
  }

  /**
   * Method to apply fullscreen to pdf
   */
  showFullscreen() {
    if (fscreen.fullscreenEnabled && fscreen.fullscreenElement === null) {
      fscreen.requestFullscreen(this.pdfReader.nativeElement);
    } else {
      fscreen.exitFullscreen();
    }
  }

  /*
   * Method to enable / disable auto resize
   */
  setAutoResize() {
    this.originalSize = !this.autoResize;
    if (this.autoResize) {
      this.prevZoom = this.zoom;
      this.prevZoomPer = this.zoomPercentage;
      this.zoom = 1;
      this.zoomPercentage = '100%';

    } else {
      this.zoom = this.prevZoom;
      this.zoomPercentage = this.prevZoomPer;
    }
  }

  changePage(value) {
    if (value && (value < 1 || value > this.pdfTotalPage)) {
      this.page = 1;
      this.input.nativeElement.value = this.page;
      return;
    }

    if (value) {
      this.page = +value;
      if (isNaN(this.page)) {
        this.page = 1;
      }
      this.input.nativeElement.value = this.page;
    }
  }
}

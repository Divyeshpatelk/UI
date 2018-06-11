import { Directive, Output, EventEmitter, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[pdgFileDrop]'
})
export class FileDropDirective implements OnInit {

  private el: HTMLInputElement;
  @Output() private fileDrop: EventEmitter<FileList>;
  @Output() private fileDragOver: EventEmitter<DragEvent>;
  @Output() private fileDragLeave: EventEmitter<DragEvent>;

  constructor(private elementRef: ElementRef) {
    this.fileDrop = new EventEmitter<FileList>();
    this.fileDragOver = new EventEmitter<DragEvent>();
    this.fileDragLeave = new EventEmitter<DragEvent>();
  }

  @HostListener('drop', ['$event'])
  public onDrop(e: any) {
    e.stopPropagation();
    e.preventDefault();

    this.fileDrop.emit(e.dataTransfer.files);
  }

  @HostListener('dragover', ['$event'])
  public onDragOver(e: DragEvent) {
    if (!e) {
      return;
    }

    this.fileDragOver.emit(e);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(e: DragEvent) {
    if (!e) {
      return;
    }

    this.fileDragLeave.emit(e);
  }

  public ngOnInit() {
    this.el = this.elementRef.nativeElement;

    this.el.addEventListener('drop', this.stopEvent, false);
    this.el.addEventListener('dragenter', this.stopEvent, false);
    this.el.addEventListener('dragover', this.stopEvent, false);
  }

  private stopEvent = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
  }

}

import { Directive, Output, EventEmitter, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[pdgFileSelect]'
})
export class FileSelectDirective implements OnInit {

  @Output() private fileSelect: EventEmitter<File> = new EventEmitter<File>();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  public ngOnInit() {
    this.el.nativeElement.addEventListener('change', this.onChange.bind(this));
  }

  private onChange(e: Event) {
    const files = this.el.nativeElement.files;
    this.fileSelect.emit(files);
  }
}

import { Component, OnInit, ViewChild, ElementRef, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  Validator,
  AbstractControl,
  ValidationErrors,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS
} from '@angular/forms';

import * as QuillNamespace from 'quill';
const Quill: any = QuillNamespace;

import * as DeltaNamespace from 'quill-delta';
const Delta: any = DeltaNamespace;

// add image resize module
import { ImageDrop } from 'quill-image-drop-module';
Quill.register('modules/imageDrop', ImageDrop);

// import ImageResize from 'quill-image-resize-module';
// Quill.register('modules/imageResize', ImageResize);

// const FontAttributor = Quill.import('attributors/class/font');
// FontAttributor.whitelist = ['sans-serif', 'gopika-two', '"B Bharati GopikaTwo"'];
// Quill.register(FontAttributor, true);

// Add fonts to whitelist
const Font = Quill.import('formats/font');
// We do not add Aref Ruqaa since it is the default
Font.whitelist = ['bharati-gopika', 'gopika-two-2', 'euclid-symbol'];
Quill.register(Font, true);

// Quill.debug('info');

interface Model {
  html: string;
  delta: string;
}

@Component({
  selector: 'pdg-question-editor',
  templateUrl: './question-editor.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuestionEditorComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => QuestionEditorComponent),
      multi: true
    }
  ],
  styleUrls: ['./question-editor.component.scss']
})
export class QuestionEditorComponent implements OnInit, ControlValueAccessor, Validator {
  @ViewChild('toolbar') toolbarElem: ElementRef;
  @ViewChild('editor') editorElem: ElementRef;

  model: Model;

  formats = [
    'font',
    'bold',
    'italic',
    'underline',
    'strike',
    'script',
    'list',
    'indent',
    'align',
    'link',
    'image',
    'formula'
  ];
  modules = {
    imageDrop: true
  };
  theme = 'snow';

  fontRegexes = {
    'bharati-gopika': /bharati[ ]?gopika/i,
    'gopika-two-2': /GopikaTwo/i,
    'euclid-symbol': /symbol/i
  };

  quillEditor;

  // The internal data model
  private innerValue: Model = null;
  onChangeCallback: Function = () => {};
  onTouchedCallback: Function = () => {};
  onValidatorChange: Function = () => {};

  constructor(private elementRef: ElementRef) {}

  // ngOnInit() {}

  ngOnInit() {
    this.modules['toolbar'] = this.toolbarElem.nativeElement;

    this.quillEditor = new Quill(this.editorElem.nativeElement, {
      modules: this.modules,
      placeholder: 'Insert text here...',
      theme: this.theme || 'snow',
      formats: this.formats,
      strict: true
    });

    if (this.innerValue) {
      this.quillEditor.setContents(this.getDelta(this.innerValue));
      this.quillEditor.history.clear();
    }

    const that = this;
    this.quillEditor.clipboard.addMatcher(Node.ELEMENT_NODE, function(node, delta) {
      const fontFamily = that.getFontFamily(node);
      if (fontFamily.length > 0) {
        for (let i = 0; i < fontFamily.length; i++) {
          const font = fontFamily[i];
          const fontClass = that.getFontClass(font);
          if (fontClass) {
            delta = delta.compose(new Delta().retain(delta.length(), { font: fontClass }));
            break;
          }
        }
      }
      return delta;
    });

    // mark model as touched if editor lost focus
    this.quillEditor.on('selection-change', (range: any, oldRange: any, source: string) => {
      // TODO
      if (!range) {
        this.onTouchedCallback();
      }
    });

    this.quillEditor.on('text-change', (delta: any, oldDelta: any, source: string) => {
      const contentLength = this.quillEditor.getLength();
      let model: Model = null;
      if (contentLength > 1) {
        model = {
          html: this.editorElem.nativeElement.children[0].innerHTML,
          delta: JSON.stringify(this.quillEditor.getContents())
        };
      }
      this.onChangeCallback(model);
    });
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  validate(c: AbstractControl): ValidationErrors {
    return null;
  }

  getDelta(model: Model) {
    let delta = null;
    if (model.delta && typeof model.delta === 'string') {
      delta = JSON.parse(model.delta).ops;
    }
    return delta;
  }

  writeValue(value: Model) {
    this.innerValue = value;
    if (this.quillEditor) {
      if (this.innerValue) {
        this.quillEditor.setContents(this.getDelta(this.innerValue));
        return;
      }
      this.quillEditor.setText('');
    }
  }

  registerOnChange(fn: Function): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouchedCallback = fn;
  }

  getFontFamily(node: Node) {
    let fontFamily = [];
    const attributes = node.attributes;
    if (node.nodeName === 'FONT') {
      const face = attributes.getNamedItem('face') && attributes.getNamedItem('face').value;
      if (face) {
        if (face.indexOf(',') !== -1) {
          fontFamily = face.split(',');
        } else {
          fontFamily.push(face);
        }
      }
    }
    return fontFamily;
  }

  getFontClass(font: string) {
    for (const key in this.fontRegexes) {
      if (this.fontRegexes.hasOwnProperty(key)) {
        const match = font.match(this.fontRegexes[key]);
        if (match) {
          return key;
        }
      }
    }
    return;
  }
}

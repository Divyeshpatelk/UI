import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Custom Inline Text Editor. Supports required, disabled, mininum length, maximum length for normal text fields.
 *
 * @export
 * @class InlineTextEditorComponent
 * @implements {OnInit}
 * @implements {ControlValueAccessor}
 */
@Component({
  selector: 'pdg-inline-text-editor',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InlineTextEditorComponent),
    multi: true
  }],
  templateUrl: './inline-text-editor.component.html',
  styleUrls: ['./inline-text-editor.component.scss']
})
export class InlineTextEditorComponent implements OnInit, ControlValueAccessor {

  /**
   * Input DOM Element
   */
  @ViewChild('inlineEditControl') inlineEditControl;

  @Input() type: string;
  /**
   * Label value for Input element
   */
  @Input() label = '';

  /**
   * Disabled attribute for Input Element
   */
  @Input() disabled = false;

  /**
   * Required attribute for Input Element
   */
  @Input() required = false;

  /**
   * Minimum Length attribute for Input Element
   * @type {number}
   */
  @Input() minLength: number;

  /**
   * Maximum Length attribute for Input Element
   * @type {number}
   */
  @Input() maxLength: number;

  /**
   * Tooltip for the element
   * @type {string}
   */
  @Input() tooltip: string;

  /**
   * Callback event triggered on Input Value save
   */
  @Output() save = new EventEmitter<string>();

  /**
   * Callback event triggered on Input Value error
   * @memberof InlineTextEditorComponent
   */
  @Output() error = new EventEmitter<string>();

  /**
   * Trascend the onChange event
   * @type {*}
   */
  public onChange: any = Function.prototype;

  /**
   * Trascend the onTouch event
   * @type {*}
   */
  public onTouched: any = Function.prototype;

  /**
   * Variable to hold component's edit mode
   * @private
   * @type {boolean}
   */
  public editing = false;

  /**
   * Variable to hold previous value of Input Element
   * @private
   * @type {string}
   */
  private preValue: string;

  /**
   * Variable for Input Element Value
   * @private
   * @type {string}
   */
  private _value: string;

  /**
   * Variable for Input Element Validation Error
   * @private
   * @type {boolean}
   */
  public validationError = false;

  /**
   * Creates an instance of InlineTextEditorComponent.
   */
  constructor() { }

  /**
   * Overridden method invoked when component is loaded
   */
  ngOnInit() {
  }

  /**
   * Method to get the value
   * @type {*}
   */
  get value(): any {
    return this._value;
  }

  /**
   * Method to set the value
   */
  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  /**
   * Overridden method of ControlValueAccessor Interface
   * @param {*} value
   */
  writeValue(value: any) {
    this._value = value;
  }

  /**
   * Overridden method of ControlValueAccessor Interface
   * @param {(_: any) => {}} fn
   */
  public registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }

  /**
   *  Overridden method of ControlValueAccessor Interface
   * @param {() => {}} fn
   */
  public registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  /**
   * Method invoked when clicked on Input Element
   * @param {any} value
   * @returns
   */
  edit(value) {
    if (this.disabled) {
      return;
    }
    this.preValue = value;
    this.editing = true;

    // Focus on the input element just as the editing begins
    // setTimeout(_ => this.inlineEditControl.nativeElement.focus());
  }

  /**
   * Validate Method invoked on enter key / Submit icon click
   * @returns
   */
  validate() {
    // Required
    if (this.required) {
      if (this._value.length === 0) {
        this.validationError = true;
        this.error.emit(`${this.label} can not be left empty`);
        return;
      }
    }

    if (this.minLength !== undefined) {
      if (this._value.length < this.minLength) {
        this.validationError = true;
        this.error.emit(`${this.label} minimum length error`);
        return;
      }
    }

    if (this.maxLength !== undefined) {
      if (this._value.length > this.maxLength) {
        this.validationError = true;
        this.error.emit(`${this.label} maximum length error`);
        return;
      }
    }

    if (!this.validationError) {
      this.emitSave();
    }
  }

  /**
   * Method invoked once input element is valid
   */
  emitSave() {
    this._value.trim();
    this.validationError = false;
    this.editing = false;
    this.save.emit(this._value.trim());
  }

  /**
   * Method invoked on cancel key / escape key press
   * Send Callback to parent element with the input value
   */
  cancel() {
    this.validationError = false;
    this.editing = false;
    this._value = this.preValue;
  }
}

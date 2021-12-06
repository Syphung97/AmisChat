
import { Component, OnInit, forwardRef, Output, EventEmitter, Input, ViewChild, ElementRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "amis-textbox",
  templateUrl: "./amis-textbox.component.html",
  styleUrls: ["./amis-textbox.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmisTextboxComponent),
      multi: true
    }
  ]
})
export class AmisTextboxComponent implements OnInit, ControlValueAccessor {

  @Output() valueChanged: EventEmitter<any> = new EventEmitter();

  @Output() afterValidated: EventEmitter<any> = new EventEmitter();

  @Output() isErrorCustomChange: EventEmitter<any> = new EventEmitter();
  @ViewChild("input", { static: false }) input: ElementRef;

  public _value: any;
  @Input()
  get value(): string {
    return this._value;
  }
  set value(str: string) {
    this.onTouched(this.value);
    this.writeValue(str);
  }

  /**
   * Disable input
   * created by vhtruong - 07/03/2020
   */
  _readonly: boolean = false;
  @Input() get readonly() {
    return this._readonly;
  }
  set readonly(val) {
    this._readonly = val;
  }

  /**
   * Placehoder trong input
   * created by vhtruong - 07/03/2020
   */
  _placeholder: string = "";
  @Input() get placehoder() {
    return this._placeholder;
  }
  set placehoder(val) {
    this._placeholder = val;
  }

  /**
   * mask
   * created by vhtruong - 07/03/2020
   */
  _mask: string = "";
  @Input() get mask() {
    return this._mask;
  }
  set mask(val) {
    this._mask = val;
  }

  /**
   * kiểu hiển thị:  "text" | "password" | "number"
   * created by vhtruong - 07/03/2020
   */
  _type: string = "text";
  @Input() get type() {
    return this._type;
  }
  set type(val) {
    this._type = val;
  }

  /**
   * maxlength
   * created by vhtruong - 07/03/2020
   */
  _maxLength: number;
  @Input() get maxLength() {
    return this._maxLength;
  }
  set maxLength(val) {
    this._maxLength = val;
  }

  /**
   * minlength
   * created by vhtruong - 07/03/2020
   */
  _minLength: number;
  @Input() get minLength() {
    return this._minLength;
  }
  set minLength(val) {
    this._minLength = val;
  }

  /**
   * input có lỗi hay không
   * created by vhtruong - 07/03/2020
   */
  _isError: boolean = false;
  @Input() get isError() {
    return this._isError;
  }
  set isError(val) {
    this._isError = val;
  }

  /**
   * input có lỗi không trong validate form hay không
   * created by vhtruong - 07/03/2020
   */
  _isErrorCustom: boolean = false;
  @Input() get isErrorCustom() {
    return this._isErrorCustom;
  }
  set isErrorCustom(val) {
    this._isErrorCustom = val;
    console.log(this._isErrorCustom)
  }

  /**
   * message thông báo lỗi
   * created by vhtruong - 07/03/2020
   */
  _errorMessage: string = "";
  @Input() get errorMessage() {
    return this._errorMessage;
  }
  set errorMessage(val) {
    this._errorMessage = val;
  }

  /**
   * Submit form
   * created by vhtruong - 07/03/2020
   */
  _isSubmit: boolean = false;
  @Input() get isSubmit() {
    return this._isSubmit;
  }
  set isSubmit(val) {
    this._isSubmit = val;
    if (this._isSubmit && !this._readonly) {
    }
  }

  /**
   * Có show lỗi hay không
   * created by vhtruong - 07/03/2020
   */
  _isShowError: boolean = false;
  @Input() get isShowError() {
    return this._isShowError;
  }
  set isShowError(val) {
    this._isShowError = val;
  }

  /**
   * Có sử dụng thông báo lỗi mặc định hay không
   * created by vhtruong - 07/03/2020
   */
  _isUseErrorMessageDefault: boolean = true;
  @Input() get isUseErrorMessageDefault() {
    return this._isUseErrorMessageDefault;
  }
  set isUseErrorMessageDefault(val) {
    this._isUseErrorMessageDefault = val;
  }

  constructor() { }

  ngOnInit(): void {
  }

  writeValue(obj: any): void {
    this._value = obj;
    this.onChange(this.value);
    this.valueChanged.emit(this._value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  onChange = (fn) => { };

  onTouched = (fn) => { };

  /**
   * Thay đổi giá trị input
   * created by vhtruong - 07/03/2020
   */
  onValueChanged() {
    if (this._isErrorCustom) {
      this._isErrorCustom = false;
      this.isErrorCustomChange.emit(this._isErrorCustom);
    }
  }


}



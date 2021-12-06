import { Component, OnInit, forwardRef, Output, EventEmitter, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { BaseControl } from '../base-control';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';

@Component({
  selector: 'amis-amis-control-monthyear',
  templateUrl: './amis-control-monthyear.component.html',
  styleUrls: ['./amis-control-monthyear.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmisControlMonthyearComponent),
      multi: true
    }
  ]
})
export class AmisControlMonthyearComponent extends BaseControl implements OnInit, ControlValueAccessor {

  @Output() valueChanged: EventEmitter<any> = new EventEmitter();

  @Output() afterValidated: EventEmitter<any> = new EventEmitter();

  public _value: Date;
  @Input()
  get value(): Date {
    return this._value;
  }
  set value(str: Date) {
    this.onTouched(this.value);
    this.writeValue(str);
  }

  /**
   * Format date
   * created by vhtruong - 07/03/2020
   */
  _formatDate: string = "MM/yyyy";
  @Input() get formatDate() {
    return this._formatDate;
  }
  set formatDate(val) {
    if(val){
      this._formatDate = val;
    }
  }

  /**
   * type
   * created by vhtruong - 07/03/2020
   */
  _type: string = "date";
  @Input() get type() {
    return this._type;
  }
  set type(val) {
    if(val){
      this._type = val;
    }
  }

  constructor(
    public httpBase: AmisDataService,
    public amisTransferDataService: AmisTransferDataService,
    public amisTranslateSV: AmisTranslationService
  ) {
    super(amisTransferDataService, amisTranslateSV);
  }

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
  }

}

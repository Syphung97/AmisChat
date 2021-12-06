import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { BaseControl } from '../base-control';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';

@Component({
  selector: 'amis-amis-control-textbox',
  templateUrl: './amis-control-textbox.component.html',
  styleUrls: ['./amis-control-textbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmisControlTextboxComponent),
      multi: true
    }
  ]
})
export class AmisControlTextboxComponent extends BaseControl implements OnInit, ControlValueAccessor {

  @ViewChild("input", { static: false }) input: ElementRef;

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
   * kiểu hiển thị:  "text" | "password" | "number" | "hyperlink"
   * created by vhtruong - 07/03/2020
   */
  _type: string = "text";
  @Input() get type() {
    return this._type;
  }
  set type(val) {
    this._type = val;
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
    this.onChange(this._value);
    // if(this._readonly){
    //   this.onValueChanged();
    // }
  }

}


import { Component, OnInit, Output, EventEmitter, Input, forwardRef, LOCALE_ID, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControl } from '../base-control';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { TypeControl } from 'src/app/shared/enum/common/type-control.enum';
import { DxNumberBoxComponent } from 'devextreme-angular';

@Component({
  selector: 'amis-amis-control-numberbox',
  templateUrl: './amis-control-numberbox.component.html',
  styleUrls: ['./amis-control-numberbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmisControlNumberboxComponent),
      multi: true
    }
  ]
})
export class AmisControlNumberboxComponent extends BaseControl implements OnInit, ControlValueAccessor {

  @ViewChild('input') input: DxNumberBoxComponent;
  
  /**
   * Show button tăng giảm số
   * created by vhtruong - 07/03/2020
   */
  _showSpinButton: boolean = true;
  @Input() get showSpinButton() {
    return this._showSpinButton;
  }
  set showSpinButton(val) {
    this._showSpinButton = val;
  }

  /**
   * format
   * created by vhtruong - 07/03/2020
   */
  _format: string = "";
  @Input() get format() {
    return this._format;
  }
  set format(val) {
    if (val) {
      this._format = val;
    }
  }

  _currencyCode: string = "VND";
  @Input() get currencyCode() {
    return this._currencyCode;
  }
  set currencyCode(val) {
    if (val) {
      this._currencyCode = val;
    }
  }

  _typeControl: TypeControl = TypeControl.Number;
  @Input() get typeControl() {
    return this._typeControl;
  }
  set typeControl(val) {
    if (val) {
      this._typeControl = val;
    }
  }
  typeControlEntity: any = TypeControl;

  constructor(
    public httpBase: AmisDataService,
    public amisTransferDataService: AmisTransferDataService,
    public amisTranslateSV: AmisTranslationService
  ) {
    super(amisTransferDataService, amisTranslateSV);
  }

  ngOnInit(): void {
  }

  /**
   * Thay đổi giá trị input
   * created by vhtruong - 07/03/2020
   */
  onValueChanged(e) {
    if (e.event) {
      super.onValueChanged();
    }
  }

}

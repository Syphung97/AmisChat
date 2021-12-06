import { Component, OnInit, Output, EventEmitter, Input, forwardRef, LOCALE_ID, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControl } from '../base-control';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { TypeControl } from 'src/app/shared/enum/common/type-control.enum';
import { isThisSecond } from 'date-fns';
import { AmisNumberUtils } from 'src/common/fn/number-utils';

@Component({
  selector: 'amis-amis-control-filesize',
  templateUrl: './amis-control-filesize.component.html',
  styleUrls: ['./amis-control-filesize.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmisControlFileSizeComponent),
      multi: true
    }
  ]
})
export class AmisControlFileSizeComponent extends BaseControl implements OnInit, ControlValueAccessor {

  @ViewChild('input') input: ElementRef;

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

  _unitType = 'KB';

  valueDisplay: any;
  typeControlEntity: any = TypeControl;

  constructor(
    public httpBase: AmisDataService,
    public amisTransferDataService: AmisTransferDataService,
    public amisTranslateSV: AmisTranslationService
  ) {
    super(amisTransferDataService, amisTranslateSV);
  }

  ngOnInit(): void {
    if (!!this.data?.Value) {
      this.convertFileSize(this.data.Value);
    }
  }

  /**
   * Thay đổi giá trị input
   * created by vbocng - 02/07/2020
   */
  onValueChanged(e) {
    if (e) {
      {
        let valu = e.value;
        if (!valu) {
          valu = 0;
        }
        this.convertFileSize(valu);
      }
    }
  }
  /**
   * hàm convert file size
   *
   * @param {any} value
   * @memberof AmisControlFileSizeComponent
   */
  convertFileSize(value) {
    switch (this._unitType) {
      case 'KB':
        const sizeKB = parseInt(value, 0) / 1024;
        this.valueDisplay = Math.ceil(sizeKB);
        break;
      case 'MB':
        const sizeMB = parseInt(value, 0) / Math.pow(1024, 2);
        this.valueDisplay = Math.ceil(sizeMB);
        break;
      default:
        this.valueDisplay = value;
        break;
    }
  }
  /**
   *
   *
   * @memberof AmisControlUploadFileComponent
   */
  setCustomConfigInField(cusConfig) {
    this._unitType = cusConfig.UnitType ? cusConfig.UnitType : this._unitType;
  }

}

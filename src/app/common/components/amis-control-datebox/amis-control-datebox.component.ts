import { Component, OnInit, Input, Output, EventEmitter, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControl } from '../base-control';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { TypeControl } from 'src/app/shared/enum/common/type-control.enum';

@Component({
  selector: 'amis-amis-control-datebox',
  templateUrl: './amis-control-datebox.component.html',
  styleUrls: ['./amis-control-datebox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmisControlDateboxComponent),
      multi: true
    }
  ],
})
export class AmisControlDateboxComponent extends BaseControl implements OnInit, ControlValueAccessor {

  @ViewChild("datebox", { static: false }) datebox: ElementRef;


  /**
   * Format date
   * created by vhtruong - 07/03/2020
   */
  _formatDate: string = "dd/MM/yyyy";
  @Input() get formatDate() {
    return this._formatDate;
  }
  set formatDate(val) {
    if (val) {
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
    if (val) {
      this._type = val;
    }
  }

   /**
   * show clear button
   * created by ptsy - 07/03/2020
   */
  _showClearButton: boolean = true;
  @Input() get showClearButton() {
    return this._showClearButton;
  }
  set showClearButton(val) {
    if (val) {
      this._showClearButton = val;
    }
  }

  _typeControl: TypeControl = TypeControl.Date;
  @Input() get typeControl() {
    return this._typeControl;
  }
  set typeControl(val) {
    if (val) {
      this._typeControl = val;
      switch (this._typeControl) {
        case TypeControl.Date:
          this.calendarOptions.maxZoomLevel = "month";
          break;
        case TypeControl.MonthYear:
          this.calendarOptions.maxZoomLevel = "year";
          break;
        case TypeControl.Year:
          this.calendarOptions.maxZoomLevel = "decade";
          break;
      }
    }
  }
  typeControlEntity: any = TypeControl;

  //  'century' | 'decade' | 'month' | 'year'
  calendarOptions = {
    maxZoomLevel: "month",
    minZoomLevel: "century"
  };

  //kiểm tra load lần đầu
  isLoaded = false;
  constructor(
    public httpBase: AmisDataService,
    public amisTransferDataService: AmisTransferDataService,
    public amisTranslateSV: AmisTranslationService
  ) {
    super(amisTransferDataService, amisTranslateSV);
  }

  ngOnInit(): void {
    if (!this.minValue) {
      this.minValue = new Date('01/01/1753');
    }
  }

  /**
   * hàm thay đổi dữ liệu control
   *
   * @param {any} e
   * @memberof AmisControlDateboxComponent
   * vbcong 06/06/2020
   */
  valueChangedDate(e) {
    
    if (!!this.value && this.value < this.minValue) {
      this.value = this.minValue;
    }
    // thêm xử lý chuyển sang date cất xuống có múi giờ
    if (!!this.value && isNaN(this.value) && this.value instanceof Date === false) {
      const valueDate = new Date(this.value);
      if (valueDate instanceof Date === true && !isNaN(valueDate.getTime())) {
        this.value = valueDate;
      }
    }
    if (this.value instanceof Date && !isNaN(this.value.getTime())) {
      // let diffTimeZone = (new Date().getTimezoneOffset() - this.value.getTimezoneOffset()) / 60;
      // diffTimeZone = Math.ceil(diffTimeZone);
      // let diffTimeZone = new Date().getTimezoneOffset() / 60;
      this.value = new Date(this.value.setHours(Math.ceil(-this.value.getTimezoneOffset())/60, 0, 0, 0));
      // this.value = new Date(this.value.setHours(0, 0, 0, 0));
    }
    if (e.event) {
      super.onValueChanged(e);
    }
  }

}

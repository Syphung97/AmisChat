import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from 'src/common/components/base-component';
import { TypeControl } from 'src/app/shared/enum/common/type-control.enum';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { now } from 'src/common/fn/expression-parse/functions';

@Component({
  selector: 'amis-popup-terminate-contract',
  templateUrl: './popup-terminate-contract.component.html',
  styleUrls: ['./popup-terminate-contract.component.scss']
})
export class PopupTerminateContractComponent extends BaseComponent implements OnInit {

  //#region popup base
  @Input()
  visiblePopup = false;

  // Output hủy
  @Output()
  outputCancel: EventEmitter<any> = new EventEmitter<any>();

  //#endregion

  //#region dx-radio-box
  priorities = [
    {
      Value: true,
      Name: "Có"
    },
    {
      Value: false,
      Name: "Không"
    }
  ]
  _radioGroupSelected = true;
  //#endregion

  //#region amis-datebox
  _isError = false;
  endDate: Date;
  _isSubmit;
  typeControl: TypeControl.Date;
  //#endregion
  @Output()
  submit: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.endDate = new Date();
  }

  //#region popup base
  /**
   * Xử lý đóng popup
   * 
   */
  cancel() {
  }

  closePopup() {
    this.visiblePopup = false;
    this.outputCancel.emit();
  }

  /**
   * bắt sk click button save
   */
  save() {

    console.log(this.endDate);
    if (!this.endDate && this._radioGroupSelected) {
      this._isError = true;
    } else {
      this._isError = false;
      this.submit.emit(this.endDate);
      this.closePopup();
    }

  }
  //#endregion

  //#region dx-radio
  onValueRadioChanged() {
    if (!this._radioGroupSelected) {
      this.endDate = null;
      this._isError = false;
    }


  }
  //#endregion

  //#region amis-datebox
  updateFieldData() {

  }
  valueChange(e) {
    this._isError = false;
  }
  afterChangedWihFieldAndValue(e) { }
  //#endregion

}

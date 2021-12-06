import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ErrorCode } from 'src/common/constant/error-code/error-code';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { BaseComponent } from 'src/common/components/base-component';

@Component({
  selector: 'amis-handle-group-configs-validation',
  templateUrl: './handle-group-configs-validation.component.html',
  styleUrls: ['./handle-group-configs-validation.component.scss']
})
export class HandleGroupConfigsValidationComponent extends BaseComponent implements OnInit {

  /**
   * Group config muốn xử lý hiển thị lỗi
   */
  _listGroupConfig: any;
  @Input() set listGroupConfig(value) {
    if (value) {
      this._listGroupConfig = value;
    }
  }

  /**
   * Danh sách validate info
   */
  @Input() set validateInfos(value) {
    if (value?.length) {
      this.handleValidateInfo(value);
    }
  }



  @Input() isConfirmNotify: boolean = true; // là popup confirm hay option Có/Không

  @Output() onError: EventEmitter<any> = new EventEmitter(); // phát sinh lỗi 

  @Output() clickNoEvent: EventEmitter<any> = new EventEmitter(); // bắn sự kiện click button không

  @Output() clickYesEvent: EventEmitter<any> = new EventEmitter(); // sự kiện click button có

  popupNotifyContent: string = ""; // nội dung popup cảnh báo lỗi
  visiblePopupNotify: boolean = false; // hiển thị popup cảnh báo lỗi

  isUnknowError: boolean = false;

  errorFields = []; // mảng các trường dữ liệu gặp lỗi
  warningFields = []; // mảng dữ liệu các trường cảnh báo

  constructor(private amisTranslateSV: AmisTranslationService) { super(); }

  ngOnInit(): void {
  }


  /**
   * Xử lý dữ liệu lỗi trả về
   * nmduy 19/06/2020
   */
  handleValidateInfo(validateInfo) {
    this.errorFields = [];
    this.warningFields = [];
    const errorValidate = validateInfo.filter(function (item) {
      if (item?.AdditionInfo?.hasOwnProperty("Warning") && !item.AdditionInfo.Warning) {
        return true;
      } else {
        return false;
      }
    }); // danh sách lỗi
    if (errorValidate?.length) {
      this.isUnknowError = false;
      this.errorFields = errorValidate;
      this.handleErrorField();
      return;
    } else {
      const warningValidate = validateInfo.filter(item => item.AdditionInfo?.Warning); // danh sách cảnh báo
      if (warningValidate?.length) {
        this.isUnknowError = false;
        this.warningFields = warningValidate;
        this.handleWarningField();
        return;
      }
    }
    this.showUnknowError(validateInfo);
  };

  /**
   * Hiển thị các loại lỗi khác
   * nmduy 16/07/2020
   */
  showUnknowError(validateInfo) {
    this.isUnknowError = true;
    this.visiblePopupNotify = true;
    this.popupNotifyContent = validateInfo[0]?.ErrorMessage;
  }



  /**
 * Xử lý thông báo dữ liệu lỗi
 * nmduy 19/06/2020
 */
  handleErrorField() {
    this._listGroupConfig.forEach(e => {
      if (e.ListGroupConfigChild?.length) {
        e.ListGroupConfigChild.forEach(element => {
          if (element.GroupFieldConfigs?.length) {
            element.GroupFieldConfigs.forEach(gf => {
              let item = this.errorFields.find(l => l.AdditionInfo?.FieldName == gf.FieldName);
              if (item) {
                gf.IsErrorCustom = true;
                gf.IsShowError = true;
                gf.ErrorMessage = item.ErrorMessage;
              }
            })
          }
        });
      } else {
        if (e.GroupFieldConfigs?.length) {
          e.GroupFieldConfigs.forEach(gf => {
            let item = this.errorFields.find(l => l.AdditionInfo?.FieldName == gf.FieldName);
            if (item) {
              gf.IsErrorCustom = true;
              gf.IsShowError = true;
              gf.ErrorMessage = item.ErrorMessage;
            }
          })
        }
      }
    });
    this.onError.emit();
  };



  /**
 * Xử lý lỗi dạng warning cảnh báo, xác nhận có/không
 * nmduy 19/06/2020
 */
  handleWarningField() {
    this.popupNotifyContent = "";
    this.warningFields.forEach(element => {
      this.popupNotifyContent += `<div class="mb-2">${element.ErrorMessage}</div>`;
    });
    this.visiblePopupNotify = true;
  }


  /**
 * Đóng popup cancel
 * @memberof AmisLayoutComponent
 * created by vhtruong - 15/06/2020
 */
  closePopupNotify() {
    this.visiblePopupNotify = false;
  }


  /**
   * Click không trên popup confirm
   * nmduy 22/06/2020
   */
  onClickNo() {
    this.clickNoEvent.emit();
    this.closePopupNotify();
  }


  /**
   * Click confirm có trên popup 
   * nmduy 22/06/2020
   */
  onClickYes() {
    this._listGroupConfig.forEach(e => {
      if (e.ListGroupConfigChild?.length) {
        e.ListGroupConfigChild.forEach(element => {
          if (element.GroupFieldConfigs?.length) {
            element.GroupFieldConfigs.forEach(gf => {
              let index = this.warningFields.findIndex(l => l.AdditionInfo?.FieldName == gf.FieldName);
              if (index != -1) {
                gf.PassWarningCode = [];
                gf.PassWarningCode.push(this.warningFields[index]?.Code);
              }
            })
          }
        });
      } else {
        if (e.GroupFieldConfigs?.length) {
          e.GroupFieldConfigs.forEach(gf => {
            let index = this.warningFields.findIndex(l => l.AdditionInfo?.FieldName == gf.FieldName);
            if (index != -1) {
              gf.PassWarningCode = [];
              gf.PassWarningCode.push(this.warningFields[index]?.Code);
            }
          })
        }
      }
    });
    this.clickYesEvent.emit(this._listGroupConfig);
    this.closePopupNotify();
  }
}

import { Injectable, Output, EventEmitter } from '@angular/core';
import { AmisTranslationService } from './amis-translation.service';
import { ToastModel } from '../models/base/toast';

@Injectable({
  providedIn: "root"
})

export class AmisTransferDataService {

  // timeout
  timeSet: any;

  // Object toast thông báo
  @Output()
  toastObject: EventEmitter<any> = new EventEmitter();

  // Sự kiện bắn ra khi chuẩn bị sửa một field
  @Output()
  beforeEditField: EventEmitter<any> = new EventEmitter();

  // Object loading
  @Output()
  loadingObject: EventEmitter<any> = new EventEmitter();

  // Object loading
  @Output()
  importData: EventEmitter<any> = new EventEmitter();

  // thay đổi user option
  @Output()
  userOptionChange: EventEmitter<any> = new EventEmitter();

  constructor(private amisTranslateSV: AmisTranslationService) {

  }

  //#region

  /**
   * Hiển thị toast thông báo lỗi
   * nmduy 17/03/2020
   * @param message
   */
  showErrorToast(message?: string) {
    if (!message)
      message = this.amisTranslateSV.getValueByKey("ERROR_HAPPENED");
    const toast = new ToastModel(message, "error");
    this.toastObject.emit(toast);
  }

  /**
   * Hiển thị toast thông báo thành công
   * nmduy 17/03/2020
   * @param message
   */
  showSuccessToast(message: string) {
    const toast = new ToastModel(message, "success");
    this.toastObject.emit(toast);
  }

  /**
   * Hiển thị toast cảnh báo
   * @param message
   */
  showWarningToast(message: string) {
    const toast = new ToastModel(message, "warning");
    this.toastObject.emit(toast);
  }

  //#endregion



  /**
   * Trước khi sửa một trường trong control
   * @param {any} obj 
   * @memberof AmisTransferDataService
   */
  beforeEditFieldValue(obj) {
    this.beforeEditField.emit(obj);
  }

  //#region Loading

  /**
   * Hiển thị loading
   * @param message
   */
  showLoading(message: string, positon = "") {
    this.loadingObject.emit({
      IsShow: true,
      Message: message,
      Position: positon
    })
    if (this.timeSet) {
      clearTimeout(this.timeSet);
    }
    this.timeSet = setTimeout(() => {
      this.hideLoading();
    }, 10000);
  }

  /**
   * Ẩn loading
   * @param message
   */
  hideLoading() {
    if (this.timeSet) {
      clearTimeout(this.timeSet);
    }
    this.loadingObject.emit({
      IsShow: false,
      Message: ""
    })
  }

  //#endregion

  //#region Trạng thái nhập khẩu

  /**
   * Trạng thái nhập khẩu
   * Created By PVTHONG 30/06/2020
   */
  StatusImport(data) {
    this.importData.emit(data);
  }

  //#endregion


  /**
   * bắn sự kiện khi thay đổi user option
   * nmduy 03/08/2020
   */
  onChangeUserOption(userOptions) {
    this.userOptionChange.emit(userOptions); 
  }
}

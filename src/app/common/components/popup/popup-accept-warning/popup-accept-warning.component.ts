import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { AmisTranslationService } from './../../../services/amis-translation.service';
import { ButtonType } from 'src/app/shared/enum/common/button-type.enum';
import { ButtonColor } from 'src/app/shared/enum/common/button-color.enum';

@Component({
  selector: 'popup-accept-warning',
  templateUrl: './popup-accept-warning.component.html',
  styleUrls: ['./popup-accept-warning.component.scss']
})
export class PopupAcceptWarningComponent implements OnInit {

  @Input() isVisible = false;

  // Object data nhận vào
  @Input() set appObject(data) {
    if (data) {
      this.itemData = data;
    }
  }
  buttonType = ButtonType;
  buttonColor = ButtonColor;
  @Output()
  closePopup: EventEmitter<any> = new EventEmitter();

  @Output()
  confirm: EventEmitter<any> = new EventEmitter();

  // data dữ liệu
  itemData: any = new Object();
  @Input()
  title = '';


  // text cảnh báo khi xóa
  @Input()
  textWarning = '';

  constructor() { }

  ngOnInit() {

  }
  /**
   * handler enter gọi hàm chấp nhận
   * @memberof PopupRemoveUserInAppComponent
   * created by vbcong - 17/02/2020
   */
  readyPopWarning(e){
    e.component.registerKeyHandler('enter', item => {
      this.confirmWarning();
    } );
  }

  /**
   * Đóng popup
   * @memberof PopupRemoveUserInAppComponent
   * created by vbcong - 17/02/2020
   */
  hidePopup() {
    this.closePopup.emit(true);
  }

  /**
   * Đống ý loại bỏ quyền của user trong ứng dụng
   * @memberof PopupRemoveUserInAppComponent
   * created by vbcong - 17/02/2020
   */
  confirmWarning() {
    this.confirm.emit(this.itemData);
  }

}

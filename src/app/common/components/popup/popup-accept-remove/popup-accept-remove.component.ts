import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { AmisTranslationService } from './../../../services/amis-translation.service';
import { ButtonType } from 'src/app/shared/enum/common/button-type.enum';
import { ButtonColor } from 'src/app/shared/enum/common/button-color.enum';

@Component({
  selector: 'popup-accept-remove',
  templateUrl: './popup-accept-remove.component.html',
  styleUrls: ['./popup-accept-remove.component.scss']
})
export class PopupRemoveUserInAppComponent implements OnInit {

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

  @Input() isShowError = false;

  // text cảnh báo khi xóa
  @Input()
  textRemove = '';

  constructor(
    private translateSV: AmisTranslationService
  ) { }

  ngOnInit() {

  }
  /**
   * handler enter gọi hàm xóa
   * @memberof PopupRemoveUserInAppComponent
   * created by vhtruong - 17/02/2020
   */
  readyPopDelete(e){
    e.component.registerKeyHandler('enter', item => {
      this.confirmRemove();
    } );
  }

  /**
   * Đóng popup
   * @memberof PopupRemoveUserInAppComponent
   * created by vhtruong - 17/02/2020
   */
  hidePopup() {
    this.closePopup.emit(true);
  }

  /**
   * Đống ý loại bỏ quyền của user trong ứng dụng
   * @memberof PopupRemoveUserInAppComponent
   * created by vhtruong - 17/02/2020
   */
  confirmRemove() {
    this.confirm.emit(this.itemData);
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from 'src/common/components/base-component';

@Component({
  selector: 'amis-popup-notify-validate-info',
  templateUrl: './popup-notify-validate-info.component.html',
  styleUrls: ['./popup-notify-validate-info.component.scss']
})
export class PopupNotifyValidateInfoComponent extends BaseComponent implements OnInit {


  //#region popup notify
  // nội dung xóa trong popup vị trí công việc
  isPopupWarning: boolean = false;
  @Input() isErrorAll;
  @Input() title;
  @Input() notifyFooterContent;
  //#endregion
  @Input() listError;
  @Input() columns;
  //trạng thái popup : ẩn hiện
  @Input() visiblePopupNotify;
  //nội dung chữ popup
  @Input() notifyHeaderContent;

  @Output() onConfirm = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  constructor() {
    super();
   }

  ngOnInit(): void {
  }

  onConfirmFunc(){
    this.onConfirm.emit();
  }
  cancel(){
    this.visiblePopupNotify = false;
    this.onCancel.emit();
  }

}

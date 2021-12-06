import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ButtonColor } from 'src/app/shared/enum/common/button-color.enum';

@Component({
  selector: 'amis-popup-delete',
  templateUrl: './amis-popup-delete.component.html',
  styleUrls: ['./amis-popup-delete.component.scss']
})
export class AmisPopupDeleteComponent implements OnInit {

  // Ản hiện Popup
  @Input() visiblePopup = false;

  // Title Popup
  @Input()
  title = "Xóa";

  // Loại Button
  buttonColor = ButtonColor;

  // Sụ kiện đóng
  @Output() eventHiddenPopup = new EventEmitter<boolean>();

  // Sự kiện xóa
  @Output() eventDelete = new EventEmitter<boolean>();

  // Nội dung confirm xóa
  @Input()
  content = "";

  constructor() { }

  ngOnInit() {
  }

  /**
   * Ẩn Popup
   * CREATED BY NMDUC - 25/04/2020
   * @memberof AmisPopupDeleteComponent
   */
  onHidden() {
    this.visiblePopup = false;
    this.eventHiddenPopup.emit(false);
  }


  /**
   * Hành động xóa
   * CREATED BY NMDUC - 25/04/2020
   * @memberof AmisPopupDeleteComponent
   */
  onClickDel() {
    this.visiblePopup = false;
    this.eventDelete.emit(false);
  }
}

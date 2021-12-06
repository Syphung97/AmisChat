import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/common/components/base-component';
import { DxTextAreaComponent } from 'devextreme-angular';


@Component({
  selector: 'amis-popup-expand-text-area',
  templateUrl: './popup-expand-text-area.component.html',
  styleUrls: ['./popup-expand-text-area.component.scss']
})
export class PopupExpandTextAreaComponent extends BaseComponent implements OnInit {


  @ViewChild("textArea") textArea: DxTextAreaComponent;

  _value: string = "";
  @Input() set value(value) {
    this._value = value;
  }

  @Input() visiblePopup: boolean = true; // biến hiển thị popup

  @Input() labelText: string = ""; // tên form

  @Output() closePopup: EventEmitter<any> = new EventEmitter();

  @Output() onSave: EventEmitter<any> = new EventEmitter();

  constructor() { super(); }

  ngOnInit(): void {
  }

  /**
   * Hiển thị popup
   * nmduy 24/07/2020
   */
  onShowPopup() {
    const input = this.textArea['element'].nativeElement?.querySelector('textarea');
    if (input) {
      input.focus();
    }
  }


  /**
   * click ấn lưu
   * nmduy 23/07/2020
   */
  save() {
    this.onClosePopup();
    this.onSave.emit(this._value);

  }

  /**
   * Cick đóng popup
   * nmduy 23/07/2020
   */
  onClosePopup() {
    this.visiblePopup = false;
    this.closePopup.emit();
  }

}

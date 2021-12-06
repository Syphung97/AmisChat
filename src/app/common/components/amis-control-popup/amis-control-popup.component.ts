import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonAnimation } from 'src/common/animation/common-animation';
import { KeyCode } from 'src/common/enum/key-code.enum';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';

@Component({
  selector: 'amis-amis-control-popup',
  templateUrl: './amis-control-popup.component.html',
  styleUrls: ['./amis-control-popup.component.scss']
})
export class AmisControlPopupComponent implements OnInit {

  @Output() beforeHideFormView: EventEmitter<any> = new EventEmitter();

  @Output() isVisibleChange: EventEmitter<any> = new EventEmitter();
  // Có hiển thị hay không
  @Input() set isVisible(data) {
    this.isDisplay = data;
  }
  positionId: any;
  @Input() set position(data) {
    if (data) {
      this.positionId = data;
      this.getPos(data);
      return;
    }
    this.positionLoad = {
      left: "0px",
      top: "0px",
      bottom: "0px",
      right: "0px",
    }
  }

  // object lấy position
  positionLoad = {
    left: "0px",
    top: "0px",
    bottom: "0px",
    right: "0px",
  }

  isDisplay: boolean = false;

  constructor(
    private transferDataSV: TransferDataService,
  ) { }

  ngOnInit() {
    this.transferDataSV.isBigSidebar.subscribe(res => {
      const interval = setInterval(() => {
        this.getPos(this.positionId);
      }, 0);
      setTimeout(() => {
        clearInterval(interval);
      }, 350);
    });
  }

  /**
   * Bắt sự kiện ấn Esc đóng
   * @param {KeyboardEvent} event
   * @memberof AmisFormViewComponent
   * created by vhtruong - 11/03/2020
   */
  @HostListener("document: keyup", ["$event"])
  public handleKeyUpEvent(event: KeyboardEvent): void {
    if (event.keyCode === KeyCode.Esc && !document.querySelector(".dx-overlay-wrapper")) {
      this.isVisibleChange.emit(false);
      this.beforeHideFormView.emit();
    }
  }

  getPos(data) {
    let ojb: any = {};
    const pos = document.querySelector(`#${data}`)?.getBoundingClientRect();
    if (pos) {
      ojb["left"] = `${pos.left}px`;
      ojb["top"] = `${pos.top}px`;
      ojb["right"] = `${pos.right - (pos.width + pos.left)}px`;
      ojb["bottom"] = `${pos.bottom - (pos.height + pos.top)}px`;
    }
    this.positionLoad = ojb;
  }

}

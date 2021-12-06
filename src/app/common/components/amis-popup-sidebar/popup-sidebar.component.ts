import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'amis-popup-sidebar',
  templateUrl: './popup-sidebar.component.html',
  styleUrls: ['./popup-sidebar.component.scss']
})
export class PopupSidebarComponent implements OnInit {

  // Có hiển thị hay không
  @Input() set isVisible(data) {
    setTimeout(() => {
      this.isDisplay = data;
    }, 50);
  }

  // Đóng form hiển thị
  @Output() hidden: EventEmitter<any> = new EventEmitter();

  // Biến hiển thị
  isDisplay: boolean = false;

  constructor() { }

  ngOnInit() {
  }


  /**
   * Bấm ESC đóng form view chi tiết
   * @param {KeyboardEvent} event
   * @memberof PopupSidebarComponent
   * created by vhtruong - 02/03/2020
   */
  @HostListener("document: keyup", ["$event"])
  public handleKeyUpEvent(event: KeyboardEvent): void {
    if (event.key === "Escape" && !document.querySelector(".dx-overlay-wrapper")) {
      this.hide();
    }
  }

  /**
   * Sự kiện đóng form
   * @memberof PopupSidebarComponent
   * created by vhtruong
   */
  hide() {
    this.isDisplay = false;
    setTimeout(() => {
      this.hidden.emit(this.isDisplay);
    }, 200);
  }

}

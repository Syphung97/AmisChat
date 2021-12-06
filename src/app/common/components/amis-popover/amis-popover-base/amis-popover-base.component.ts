import { Component, OnInit, Input, EventEmitter, ViewChild, Output } from "@angular/core";
import { DxPopoverComponent } from 'devextreme-angular';


@Component({
  selector: 'amis-amis-popover-base',
  templateUrl: './amis-popover-base.component.html',
  styleUrls: ['./amis-popover-base.component.scss']
})
export class AmisPopoverBaseComponent implements OnInit {

  // Biến kiểm tra ẩn hiện Popupover
  @Input()
  visiblePopover = false;

  // title
  @Input() title = "";

  // có scrollview hay k
  @Input() isHaveScrollView = true;

  // height
  @Input() maxHeightContent = "auto";

  // có footer k
  @Input() isHaveFooterBtn: boolean = true;

  @Input()
  width = "";

  @Input()
  height = "auto";

  @Input()
  minHeight: string;

  // Đối tượng tác động ( "#btnSave")
  @Input()
  target: string;

  // Vị trí "{my: 'left top ', at: 'left bottom', of: '#btnSave'}"
  @Input()
  position: any;

  @Input()
  positionMy: string;
  @Input()
  positionAt: string;
  @Input()
  positionOf: string;

  @Input()
  classPopover: string;

  // Hành động để hiển thị
  @Input()
  showEvent = "dxclick";

  // Event đóng Popover
  @Output()
  hidePopover: EventEmitter<any> = new EventEmitter<any>();

  // Event đang mở PopOver
  @Output()
  showingPopover: EventEmitter<any> = new EventEmitter<any>();

  /**
   * View child popover
   */
  @ViewChild("dxPopover", { static: false })
  dxPopover: DxPopoverComponent;

  constructor() { }

  ngOnInit() {
    if (this.positionAt && this.positionMy) {
      this.position = {
        at: this.positionAt,
        my: this.positionMy
      }
    }
  }

  /**
   * Sự kiện mở Popover
   * @param {any} e
   * @memberof AmisPopoverComponent
   * CREATED BY dtnam1 - 09/03/2020
   */
  onShowing(e) {
    if (this.positionOf) {
      const popover = e.component.instance();
      if (popover && popover.option()) {
        popover.option().position = {
          my: this.positionMy,
          at: this.positionAt,
          of: this.positionOf
        };
      }
    }
    this.showingPopover.emit(e);
  }

  /**
   * Sự kiện đóng popup
   * dtnam1 01/07/2020
   */
  closePopoverAction() {
    this.hidePopover.emit();
  }

  /**
   * Sự kiện đóng Popover
   * @param {any} e
   * @memberof AmisPopoverComponent
   * CREATED BY dtnam1 - 09/03/2020
   */
  onHidden(e) {
    this.hidePopover.emit(e);
  }
}


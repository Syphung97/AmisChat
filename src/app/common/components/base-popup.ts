import { BaseComponent } from "./base-component";
import { OnInit, AfterViewInit, ViewChild, ElementRef, Input, EventEmitter, Output } from "@angular/core";
import { debounceTime, takeUntil } from "rxjs/operators";
import { fromEvent } from "rxjs";
import { KeyCode } from "../enum/key-code.enum";
import { DxComponent } from "devextreme-angular";

/**
 * Base popup
 * Created by: PTĐạt 09-03-2020
 */
export class BasePopup extends BaseComponent implements OnInit, AfterViewInit {

  height = 600;
  width = 600;

  @ViewChild("focusItem", { static: false })
  focusItem: ElementRef;

  @ViewChild("enterTarget", { static: false })
  enterTarget: ElementRef;

  /**
   * ẩn hiện popup
   * nvcuong1
   * @memberof BasePopup
   */
  @Input()
  isVisible = false;

  /**
   * khi đã ẩn popup
   * nvcuong1
   * @memberof BasePopup
   */
  @Output() hidden = new EventEmitter<any>();

  /**
   * sau khi nhấn nút lưu
   * nvcuong1
   * @memberof BasePopup
   */
  @Output() afterSave = new EventEmitter<any>();

  constructor() {
    super();
    this.customizePoppupSize();

  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

  }

  /**
   * Sự kiện khi shown content
   * Created by: PTĐạt 27-12-2019
   */
  onShown(e) {
    const me = this;
    if (me.focusItem && me.focusItem instanceof DxComponent) {
      me.focusItem.instance.focus();
    } else {
      if (me.focusItem && me.focusItem["focus"]) {
        me.focusItem["focus"]();
      }
    }
    // Bắt sự kiện keyup
    fromEvent(window, "keyup").pipe(takeUntil(this._onDestroySub)).subscribe((e) => {
      const keyCode = event["keyCode"];
      if (Object.values(KeyCode).includes(keyCode)) {
        switch (keyCode) {
          case KeyCode.Esc:
            me.isVisible = false;
            break;
          case KeyCode.Enter:
            if (me.enterTarget) {
              if (e.target["nodeName"] === "TEXTAREA") {

                return;
              }
              if (me.enterTarget instanceof DxComponent) {
                me.enterTarget["element"].nativeElement.click();
              } else {
                me.enterTarget.nativeElement.click();

              }
            }
            break;
          default:
            break;
        }
      }
    });

    // Bắt sự kiện thay đổi kích thước màn hình
    fromEvent(window, "resize").pipe(debounceTime(300), takeUntil(this._onDestroySub)).subscribe((e) => {
      me.customizePoppupSize();
    });
  }

  /**
  * Sửa kích thước khi resize
  * Created by: PTĐạt 02-03-2020
  */
  customizePoppupSize() {
    const me = this;
    const height = window.innerHeight;
    me.height = height * 0.8;
    const width = window.innerWidth;
    me.width = width * 0.8;
  }

  /**
   * khi ẩn popup
   * nvcuong1
   * @param {any} [data=null]
   * @memberof BasePopup
   */
  popupHidden(data = null) {
    this.hidden.emit(data);
  }

  /**
   * sau khi bấm lưu
   * nvcuong1
   * @param {any} [data=null]
   * @memberof BasePopup
   */
  popupSave(data = null) {
    this.isVisible = false;
    this.afterSave.emit(data);
  }
}

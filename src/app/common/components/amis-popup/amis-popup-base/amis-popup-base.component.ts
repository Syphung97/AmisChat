import { Component, OnInit, Input, Output, EventEmitter, ContentChild, ElementRef, AfterContentInit, ChangeDetectorRef } from "@angular/core";
import { BaseComponent } from "../../base-component";
import { fromEvent, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AmisButtonComponent } from "../../amis-button/amis-button.component";

@Component({
  selector: "amis-popup-base",
  templateUrl: "./amis-popup-base.component.html",
  styleUrls: ["./amis-popup-base.component.scss"]
})
export class AmisPopupBaseComponent extends BaseComponent implements OnInit, AfterContentInit {

  @ContentChild("btnClose", {
    static: false
  }) btnClose: ElementRef;
  // title
  @Input() title = "";

  // height
  _height: any = "auto";
  _originHeight: any = "auto";
  @Input() set height(value) {
    if (value) {
      this._height = value;
      this._originHeight = value;
    }
  }

  // width
  _width: any = 450;
  _originWidth: any = 450;;
  @Input() set width(value) {
    if (value) {
      this._width = value;
      this._originWidth = value;
    }
  }

  @Input() zoomOutWidth: any; // chiều rộng khi zoomout
  @Input() zoomOutHeight: any; // chiều cao khi zoomout


  // height
  @Input() maxHeightContent = "auto";
  // height
  @Input() isHaveFooterBtn: boolean = true;
  // hiển thị popup
  @Input() visiblePopup;
  @Input() closeOnOutsideClick: boolean = false;
  @Input() resizeEnabled: boolean = false;
  @Input() dragEnabled: boolean = true;

  @Input()
  customClass: string;

  // có scrollview hay k
  @Input() isHaveScrollView = true;
  @Output() closePopup: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() shownPopup: EventEmitter<any> = new EventEmitter<any>();
  @Output() readyPopup: EventEmitter<any> = new EventEmitter<any>();
  @Output() onZoom: EventEmitter<any> = new EventEmitter<any>();

  position = {
    my: 'middle top',
    at: 'middle top',
    offset: '100'
  } // mặc định offset là 100

  popupPosition: any = this.position;

  @Input() set offsetY(value: any) {
    if (value) {
      this.popupPosition = {
        my: 'middle top',
        at: 'middle top',
        offset: value
      }
    }
  }

  _isResizePopup: boolean = false;
  // popup resize sẽ hiển thị ở giữa màn hình
  @Input() set isResizePopup(value) {
    if (value) {
      this._isResizePopup = true;
      this.popupPosition = {
        my: 'center',
        at: 'center',
        of: 'window'
      }
    }
  }

  _isHaveFooter = true;
  @Input() set isHaveFooter(data) {
    if(data != null && data != undefined) {
      this._isHaveFooter = data;
    }
  }
  isZoomOut: boolean = false;

  eventClose: Observable<any>;


  constructor() {
    super();
  }

  ngOnInit() {
  }

  ngAfterContentInit(): void {
    const me = this;
    if (me.btnClose) {
      this.eventClose =
        (me.btnClose instanceof AmisButtonComponent) ? this.btnClose["clickButton"] : fromEvent(this.btnClose.nativeElement, "click");
      this.eventClose.pipe(takeUntil(me._onDestroySub)).subscribe(() => {
        me.closePopupAction();
      });
    }
  }


  /**
   * Sự kiện đóng popup
   * nmduy 01/07/2020
   */
  closePopupAction() {
    const me = this;
    me.visiblePopup = false;
    me.closePopup.emit(me.visiblePopup);
  }

  /**
   * Sự kiện hiển thị popup
   * nmduy 01/07/2020
   */
  onShown(e) {
    this.shownPopup.emit(e);
  }
  /**
   * Sự kiện sắn sàng action popup
   * vbcong 01/07/2020
   */
  onReadyPopup(e) {
    this.readyPopup.emit(e);
  }

  /**
   * Click zoomout trên popup
   * nmduy 01/07/2020
   */
  zoomOut() {
    this._width = this.zoomOutWidth ? this.zoomOutWidth : '100%';
    this._height = this.zoomOutHeight ? this.zoomOutHeight : '100%';
    this.isZoomOut = true;
    this.onZoom.emit(this.isZoomOut);
  }


  /**
   * Click zoomin popup
   * nmduy 01/07/2020
   */
  zoomIn() {
    this._width = this._originWidth;
    this._height = this._originHeight;
    this.isZoomOut = false;
    this.onZoom.emit(this.isZoomOut);
  }
}

import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ContentChild, AfterContentInit } from "@angular/core";
import { fromEvent, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { BaseComponent } from "../../base-component";
import { AmisButtonComponent } from '../../amis-button/amis-button.component';

@Component({
  selector: "amis-popup-notify",
  templateUrl: "./amis-popup-notify.component.html",
  styleUrls: ["./amis-popup-notify.component.scss"],

})
export class AmisPopupNotifyComponent extends BaseComponent implements OnInit, AfterContentInit {

  @ContentChild("btnClose", {
    static: false
  })

  btnClose: ElementRef;

  constructor(
  ) {
    super();
  }

  // title
  @Input() title = "";
  // nội dung poup
  @Input() textContent = "";
  // height
  @Input() height = "auto";
  // width
  @Input() width = 450;
  // hiển thị popup
  @Input() visiblePopup = true;
  eventClose: Observable<any>;

  @Output() closePopup: EventEmitter<boolean> = new EventEmitter<boolean>();
  ngOnInit() {
  }

  position = {
    my: 'middle top',
    at: 'middle top',
    offset: '0 200'
  }

  popupPosition: any = this.position;


  @Input()
  get offsetY(): any {
    return this.offsetY;
  }

  set offsetY(value: any) {
    if (value) {
      this.popupPosition = {
        my: 'middle top',
        at: 'middle top',
        offset: value
      }
    }
  }

  /**
   * đóng popup
   * Createdby TDLam(2020-03-09)
   */
  // closePopup() {
  //   this.visiblePopup = false;
  //   this.visiblePopupChange.emit(this.visiblePopup);
  // }
  /**
   * đóng popup bắt event click btnClose
   */
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

  closePopupAction() {
    const me = this;
    me.visiblePopup = false;
    me.closePopup.emit(me.visiblePopup);
  }
}



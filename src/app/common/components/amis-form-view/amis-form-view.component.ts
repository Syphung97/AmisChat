import { Component, OnInit, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { KeyCode } from 'src/common/enum/key-code.enum';
import { CommonAnimation } from 'src/common/animation/common-animation';


@Component({
  selector: 'amis-form-view',
  templateUrl: './amis-form-view.component.html',
  styleUrls: ['./amis-form-view.component.scss'],
  animations: [CommonAnimation.slideToTop, CommonAnimation.showZoom],
})
export class AmisFormViewComponent implements OnInit {

  @Output() beforeHideFormView: EventEmitter<any> = new EventEmitter();

  @Output() isVisibleChange: EventEmitter<any> = new EventEmitter();
  // Có hiển thị hay không
  @Input() set isVisible(data) {
    this.isDisplay = data;
  }

  isDisplay: boolean = false;

  constructor() { }

  ngOnInit() {
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

}

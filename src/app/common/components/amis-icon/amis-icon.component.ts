import { Component, OnInit, Input } from '@angular/core';
import { BackgroundType } from 'src/app/shared/enum/common/background-type.enum';

@Component({
  selector: 'amis-icon',
  templateUrl: './amis-icon.component.html',
  styleUrls: ['./amis-icon.component.scss']
})
export class AmisIconComponent implements OnInit {

  backgroundType =  BackgroundType;
  isHovering = false;
  /**
   * nội dung tooltip label
   * created by vhtruong - 07/03/2020
   */
  _tooltipContent: string = "";
  @Input()
  set tooltipContent(val) {
    this._tooltipContent = val;
  }

  /**
   * nội dung tooltip label
   * created by vhtruong - 07/03/2020
   */
  _isShowTooltip: boolean = true;
  @Input()
  set isShowTooltip(val) {
    this._isShowTooltip = val;
  }

  /**
   * có trạng thái hover không
   * nmduy 08/09/2020
   */
  _isHoverState: boolean = true;
  @Input()
  set isHoverState(val) {
    this._isHoverState = val;
  }

  /**
   * có trạng thái pointer không
   * hgvinh 11/09/2020
   */
  _isCursorPointer: boolean = true;
  @Input()
  set isCursorPointer(val) {
    this._isCursorPointer = val;
  }

  /**
   * trạng thái active
   * nmduy 08/09/2020
   */
  _isActive: boolean = false;
  @Input()
  set isActive(val) {
    this._isActive = val;
  }

  /**
   * hover vào hiển thị background vuông
   * nmduy 10/09/2020
   */
  @Input() isSquareBG: boolean = false;

  /**
   * disable hay không
   * nmduy 10/09/2020
   */
  @Input() isDisable: boolean = false;

  /**
   * ẩn tooltip khi click hay không
   * hgvinh 11/09/2020
   */
  @Input() isCloseWithPopover: boolean = false;

  /**
   * loại background nào
   * hgvinh 17/09/2020
   */
  @Input() _backgroundType: BackgroundType = BackgroundType.White;

  /**
   * trạng thái active
   * nmduy 08/09/2020
   */
  @Input()
  set popoverStatus(val) {
    this._isShowTooltip = !val;
  }


  /**
   * class icon
   * nmduy 08/09/2020
   */
  @Input() classIcon: string = "";


  tooltipID: string = "id"; // id object hiển thị tooltip
  timeoutToottip; // đối tượng timeout
  visiblePopover: boolean = false; // ẩn hiện tooltip
  constructor() { }

  ngOnInit(): void {
    this.tooltipID = `icon-tooltip-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
  }

  showTooltip(){
    this.timeoutToottip = setTimeout(() => {
      this.isHovering = true;
    }, 500);
  }

  hideTooltip(){
    clearTimeout(this.timeoutToottip);
    this.isHovering = false;
  }

}

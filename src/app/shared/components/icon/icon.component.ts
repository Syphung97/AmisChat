import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'amis-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {

  isHovering = false;



  /**
   * có trạng thái hover không
   * nmduy 08/09/2020
   */
  // tslint:disable-next-line:variable-name
  _isHoverState = true;
  @Input()
  set isHoverState(val: boolean) {
    this._isHoverState = val;
  }

  /**
   * có trạng thái pointer không
   * hgvinh 11/09/2020
   */
  // tslint:disable-next-line:variable-name
  _isCursorPointer = true;
  @Input()
  set isCursorPointer(val: boolean) {
    this._isCursorPointer = val;
  }

  /**
   * trạng thái active
   * nmduy 08/09/2020
   */
  // tslint:disable-next-line:variable-name
  _isActive = false;
  @Input()
  set isActive(val: boolean) {
    this._isActive = val;
  }

  /**
   * hover vào hiển thị background vuông
   * nmduy 10/09/2020
   */
  @Input() isSquareBG = false;

  /**
   * disable hay không
   * nmduy 10/09/2020
   */
  @Input() isDisable = false;



  /**
   * class icon
   * nmduy 08/09/2020
   */
  @Input() classIcon = "";
  constructor() { }

  // tslint:disable-next-line:no-output-native
  @Output() clickAction = new EventEmitter();


  ngOnInit(): void {
  }


  clickIcon(): void {
    this.clickAction.emit();
  }
}

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from 'src/common/components/base-component';

@Component({
  selector: 'amis-empty-view',
  templateUrl: './empty-view.component.html',
  styleUrls: ['./empty-view.component.scss']
})
export class EmptyViewComponent extends BaseComponent implements OnInit {

  @Input() emptyStateIcon: string = "";
  @Input() emptyText: string = "";
  @Input() guideText: string = "";
  @Input() buttonName: string = "";
  @Input() iconButton = "icon-plus";
  @Input() isUseOuterMargin: boolean = false;
  @Input() topSpace: string = "";

  // permisstion code
  permissionCode = "";
  @Input() set viewPermissionCode(value) {
    this.permissionCode = value;
  };

  // subsystem code
  subSystemCode = "";
  @Input() set viewSubSystemCode(value) {
    this.subSystemCode = value;
  };

  // có check quyền click button không

  isIgnorePermission = false;
  @Input() set viewIsIgnorePermission(value) {
    this.isIgnorePermission = value;
  };


  @Output() onClickBtn: EventEmitter<any> = new EventEmitter<any>();

  constructor() { super(); }

  ngOnInit(): void {
  }

  /**
   * Sự kiện click button
   */
  onClickButton(e) {
    this.onClickBtn.emit(e);
  }
}

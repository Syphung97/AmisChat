import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from 'src/common/components/base-component';

@Component({
  selector: 'amis-popup-result-transfer-candidate',
  templateUrl: './popup-result-transfer-candidate.component.html',
  styleUrls: ['./popup-result-transfer-candidate.component.scss']
})
export class PopupResultTransferCandidateComponent extends BaseComponent implements OnInit {

  @Input()
  visiblePopup: boolean = false;

  @Input()
  title: string = "";

  @Input()
  displayExpr: string = "";

  @Output()
  closePopup: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  candidates = [];

  @Input()
  listSuccess = "5 ứng viên thêm mới thành công";

  @Input()
  listFail = "2 ứng viên thêm mới thất bại";

  offsetY = "0 100px"; // vị trí hiển thị popup


  columns = [
    {
      FieldName: 'EmployeeCode',
      Width: 100,
      IsVisible: true,
      DisplayField: 'Mã nhân viên',
      SortOrder: 1,
      IsView: true,
      Caption: 'Mã nhân viên'
    },
    {
      FieldName: 'FullName',
      Width: 150,
      IsVisible: true,
      DisplayField: 'Họ và tên',
      SortOrder: 2,
      IsView: true,
      Caption: 'Họ và tên'
    },
    {
      FieldName: 'ErrorMessage',
      Width: 200,
      IsVisible: true,
      DisplayField: 'Lý do',
      SortOrder: 3,
      IsView: true,
      Caption: 'Lý do',
    },
  ];

  @Input()
  dataSource = [];

  constructor() { super(); }

  ngOnInit(): void {
    this.dataSource.forEach(element => {
      element.ColorConfig = {};
      element.ColorConfig['ErrorMessage'] = 'delete-status';
    });
  }

  /**
   * đóng popup
   * nmduy 17/07/2020
   */
  onClosePopup() {
    this.visiblePopup = false;
    this.closePopup.emit();
  }
}

import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { ButtonType } from '../../enum/common/button-type.enum';
import { ButtonColor } from '../../enum/common/button-color.enum';
import { GroupConfigService } from 'src/app/services/group-config/group-config.service';
import { ConfigService } from 'src/app/services/config/config.serice';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/common/components/base-component';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { Employee } from '../../models/employee/employee';

@Component({
  selector: 'amis-popup-choose-group-config-print',
  templateUrl: './popup-choose-group-config-print.component.html',
  styleUrls: ['./popup-choose-group-config-print.component.scss']
})
export class PopupChooseGroupConfigPrintComponent extends BaseComponent implements OnInit {


  // Danh sách chọn các phân hệ để in
  listSelectedItems = [];

  // tiêu đề popup
  title = 'Chọn thông tin cần in';

  // Enum button
  buttonType = ButtonType;

  // Enum Color
  buttonColor = ButtonColor;

  // ouput đóng form popup
  @Output()
  cancelPopupChoose: EventEmitter<any> = new EventEmitter<any>();

  // Ẩn/ hiện popup
  @Input()
  visiblePopup = false;

  // In trên phân hệ nào
  @Input()
  layoutGridType = '';

  //id nhân viên được chọn
  @Input()
  employee: Employee;

  // Danh sách group config
  groupConfigs = [];

  // cờ check có dữ liệu để vẽ lên danh sách
  isLoading = false;

  textLoading = '';

  positionLoad = '';

  constructor(
    public groupConfigSV: GroupConfigService,
    private configsv: ConfigService,
    private amisTransferSV: AmisTransferDataService,
    private tranferDataSV: TransferDataService

  ) {
    super();
  }

  ngOnInit(): void {
    this.getLayoutGroup(this.layoutGridType);
  }

  /**
   * hàm lấy về layout group config
   * created by: hgvinh 30/07/2020
   */
  getLayoutGroup(layoutGridType) {
    const param: any = {};
    param.SubsystemCode = layoutGridType;
    param.LayoutConfigID = 1;

    this.configsv.getLayoutConfig(param)
      .pipe(takeUntil(this._onDestroySub))
      .subscribe(res => {
        if (res?.Success && res.Data) {
          this.isLoading = true;
          this.groupConfigs = res.Data.ListGroupConfig;

          this.groupConfigs.forEach(item => {
            item.Value = false;
          });

          //this.amisTransferSV.hideLoading();
        }
        else {
          this.amisTransferSV.showErrorToast();
        }
      }, err => {
        this.amisTransferSV.showErrorToast();
      });
  }

  /**
   * hàm chọn tất cả các config
   * created by: hgvinh 30/07/2020
   */
  chooseTotalEvent() {
    if (this.listSelectedItems?.length == this.groupConfigs?.length) {
      this.groupConfigs.forEach(item => {
        item.Value = false;
      });
      this.listSelectedItems = [];
    } else {
      this.groupConfigs.forEach(item => {
        item.Value = true;
      });
      this.listSelectedItems = this.groupConfigs.filter(gc => gc.Value === true).map(gc => gc.GroupConfigCode);
    }
  }

  /**
   * hàm thực hiện in và hiện preview
   * created by: hgvinh 30/07/2020
   */
  printAction() {
    if (this.employee) {
      let dataPrint = {
        "EmployeeID": this.employee.EmployeeID,
        "GroupConfigCode": this.listSelectedItems
      }
      this.tranferDataSV.onOpenPrintPreviewProfile(dataPrint);
    }
  }

  /**
   * Hàm hủy chọn option lưuu
   * created by: hgvinh 30/07/2020
   */
  cancel() {
    this.cancelPopupChoose.emit(false);
  }

  /**
   * hàm xử lí khi tích chọn một config được in
   * created by: hgvinh 30/07/2020
   */
  valueChanged(event, item?) {
    if (event.event && item) {
      item.Value = !item.Value;
      this.listSelectedItems = this.groupConfigs.filter(gc => gc.Value === true).map(gc => gc.GroupConfigCode);
    }
  }
}

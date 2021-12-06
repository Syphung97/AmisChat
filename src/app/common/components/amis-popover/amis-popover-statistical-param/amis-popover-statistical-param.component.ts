import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BaseComponent } from '../../base-component';
import { StatisticParamPopoverType, OverviewHRItem } from 'src/app/shared/enum/overview-item/overview-item.enum';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { StatisticStructureTypeData, StatisticTimeTypeData, StatisticDisplayTypeData } from 'src/app/shared/constant/dropdown-data/dropdown-data';
import { StatisticTimeType, StatisticDisplayType } from 'src/app/shared/enum/statistic-type/statistic-type.enum';

@Component({
  selector: 'amis-amis-popover-statistical-param',
  templateUrl: './amis-popover-statistical-param.component.html',
  styleUrls: ['./amis-popover-statistical-param.component.scss']
})
export class AmisPopoverStatisticalParamComponent extends BaseComponent implements OnInit {


  @Input() visiblePopover = false;
  @Input() target;
  @Input() title;
  @Input() labelWidth;
  @Input() currentView: OverviewHRItem; // view trên màn tổng quan

  _popoverType = StatisticParamPopoverType.TypeTwo;
  @Input() set popoverType(value) {
    if (value) {
      this._popoverType = value;
    }
  }
  get popoverType() {
    return this._popoverType;
  }

  @Output() onSave: EventEmitter<any> = new EventEmitter();

  @Output() onCancel: EventEmitter<any> = new EventEmitter();

  popoverTypeItem = StatisticParamPopoverType;

  // các giá trị mặc định
  dataBind = {
    OrganizationUnitID: this.currentUserInfo?.OrganizationUnitID,
    OrganizationUnitName: this.currentUserInfo?.OrganizationUnitName,
    InActive: false,
    StatisticType: 1,
    StatisticValue: new Date().getFullYear().toString(),
    DisplayType: 1,
    DisplayValue: 8
  }

  tooltipContent = "";

  cloneDataBind; // mảng dữ liệu gốc

  //#region option
  statisticTypeOption = StatisticTimeTypeData;
  displayTypeOption = StatisticDisplayTypeData;
  //#endregion

  //#endregion

  constructor(
    private amisTransferSV: AmisTransferDataService,
    private amisTranslateSV: AmisTranslationService
  ) { super(); }

  ngOnInit(): void {
    this.getUserOptions();
    this.getDataBinding();
    this.tooltipContent = this.amisTranslateSV.getValueByKey("OVERVIEW_REPORT_PARAM_POPOVER_TOOLTIP");
    this.displayTypeOption.forEach(element => {
      element.DisplayTypeName = this.amisTranslateSV.getValueByKey(element.DisplayTypeName);
    });
  }

  /**
   * Lấy dữ liệu bind lên các control 
   * nmduy 19/08/2020
   */
  getDataBinding() {
    if (this.currentView == OverviewHRItem.EmployeeStructure) {
      this.statisticTypeOption = AmisCommonUtils.cloneDataArray(StatisticStructureTypeData)
    }
    this.statisticTypeOption.forEach(element => {
      element.StatisticTypeName = this.amisTranslateSV.getValueByKey(element.StatisticTypeName);
    });
    this.cloneDataBind = AmisCommonUtils.cloneData(this.dataBind);
  }


  /**
   * Lấy tham số đầu vào 
   * nmduy 17/08/2020
   */
  getUserOptions() {
    if (this._popoverType == this.popoverTypeItem.TypeTwo) {
      this.dataBind.StatisticValue = new Date().toISOString(); // nếu là kiểu 2 thì mặc định là ngày hôm nay
    }
    const paramOptions = this.currentUserInfo.UserOptions?.OverviewHRSetting;
    if (paramOptions?.length) {
      const viewOptions = paramOptions.find(item => item.Key == this.currentView);
      if (viewOptions?.OrganizationUnitID) {
        this.dataBind.OrganizationUnitID = viewOptions.OrganizationUnitID;
        this.dataBind.OrganizationUnitName = viewOptions.OrganizationUnitName;
        this.dataBind.InActive = viewOptions.InActive ? true : false;
        this.dataBind.StatisticType = viewOptions.StatisticType;
        this.dataBind.StatisticValue = viewOptions.StatisticValue;
        this.dataBind.DisplayType = viewOptions.DisplayType;
        this.dataBind.DisplayValue = viewOptions.DisplayValue;
      }
    }
  }

  /**
   * Đóng popover
   * nmduy 20/08/2020
   */
  cancelPopover() {
    this.onCancel.emit();
  }

  /**
   * Click nhấn lưu trên popover
   * nmduy 17/08/2020
   */
  savePopover() {
    this.checkValidValue();
    this.onSave.emit(this.dataBind);
    this.onCancel.emit();
  }

  /**
   * Lấy lại giá trị cũ khi người dùng để trống
   * nmduy 18/08/2020
   */
  checkValidValue() {
    for (let prop in this.dataBind) {
      if (prop != "InActive") {
        if (!this.dataBind[prop]) {
          this.dataBind[prop] = this.cloneDataBind[prop];
          if (prop == "StatisticValue") { // nếu bỏ trống loại thống kê
            this.getDefaultValue();
          }
        }
      }
    }
    if (this._popoverType == StatisticParamPopoverType.TypeTwo) {
      if (this.dataBind.DisplayType == StatisticDisplayType.MaxAmount) {
        this.dataBind.DisplayValue = this.dataBind.DisplayValue < 1 ? 1 : this.dataBind.DisplayValue;
        this.dataBind.DisplayValue = this.dataBind.DisplayValue > 15 ? 15 : this.dataBind.DisplayValue;
      }
      if (this.dataBind.DisplayType == StatisticDisplayType.MinPercent) {
        this.dataBind.DisplayValue = this.dataBind.DisplayValue < 1 ? 1 : this.dataBind.DisplayValue;
        this.dataBind.DisplayValue = this.dataBind.DisplayValue > 100 ? 100 : this.dataBind.DisplayValue;
      }
    }
  }

  /**
   * Chọn báo cáo theo 
   * nmduy 17/08/2020
   */
  getDefaultValue() {
    if (this._popoverType == StatisticParamPopoverType.TypeOne) {
      if (this.dataBind.StatisticType == StatisticTimeType.Year) {
        this.dataBind.StatisticValue = "3"; // mặc định lấy 3 năm
      } else {
        this.dataBind.StatisticValue = new Date().getFullYear().toString(); // mặc định lấy năm nay
      }
    } else if (this._popoverType == StatisticParamPopoverType.TypeTwo) {
      this.dataBind.StatisticValue = new Date().toString(); // mặc định lấy hôm nay
    }
  }
}

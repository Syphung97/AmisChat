import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ButtonColor } from 'src/app/shared/enum/common/button-color.enum';
import { Period } from 'src/common/enum/period.enum';
import { BaseComponent } from '../base-component';
import { AmisDateRangeComponent } from '../amis-date-range/amis-date-range.component';
import { SelectOrganizationUnitComponent } from 'src/app/shared/components/select-organization-unit/select-organization-unit.component';
import { UserOptionService } from 'src/app/services/user-option/user-option.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { TypeControlSidebar } from 'src/app/shared/enum/report/type-control-sidebar';
import { ReportType } from 'src/app/shared/enum/report/report-type.enum';
import { StatisticDisplayTypeData } from 'src/app/shared/constant/dropdown-data/dropdown-data';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';


@Component({
  selector: 'amis-amis-sidebar-report',
  templateUrl: './amis-sidebar-report.component.html',
  styleUrls: ['./amis-sidebar-report.component.scss']
})
export class AmisSidebarReportComponent extends BaseComponent implements OnInit {

  // Màu button
  buttonColor = ButtonColor;

  // Loại control tham số báo cáo
  typeControlSidebar = TypeControlSidebar

  // Mở rộng thu hẹp sidebar
  isExpand = true;

  _isError = false;

  // Danh sách control tham số
  @Input()
  listControl = [];

  // Dữ liệu tham số mặc định
  @Input()
  defaultParam: any = {};

  // Danh sách kỳ báo cáo
  @Input()
  statisticTypeOption = [];

  // kỳ báo cáo hiện tại
  @Input() set inputReportParam(data) {
    if (data) {
      this.reportParam = data;
      if (data.Organization) {
        this.dataBind.OrganizationUnitID = data.Organization.OrganizationUnitID;
        this.dataBind.OrganizationUnitName = data.Organization.OrganizationUnitName;
        this.dataBind.InActive = data.Organization.InActive;

        this.dataBind.DisplayType = data.DisplayType ? data.DisplayType : 1;
      }
      this.quantityShowChart = data.QuantityShowChart ? data.QuantityShowChart : 8;
      this.currentPeriodReport = data.Period;
    }
  }
  // Tham số truyền sang form danh sách để gọi service lấy dữ liệu báo cáo
  reportParam: any;

  //Kỳ báo cáo
  currentPeriodReport: any;

  // Dữ liệu lần đầu bind vào combo cơ cấu tổ chức
    dataBind = {
    OrganizationUnitID: this.currentUserInfo?.OrganizationUnitID,
    OrganizationUnitName: this.currentUserInfo?.OrganizationUnitName,
    InActive: false,
    DisplayType: 1,
    DisplayValue: 8
  }

  //loại báo cáo
  @Input() typeReport: any;

  @Input() subSystemCode: any;

  //#endregion

  // Sự kiện bắn param sang form danh sách lấy dữ liệu
  @Output()
  submitReportParam: EventEmitter<any> = new EventEmitter<any>();

  // control daterange
  @ViewChild('dateRange')
  dateRange: AmisDateRangeComponent;

  // control cctc
  @ViewChild('organizationUnit')
  organizationUnit: SelectOrganizationUnitComponent;

  // default kỳ báo cáo
  defaultCurrentPeriod = Period.ThisMonth;

  defaultOrg = {};

  // số lượng ngầm định show biểu đồ
  quantityShowChart: number = 8;

  maxValue = 15;

  isDisable = false;

  tooltipContent = `Chương trình sẽ thống kê lên biểu đồ những giá trị nằm trong giới hạn đã thiết lập, còn lại những giá trị chiếm tỷ trọng nhỏ sẽ được gom chung vào nhóm "Khác".`;

  displayTypeOption = StatisticDisplayTypeData;

  constructor(
    private userOptionSV: UserOptionService,
    private amisTranslateSV: AmisTranslationService,
    private transferSV: TransferDataService
  ) {
    super();
  }


  ngOnInit(): void {
    this.displayTypeOption.forEach(element => {
      element.DisplayTypeName = this.amisTranslateSV.getValueByKey(element.DisplayTypeName);
    });
    if (!!this.currentPeriodReport) {
      this.defaultCurrentPeriod = this.currentPeriodReport;
    }
    if (this.dataBind) {
      this.defaultOrg = AmisCommonUtils.cloneData(this.dataBind);
    }
  }

  /**
   * Lấy mặc định tham số báo cáo
   * Created by: dthieu 20-08-2020
   */
  defaultParamReport() {

    // kỳ báo cáo ngầm định
    if (this.defaultParam && this.defaultParam?.DefaultPeriod) {
      this.dateRange.currentPeriodReport = this.defaultParam?.DefaultPeriod;
      this.dateRange.getDefaultFromSidebarReport(this.defaultParam?.DefaultPeriod);
    }

    // cctc mặc định
    if (this.defaultParam && this.defaultParam?.OrganizationUnitID && this.defaultParam?.OrganizationUnitName) {
      this.dataBind = AmisCommonUtils.cloneData(this.defaultParam);
    }

    // số lượng hiển thị trên biều đồ
    if (this.defaultParam && this.defaultParam?.DefaultQuantityShowChart) {
      this.quantityShowChart = this.defaultParam?.DefaultQuantityShowChart;
    }

    // kiểu dữ liệu ngầm định hiển thị trên biều đồ
    if (this.defaultParam && this.defaultParam?.DefaultDisplayType) {
      this.dataBind.DisplayType = this.defaultParam?.DefaultDisplayType;
    }

    this._isError = false;
    this.isDisable = true;
  }

  /**
   * Xử lý áp dụng tham số báo cáo
   * Created by: dthieu 19-08-2020
   * Edited by: pvthong 19/8/2020 lưu cấu trúc tên tệp
   */
  applyParamReport() {

    switch (this.subSystemCode) {
      case ReportType.EmployeeTermination:
      case ReportType.EmployeeBirthday:
        if (!(this.dateRange?.value?.Period != null && this.dateRange?.value?.FromDate &&
          this.dateRange?.value?.ToDate && this.organizationUnit.OrganizationUnit?.OrganizationUnitID)) {
          this.isDisable = false;
          return;
        } else {
          this.isDisable = true;
        }

        if (this.subSystemCode == ReportType.EmployeeTermination && !this.quantityShowChart) {
          this.isDisable = false;
          return;
        } else {
          this.isDisable = true;
        }
        break;

      case ReportType.EmployeeWithoutContract:

        break;
      default:
        break;
    }


    const paramReport: any = {};
    paramReport.FromDate = this.dateRange?.value?.FromDate;
    paramReport.ToDate = this.dateRange?.value?.ToDate;
    paramReport.Period = this.dateRange?.value?.Period;
    paramReport.Organization = {};
    const org: any = {};
    org.OrganizationUnitID = this.dataBind?.OrganizationUnitID;
    org.OrganizationUnitName = this.dataBind?.OrganizationUnitName;
    org.InActive = this.dataBind?.InActive;
    // paramReport.OrganizationUnitID = this.organizationUnit.OrganizationUnit?.OrganizationUnitID;
    // paramReport.OrganizationUnitName = this.organizationUnit.OrganizationUnit?.OrganizationUnitName;
    // paramReport.InActive = this.organizationUnit.OrganizationUnit?.InActive;
    paramReport.Organization = org;
    paramReport.DisplayType = this.dataBind.DisplayType;
    paramReport.QuantityShowChart = this.quantityShowChart;

    paramReport.SubSystemCode = this.subSystemCode;



    //lưu cấu trúc tên tệp
    let param = {
      Report: this.currentUserInfo?.UserOptions?.Report?.length ? this.currentUserInfo?.UserOptions?.Report : []
    }
    let item = param.Report?.find(x => x.Key == this.typeReport);
    let objValue = {
      Period: AmisCommonUtils.cloneData(this.dateRange?.value?.Period),
      FromDate: AmisCommonUtils.cloneData(this.dateRange?.value?.FromDate),
      ToDate: AmisCommonUtils.cloneData(this.dateRange?.value?.ToDate),
      OrganizationUnitID: AmisCommonUtils.cloneData(this.organizationUnit.OrganizationUnit?.OrganizationUnitID),
      OrganizationUnitName: AmisCommonUtils.cloneData(this.organizationUnit.OrganizationUnit?.OrganizationUnitName),
      InActive: AmisCommonUtils.cloneData(this.organizationUnit.OrganizationUnit?.InActive),
      QuantityShowChart: this.quantityShowChart,
      DisplayType: this.dataBind.DisplayType
    }
    if (item) {
      let groupBy = [];
      if (item.Value?.GroupGridBy?.length) {
        groupBy = item.Value?.GroupGridBy;
      }
      item.Value = AmisCommonUtils.cloneData(objValue);
      item.Value.GroupGridBy = groupBy;

    }
    else {
      let objData = {
        Key: this.typeReport,
        Value: objValue
      }
      param.Report.push(objData);
    }
    this.userOptionSV.saveUserOption(param).subscribe(res => {
      if (res?.Success) {
        // 
      }
    });

    this.submitReportParam.emit(paramReport);
    this.isDisable = false;
  }

  /**
   * Xử lý mở/đóng sidebar
   * Created by: dthieu 17-08-2020
   */
  collapseSidebar() {
    this.isExpand = !this.isExpand;
    this.transferSV.onRepaintGrid(10);
  }

  onChangeOrganizationUnit(e) {
    this.isDisable = true;
  }

  /**
   * Sửa đổi giá trị trên biểu đồ
   * Created by: dthieu 21-08-2020
   */
  changeQuantity(e) {
    if (!e) {
      this._isError = true;
      this.isDisable = false;
    } else {
      this._isError = false;
      this.isDisable = true;
    }
  }

  /**
   * Event bắn từ daterange sang
   * Created by: dthieu 21-08-2020
   */
  applyButton(e) {
    this.isDisable = e;
  }

  changerValueSelect(item) {
    this.dataBind.DisplayType = item?.itemData?.DisplayTypeID;
    if (this.dataBind.DisplayType == 2) {
      this.maxValue = 100;
      this.quantityShowChart = 10;
    } else {
      this.maxValue = 15;
      this.quantityShowChart = 8;
    }
    this.isDisable = true;
  }

}

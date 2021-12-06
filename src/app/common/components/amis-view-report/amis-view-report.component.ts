import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base-component';
import { Period } from 'src/common/enum/period.enum';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';

@Component({
  selector: 'amis-amis-view-report',
  templateUrl: './amis-view-report.component.html',
  styleUrls: ['./amis-view-report.component.scss']
})
export class AmisViewReportComponent extends BaseComponent implements OnInit {

  // Tiêu đề báo cáo
  @Input()
  titleReport = "";

  // Danh sách các field không thực hiện gom nhóm

  @Input()
  notGroupFields = [];

  // kỳ báo cáo hiện tại
  @Input() set inputReportParam(data) {
    if (data) {
      this.reportParam = data;
    }
  }

  //loại báo cáo
  @Input() typeReport: any;

  // danh sách Kỳ báo cáo truyền vào 
  @Input()
  statisticTypeOption = [
    { PeriodID: Period.ThisMonth, PeriodName: this.translateSV.getValueByKey('PERIOD_THIS_MONTH') },
    { PeriodID: Period.M1, PeriodName: this.translateSV.getValueByKey('PERIOD_M1') },
    { PeriodID: Period.M2, PeriodName: this.translateSV.getValueByKey('PERIOD_M2') },
    { PeriodID: Period.M3, PeriodName: this.translateSV.getValueByKey('PERIOD_M3') },
    { PeriodID: Period.M4, PeriodName: this.translateSV.getValueByKey('PERIOD_M4') },
    { PeriodID: Period.M5, PeriodName: this.translateSV.getValueByKey('PERIOD_M5') },
    { PeriodID: Period.M6, PeriodName: this.translateSV.getValueByKey('PERIOD_M6') },
    { PeriodID: Period.M7, PeriodName: this.translateSV.getValueByKey('PERIOD_M7') },
    { PeriodID: Period.M8, PeriodName: this.translateSV.getValueByKey('PERIOD_M8') },
    { PeriodID: Period.M9, PeriodName: this.translateSV.getValueByKey('PERIOD_M9') },
    { PeriodID: Period.M10, PeriodName: this.translateSV.getValueByKey('PERIOD_M10') },
    { PeriodID: Period.M11, PeriodName: this.translateSV.getValueByKey('PERIOD_M11') },
    { PeriodID: Period.M12, PeriodName: this.translateSV.getValueByKey('PERIOD_M12') },
    { PeriodID: Period.ThisWeek, PeriodName: this.translateSV.getValueByKey('PERIOD_THIS_WEEK') },
    { PeriodID: Period.ThisQuarter, PeriodName: this.translateSV.getValueByKey('PERIOD_THIS_QUARTER') },
    { PeriodID: Period.ToDay, PeriodName: this.translateSV.getValueByKey('PERIOD_TODAY') },
    { PeriodID: Period.Custom, PeriodName: this.translateSV.getValueByKey('PERIOD_CUSTOM') },
  ];

  // Danh sách control tham số truyền vào sidebar: dateRange - kỳ báo cáo, org- cơ cấu tổ chức...
  @Input()
  listControl = [];

  // Url gọi Api lấy dữ liệu báo cáo trong ReportController. VD: getEmployeeTermination
  @Input()
  apiUrl = "";

  // Mã phân hệ VD: EmployeeTermination
  @Input()
  subSystemCode = "";

  // Loại biểu đồ truyền vào
  @Input()
  typeChart = "";

  // Có show biều đồ không
  @Input()
  isShowChart = "";

  // Tham số truyền sang form danh sách để gọi service lấy dữ liệu báo cáo
  reportParam: any;

  //action toolbar
  toolbarAction: any;

  // tham số ngầm định
  @Input()
  defaultParam = {};

  constructor(
    private translateSV: AmisTranslationService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  /**
   * Xử lý quay lại
   * Created by: dthieu 17-08-2020
   */
  back() {

  }

  /**
   * Xử lý ẩn biểu đồ
   * Created by: dthieu 17-08-2020
   */
  onHideChart() { }

  /**
   * Áp dụng tham số để lấy dữ liệu báo cáo
   * Created by: dthieu 20-08-2020
   */
  submitReportParam(data) {
    this.reportParam = data;
  }

  showHideAction: boolean;
  processShowHideChart(e) {
    this.showHideAction = e;
  }

  hasCustomColumn = false;

  /**
   * Thay đổi tùy chỉnh cột trên toolbar
   * Created by: dthieu 26-08-2020
   */
  renderGridAgain(e){
    this.hasCustomColumn = AmisCommonUtils.cloneData(e);
  }

}

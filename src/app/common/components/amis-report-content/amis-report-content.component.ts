import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BaseComponent } from '../base-component';
import { GroupConfigService } from 'src/app/services/group-config/group-config.service';
import { takeUntil } from 'rxjs/operators';
import { ReportService } from 'src/app/services/report/report.service';
import { PagingRequest } from 'src/app/shared/models/grid-field-config/paging-request';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { ContextMenu } from 'src/app/shared/enum/context-menu/context-menu.enum';
import { FileTypeEnum } from 'src/common/models/export/file-type.enum';
import { ExportData } from 'src/common/models/export/export-data';
import { ColumnHeaderConfig } from 'src/common/models/export/column-header-config';
import { TypeControl } from 'src/app/shared/enum/common/type-control.enum';
import { DataType } from 'src/common/models/export/data-type.enum';
import { AlignmentType } from 'src/common/models/export/alignment-type.enum';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { ExportService } from 'src/app/services/export-employee/export-employee.service';
import { DownloadService } from 'src/app/services/base/download.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisDateUtils } from 'src/common/fn/date-utils';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { AmisPagingGridComponent } from '../amis-grid/amis-paging-grid/amis-paging-grid.component';
import { ExportChartParam } from 'src/common/models/export/export-chart-param';
import { group } from '@angular/animations';
import { NotifyProcessType } from 'src/app/shared/enum/import-process/import-process.enum';
import { ReportType } from 'src/app/shared/enum/report/report-type.enum';

@Component({
  selector: 'amis-amis-report-content',
  templateUrl: './amis-report-content.component.html',
  styleUrls: ['./amis-report-content.component.scss']
})
export class AmisReportContentComponent extends BaseComponent implements OnInit {

  @Input()
  isShowChart = false;

  @Input()
  typeChart = 1;

  @Input()
  controller = "";

  @Input()
  apiUrl = "";

  @Input()
  subSystemCode = "";

  @Input()
  typeReport: string;

  @Input()
  set showHideAction(value) {
    if (value != undefined) {
      this.isShowChart = value;
    }
    if (this.isZoom == false && !value) {
      this.isZoom = true;
      this.onZoomFn(false);
    }
  }

  @ViewChild('grid')
  grid: AmisPagingGridComponent;

  // _showHideAction: boolean;

  palette = "Soft Pastel";

  isReRenderChart; // vẽ lại biểu đồ

  isExpand; // có đang ở trong trạng thái mở rộng hay không

  heightChart = 240; // chiều cao biểu đồ

  originHeightChart; // kích thước gốc của biểu đồ

  listDataForPieChart = [

  ];

  isShowStatus: boolean = true;

  _paramFromSidebar = {
    FromDate: null,
    ToDate: null,
    OrganizationUnitID: "",
    GroupGridBy: []
  };
  @Input() set paramFromSidebar(data) {
    this._paramFromSidebar = data;
    this._paramFromSidebar.OrganizationUnitID = data?.Organization?.OrganizationUnitID;
    switch (data.SubSystemCode) {
      case ReportType.EmployeeWithoutContract:
        if (this._paramFromSidebar?.OrganizationUnitID) {
          this.getDataReportPaging();
        }
        break;
      case ReportType.EmployeeBirthday:
      case ReportType.EmployeeTermination:
        if (this._paramFromSidebar?.FromDate && this._paramFromSidebar?.ToDate && this._paramFromSidebar?.OrganizationUnitID) {
          this.getDataReportPaging();
        }
        break;
      default:
        break;
    }

  }

  @Input() set renderGridWhenCustomColum(data) {
    if (data.Success) {
      this.hasCustomColumn = true;
      this.groupFromToolbar = data?.GroupBy;
      this.isDefault = data?.IsDefault;
      this.getColumnConfig();
    }
  }
  groupFromToolbar = [];
  hasCustomColumn = false;
  isDefault = false;

  columns = [];

  dataSource = [];

  isLoading = false;
  isFirstLoaded = false;

  layoutGridDefault = [];

  totalRecord = 0;

  //ản hiển xuất khẩu nâng cao
  visibleExportPopup = false;
  //danh sách xuất khẩu
  listDataExport;
  //cột config
  listInfoConfig = [];
  //danh sách cột dc chọn
  listSelectedConfig = [];

  isZoom = true;

  //icon thông báo
  iconNotify = "";

  constructor(
    private groupConfigService: GroupConfigService,
    private reportSV: ReportService,
    private amisTransferSV: AmisTransferDataService,
    private exportSV: ExportService,
    private downloadService: DownloadService,
    private amisTranslationSV: AmisTranslationService,
    private transferData: TransferDataService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getDataThisMonth();
    this.getColumnConfig();

    this.originHeightChart = this.heightChart;

    this.transferData.toolbarExecuteActionReport.pipe(takeUntil(this._onDestroySub)).subscribe(data => {
      this.toobarExecuteAction(data);
    });
  }

  /**
   * Lấy dữ liệu ngầm định tháng hiện tại
   * Created by: dthieu 19-08-2020
   */
  getDataThisMonth() {
    if (this._paramFromSidebar?.FromDate && this._paramFromSidebar?.ToDate && this._paramFromSidebar?.OrganizationUnitID) {
      return;
    }
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    this._paramFromSidebar.FromDate = new Date(currentYear, currentMonth, 1);
    this._paramFromSidebar.ToDate = new Date(currentYear, currentMonth, this.getTotalDays(currentYear, currentMonth));
    this._paramFromSidebar.OrganizationUnitID = this.currentUserInfo.OrganizationUnitID;
  }

  /**
   * Hàm lấy về tổng số ngày của tháng
   * Create by: dthieu:02.05.2020
   */
  getTotalDays(year: number, month: number) {
    switch (month) {
      case 1:
        if (year % 400 === 0 || (year % 4 == 0 && year % 100 !== 0)) {
          return 29;
        } else {
          return 28;
        }
      case 0:
      case 2:
      case 4:
      case 6:
      case 7:
      case 9:
      case 11:
        return 31;
      default:
        return 30;
    }
  }

  /**
    * Lấy config cột trên grid
    * dthieu 12/07/2020
    */
  getColumnConfig() {

    if (this.subSystemCode) {
      this.groupConfigService.getGridColumsConfig(this.subSystemCode).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
        if (res?.Success && res.Data) {
          this.layoutGridDefault = res.Data;
          this.columns = res.Data?.GridFieldConfigs;

          if (this._paramFromSidebar?.GroupGridBy?.length || this.groupFromToolbar?.length) {
            // this.grid.changedListRowMergeGroup(this._paramFromSidebar?.GroupGridBy);
            this.columns.forEach(k => {
              if (k.FieldName == this.groupFromToolbar[0]) {
                k.GroupIndex = "0";
              } else {
                k.GroupIndex = -1;
              }
            });
          }

          if (!this.hasCustomColumn) {
            this.getDataReportPaging();
          } else {
            if (!this.isDefault) {
              this.transferData.onChangedGroupGridField(this.groupFromToolbar);
            }
          }
        }
      });
    }
  }
  groupFieldName = "";
  /**
   * Lấy dữ liệu báo cáo
   * Created by: dthieu 19-08-2020
   */
  getDataReportPaging() {
    this.isLoading = true;
    let param = this._paramFromSidebar;
    if (this.apiUrl) {
      this.reportSV.getDataReport(this.apiUrl, param).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
        if (res && res.Success && res.Data) {
          this.dataSource = res.Data?.PageData;
          this.listDataForPieChart = res.Data?.CustomData;
          this.isReRenderChart = AmisCommonUtils.cloneData({ IsRender: true });
          this.totalRecord = this.dataSource.length;
          this.isLoading = false;

          if (this._paramFromSidebar?.GroupGridBy?.length) {
            // this.grid.changedListRowMergeGroup(this._paramFromSidebar?.GroupGridBy);
            this.columns.forEach(k => {
              if (k.FieldName == this._paramFromSidebar?.GroupGridBy[0]) {
                k.GroupIndex = "0";
              } else {
                k.GroupIndex = -1;
              }
            });
            this.groupFieldName = this._paramFromSidebar?.GroupGridBy[0];
          }
          this.isFirstLoaded = true;
        }
        else if (res?.ValidateInfo?.length) {
          this.isLoading = false;
          this.amisTransferSV.showErrorToast();
        }
        else {
          this.isLoading = false;
          this.amisTransferSV.showErrorToast();
        }
      }, err => {
        this.isLoading = false;
        this.amisTransferSV.showErrorToast();
      });
    }

  }

  /**
  * xử lý action trên toolbar
  * Created by: pvthong 20-08-2020
  */
  toobarExecuteAction(key) {
    switch (key) {
      case ContextMenu.ExportExcel:
        this.iconNotify = "icon-excel-big";
        this.showLoading();
        this.exportAction(FileTypeEnum.Excel);
        break;
      case ContextMenu.ExportPDF:
        this.iconNotify = "icon-pdf-big";
        this.showLoading();
        this.exportAction(FileTypeEnum.Pdf);
        break;
      case ContextMenu.AdvanceExport:
        this.advancedExportAction(key);
        break;
      case ContextMenu.RefreshData:
        this.getDataReportPaging();
        break;
    }
  }

  /**
   * Xuất khẩu file
   * pvthong 20/08/2020
   */
  exportAction(fileType: FileTypeEnum) {
    let param: any = {};
    let paramVisibleExport = {
      isVisibleStatus: false
    }
    // Nếu có biểu đồ
    if (this.isShowChart) {
      param = this.buildObjectExportChart(fileType, this.columns.filter(item => item.IsVisible), this.isShowChart);

      this.exportSV.exportChart(param).subscribe(res => {
        if (res && res.Success && res.Data) {
          this.amisTransferSV.StatusImport(paramVisibleExport);
          window.open(this.downloadService.downloadFile(res.Data), "_blank");
        }
        else {
          this.amisTransferSV.StatusImport(paramVisibleExport);
          this.amisTransferSV.showErrorToast();
        }
      }, err => {
        this.amisTransferSV.StatusImport(paramVisibleExport);
        this.amisTransferSV.showErrorToast();
      });
    } else {
      param = this.buildParamExport(fileType, this.columns.filter(item => item.IsVisible), false);

      this.exportSV.exportListEmployee(param).subscribe(res => {
        if (res && res.Success && res.Data) {
          this.amisTransferSV.StatusImport(paramVisibleExport);
          window.open(this.downloadService.downloadFile(res.Data), "_blank");
        }
        else {
          this.amisTransferSV.StatusImport(paramVisibleExport);
          this.amisTransferSV.showErrorToast();
        }
      }, err => {
        this.amisTransferSV.StatusImport(paramVisibleExport);
        this.amisTransferSV.showErrorToast();
      });
    }


  }

  /**
   * Xuất khẩu biểu đồ
   * Created by: dthieu 27-08-2020
   */
  buildObjectExportChart(fileTypeExport: FileTypeEnum, columns, showChart) {
    let param: ExportChartParam = new ExportChartParam();
    let exportDatas = [];
    let exportData: ExportData = this.buildParamExport(fileTypeExport, columns, true);
    exportData.Data = this.dataSource;
    exportDatas.push(exportData);

    param.ExportDatas = exportDatas;
    param.ChartType = 0;

    let totalChart = 0;
    for (let index = 0; index < this.listDataForPieChart.length; index++) {
      const element = this.listDataForPieChart[index];
      totalChart += element.Quantity;
    }

    param.Data = this.listDataForPieChart.map(u => {
      return {
        Text: u.Text,
        Count: u.Quantity,
        Percent: (u.Quantity / totalChart) * 100,
        TotalCount: this.totalRecord,
        MultiData: []
      };
    });
    param.ExportType = fileTypeExport;
    param.Title = this.amisTranslationSV.getValueByKey('REPORT_TITLE_NAME', { ReportName: this.amisTranslationSV.getValueByKey("HRM_REPORT_" + this.typeReport.toUpperCase()) });
    param.SheetName = this.amisTranslationSV.getValueByKey('REPORT_SHEET_NAME_CHART');;
    if (this._paramFromSidebar.FromDate && this._paramFromSidebar.ToDate) {
      param.SubTitle = [this.currentUserInfo?.OrganizationUnitName + " - " + this.amisTranslationSV.getValueByKey('REPORT_DATE_RANGE', { FromDate: AmisDateUtils.formatDate(this._paramFromSidebar.FromDate), ToDate: AmisDateUtils.formatDate(this._paramFromSidebar.ToDate) })];
    }

    param.TitleColumnData = this.amisTranslationSV.getValueByKey('HRM_TITLE_REPORT_SUBTITLE_CHART_CONTENT');
    param.TitleColumnText = this.amisTranslationSV.getValueByKey('NUMBER');
    param.TitleColumnPercent = this.amisTranslationSV.getValueByKey('HRM_TITLE_REPORT_SUBTITLE_CHART_QUANTITY');
    param.ShowColumnPercent = true;
    param.IsShowSummary = true;
    return param;
  }
  /**
   * Hàm xây dựng param để xuất khẩu
   * pvthong 20/08/2020
   */
  buildParamExport(fileTypeExport: FileTypeEnum, columns, isShowChart) {
    let param: ExportData = new ExportData();
    let headerColumnList: ColumnHeaderConfig[] = [];

    const visibleColumns = columns.filter(c => c.IsVisible);

    visibleColumns.forEach(element => {
      switch (element.TypeControl) {
        case TypeControl.Number:
          headerColumnList.push(new ColumnHeaderConfig(element.Caption, element.FieldName, DataType.NumberType, AlignmentType.Right))
          break;
        case TypeControl.Currency:
          headerColumnList.push(new ColumnHeaderConfig(element.Caption, element.FieldName, DataType.CurrencyType, AlignmentType.Right))
          break;
        case TypeControl.Percent:
          headerColumnList.push(new ColumnHeaderConfig(element.Caption, element.FieldName, DataType.NumberType, AlignmentType.Right))
          break;
        case TypeControl.Date:
          headerColumnList.push(new ColumnHeaderConfig(element.Caption, element.FieldName, DataType.DateType, AlignmentType.Right))
          break;
        case TypeControl.DateTime:
          headerColumnList.push(new ColumnHeaderConfig(element.Caption, element.FieldName, DataType.DateTimeType, AlignmentType.Right))
          break;
        case TypeControl.Checkbox:
          headerColumnList.push(new ColumnHeaderConfig(element.Caption, element.FieldName, DataType.CheckBoxType, AlignmentType.Center))
          break;
        default:
          headerColumnList.push(new ColumnHeaderConfig(element.Caption, element.FieldName, DataType.DefaultType, AlignmentType.Left))
          break;
      }
      headerColumnList[headerColumnList.length - 1].Width = 1500;
    });

    const currentDate: Date = new Date();
    param.Title = this.amisTranslationSV.getValueByKey("REPORT_TITLE_NAME", { ReportName: this.amisTranslationSV.getValueByKey("HRM_REPORT_" + this.typeReport.toUpperCase()) });
    if (this._paramFromSidebar.FromDate && this._paramFromSidebar.ToDate) {
      param.Subtitle = this.currentUserInfo?.OrganizationUnitName + " - " + this.amisTranslationSV.getValueByKey("REPORT_DATE_RANGE", { FromDate: AmisDateUtils.formatDate(this._paramFromSidebar.FromDate), ToDate: AmisDateUtils.formatDate(this._paramFromSidebar.ToDate) });
    }
    param.ExportFileType = fileTypeExport;
    param.HeaderColumns = headerColumnList;
    param.FileName = this.amisTranslationSV.getValueByKey("REPORT_FILE_NAME_EXPORT", { FileName: this.amisTranslationSV.getValueByKey("HRM_REPORT_" + this.typeReport.toUpperCase()) });
    if (!isShowChart) {
      param.APIPath = `Report/${this.apiUrl}`;
      param.Param = this._paramFromSidebar;
    }
    param.IsAutoFitColumn = true;
    param.SheetName = this.amisTranslationSV.getValueByKey('REPORT_SHEET_NAME_EMPLOYEES');
    param.GroupConfigs = this.getFieldNameGroupGrid();
    return param;
  }

  /**
   * Lấy cột gom nhóm để xuát khẩu
   * Created by: dthieu 26-08-2020
   */
  getFieldNameGroupGrid() {
    let param = {
      Report: this.currentUserInfo?.UserOptions?.Report?.length ? this.currentUserInfo?.UserOptions?.Report : []
    }
    let item = param.Report?.find(x => x.Key == this.typeReport);

    let groupParam = [];
    let fieldNameGroup = item?.Value?.GroupGridBy;

    if (fieldNameGroup?.length) {
      groupParam = this.columns.filter(i => i.FieldName == fieldNameGroup[0]).map(k => {
        return {
          FieldName: k.FieldName,
          DisplayField: k.FieldName,
          Caption: k.Caption,
          // GroupDirection: "ASC",
          // IsShowSummary:true
          IsShowTotalCount: true
        }
      });
    } else {
      groupParam = null;
    }

    return groupParam;
  }

  /**
  * Hàm xử lý tích chọn vào xuất khẩu nâng cao
  * Created by pvthong 20/08/2020
  */
  advancedExportAction(e) {
    this.listDataExport = this.dataSource;
    this.visibleExportPopup = true;
    this.listInfoConfig = AmisCommonUtils.cloneDataArray(this.columns);
    this.listSelectedConfig = this.columns.filter(item => item.IsVisible);
  }

  /**
    * Hàm xử lý đóng popup
    * Created by pvthong 20/08/2020
    */
  closePopup() {
    this.visibleExportPopup = false;
  }

  /**
  * Hàm xử lý xuất khẩu nâng cao
  * Created by pvthong 20/08/2020
  */
  handleAdvancedExport(e) {
    let param;
    let paramVisibleExport = {
      isVisibleStatus: false
    }
    if (e && e.selectData && e.selectData.length > 0) {
      if (e.isExcel) {
        this.iconNotify = "icon-excel-big";
        param = this.buildParamExport(FileTypeEnum.Excel, e.selectData, false);
      } else {
        this.iconNotify = "icon-pdf-big";
        param = this.buildParamExport(FileTypeEnum.Pdf, e.selectData, false);
      }
      this.showLoading();
      this.exportSV.exportListEmployee(param).subscribe(res => {
        if (res?.Success && res?.Data) {
          this.amisTransferSV.StatusImport(paramVisibleExport);
          window.open(this.downloadService.downloadFile(res.Data), "_blank");
        } else {
          let param = {
            isVisibleStatus: false
          }
          this.amisTransferSV.StatusImport(paramVisibleExport);
          this.amisTransferSV.showErrorToast();
        }
      });
    } else {
      this.amisTransferSV.StatusImport(paramVisibleExport);
      this.amisTransferSV.showErrorToast();
    }
  }

  /**
   * Xử lý refresh dữ liệu báo cáo
   * Created by: dthieu 21-08-2020
   */
  refreshData(e) {

  }

  /**
   * Thay đổi phóng to thu nhỏ của component
   * dthieu 21/08/2020
   */
  onZoomFn(e) {
    if (e) {
      this.isExpand = AmisCommonUtils.cloneData({ IsExpand: true });
      this.isZoom = false;
      this.heightChart = this.getPos();
    } else {
      this.isExpand = AmisCommonUtils.cloneData({ IsExpand: false });
      this.heightChart = this.originHeightChart;
      this.isZoom = true;
    }
    this.isReRenderChart = AmisCommonUtils.cloneData({ IsRender: true });
  }

  /**
  * Lấy position hiển thị
  * @param {any} data 
  * @memberof AmisLoadingComponent
  */
  getPos() {
    const target = document.querySelector(`.wrapper-content`);
    const pos = target?.getBoundingClientRect();
    const width = target?.clientWidth;
    const height = target?.clientHeight;
    if (pos) {
      this.heightChart = height - 32;
    }
    return this.heightChart;
  }

  /**
     * hàm hiện loading khi xuất khẩu
     * pvthong 04/09/2020
     */
  showLoading() {
    let param = {
      typeNotify: NotifyProcessType.EXPORT,
      title: "Trạng thái xuất khẩu ",
      contentNotify: "Đang thực hiện xuất khẩu báo cáo. Vui lòng chờ trong giây lát",
      iconNotify: this.iconNotify,
      isDisplayFileName: false
    }
    this.amisTransferSV.StatusImport(param);
  }
}



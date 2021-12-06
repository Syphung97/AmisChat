import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ButtonColor } from 'src/app/shared/enum/common/button-color.enum';
import { ButtonType } from 'src/app/shared/enum/common/button-type.enum';
import { ContextMenu } from 'src/app/shared/enum/context-menu/context-menu.enum';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { Router } from '@angular/router';
import { FileTypeEnum } from 'src/common/models/export/file-type.enum';
import { ReportService } from 'src/app/services/report/report.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { GroupConfigService } from 'src/app/services/group-config/group-config.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../base-component';
import { UserOptionService } from 'src/app/services/user-option/user-option.service';
import { LayoutConfigGridService } from 'src/app/services/layout-grid-config/layout-grid-config.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { SubSystemCode } from 'src/app/shared/constant/sub-system-code/sub-system-code';
import { PermissionCode } from 'src/app/shared/constant/permission-code/permission-code';

@Component({
  selector: 'amis-amis-toolbar-report', 
  templateUrl: './amis-toolbar-report.component.html',
  styleUrls: ['./amis-toolbar-report.component.scss']
})
export class AmisToolbarReportComponent extends BaseComponent implements OnInit {

  @Input()
  titleReport = "";

  @Input()
  subSystemCode = "";

  @Input()
  subSystemCodeReport = SubSystemCode.ReportEmployee;

  buttonColor = ButtonColor;

  buttonType = ButtonType;

  contextMenuItem = ContextMenu;

  isShowCustomColumn = true;

  contextMenuListRight = [
    {
      Key: ContextMenu.CustomColumn,
      Text: this.translateSV.getValueByKey('REPORT_CONTEXT_MENU_CUSTOM_COLUMN'),
      Class: '',
      Icon: 'icon-colunm-option'
    },

    {
      Key: ContextMenu.Export,
      Text: this.translateSV.getValueByKey('CONTEXT_MENU_EXPORT'),
      Icon: 'icon-export',
      Class: '',
      Submenu: [
        {
          Key: ContextMenu.ExportExcel,
          Text: this.translateSV.getValueByKey('CONTEXT_MENU_EPORT_EXCEL'),
          Icon: 'icon-export-excel',
          Class: '',
          SubSystemCode: this.subSystemCodeReport,
          PermissionCode: PermissionCode.Export
        },
        {
          Key: ContextMenu.ExportPDF,
          Text: this.translateSV.getValueByKey('CONTEXT_MENU_EPORT_PDF'),
          Icon: 'icon-export-pdf',
          Class: '',
          SubSystemCode: this.subSystemCodeReport,
          PermissionCode: PermissionCode.Export
        },
        {
          Key: ContextMenu.AdvanceExport,
          Text: this.translateSV.getValueByKey(
            'CONTEXT_MENU_EPORT_ADVANCED_EXPORT'
          ),
          Icon: 'icon-advance-export',
          Class: '',
          SubSystemCode: this.subSystemCodeReport,
          PermissionCode: PermissionCode.Export
        }
      ]
    }
  ];

  listReport = [];

  selectedColumns = [];

  showChart = true;

  _groupFields = [

  ];

  @Input()
  notGroupFields = [];

  itemDefaultOfGroupField = {
    ID: 0,
    Caption: "Không chọn"
  }

  groupDefaultID = 0;

  @Input()
  isShowChart = true;

  @Output()
  processShowHideChart: EventEmitter<any> = new EventEmitter<any>();

  // Vẽ lại grid khi thay đổi tùy chỉnh cột
  @Output()
  renderGridAgain: EventEmitter<any> = new EventEmitter<any>();

  listMergeRow = [];

  listFieldMergeRow = [];

  isCustomed = false;

  gridConfig: any = {};

  //loại báo cáo
  @Input() typeReport: any;

  isShowReload: boolean = false

  constructor(
    private translateSV: AmisTranslationService,
    private amisTransferDataSV: AmisTransferDataService,
    private route: Router,
    private reportSV: ReportService,
    private transferData: TransferDataService,
    private groupConfigService: GroupConfigService,
    private userOptionSV: UserOptionService,
    private layoutGridSV: LayoutConfigGridService,
  ) {
    super();
  }


  ngOnInit(): void {
    this.getListReport();
    this.getColumnConfig(false);
    this._groupFields = [];
    this._groupFields.push(this.itemDefaultOfGroupField);

  }

  getColumnConfig(isDefault) {
    this._groupFields = [];
    this._groupFields.push(this.itemDefaultOfGroupField);

    if (this.subSystemCode) {
      this.groupConfigService.getGridColumsConfig(this.subSystemCode, isDefault).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
        if (res?.Success && res.Data) {
          this.gridConfig = res.Data;
          this.listFieldMergeRow = res.Data?.GridFieldConfigs;
          this.selectedColumns = this.listFieldMergeRow.filter(i => i.IsVisible);

          let group = [];
          group = this.listFieldMergeRow.filter(item => this.notGroupFields.filter(k => k.FieldName == item.FieldName).length == 0).map(k => {
            return {
              ID: k.GridFieldConfigID,
              Caption: k.Caption,
              FieldName: k.FieldName
            }
          });
          this._groupFields.push(...group);

          // trường hợp chỉnh sửa bình thường tùy chỉnh cột
          if (!isDefault) {
            let param = {
              Report: this.currentUserInfo?.UserOptions?.Report?.length ? this.currentUserInfo?.UserOptions?.Report : []
            }
            let item = param.Report?.find(x => x.Key == this.typeReport);

            if (item?.Value?.GroupGridBy?.length) {
              const groupBy = group.find(i => i.FieldName == item?.Value?.GroupGridBy?.first());
              if (groupBy) {
                this.groupDefaultID = groupBy.ID;
                let itemGroup = this._groupFields.find(e => e.ID === this.groupDefaultID);
                if(itemGroup){
                  this.groupGridByFieldName(itemGroup.FieldName);
                }
              }
            }
          } else {
            // tường hợp get mặc định
            this.customColumns = res.Data?.GridFieldConfigs;
          }


        }
      });
    }
  }


  /**
   * Xử lý quay lại
   * Created by: dthieu 17-08-2020
   */
  back() {
    this.route.navigate([`report/list`]);
  }

  /**
   * Xử lý ẩn biểu đồ
   * Created by: dthieu 17-08-2020
   */
  onHideChart() {
    this.showChart = !this.showChart;
    this.processShowHideChart.emit(this.showChart);
  }

  isActive = false;
  /**
   * Xử lý mở danh sách bảo cáo để lựa chọn
   * Created by: dthieu 17-08-2020
   */
  chooseReport(item) {
    if (item) {
      item.IsActive = true;
      const customConfig = item.CustomConfig;
      if (customConfig) {
        const objConfig = AmisCommonUtils.Decode(customConfig);
        const linkReport = objConfig ? objConfig.ReportLink : '';
        if (!!linkReport) {
          this.route.navigate([`report/${linkReport}`], {
            state: {
              SubSystemCode: "Report",
              ListReport: this.listReport
            }
          });
        }
      }
    }
  }

  /**
   * Lấy danh sách
   * Created by: dthieu 20-08-2020
   */
  getListReport() {
    if (history.state.SubSystemCode === "Report" && history.state.ListReport){
      this.handleListReport(history.state.ListReport);
      return;
    }
    this.reportSV.getAllReport().subscribe(res => {
      if (res?.Success && res.Data) {
        this.handleListReport(res.Data);
      }
    });
  }

  /**
   * xử lý ds báo cáo
   * dtnam1 25/9/2020
   * @param listReport 
   */
  handleListReport(listReport){
    this.listReport = listReport;
    this.listReport.forEach(item => {
      item.IsActive = false;
    });

    const existData = this.listReport.find(it => it.ReportTitle == this.titleReport);

    if (existData) {
      existData.IsActive = true;
    }
  }

  /**
  * xử lý action trên toolbar
  * Created by: dthieu 09-06-2020
  */
  toobarExecuteAction(key) {
    if (key == ContextMenu.CustomColumn) {
      this.isShowCustomColumn = false;
    } else {
      this.transferData.toolbarActionReport(key);
    }
  }
  // hàm test của công
  groupGridByFieldName(fieldName) {
    if (fieldName == undefined) {
      this.listMergeRow = [];
    } else {
      this.listMergeRow = [fieldName];
    }

  }

  /**
   * Xử lý click show chức năng từ nút 3 chấm
   * Created by: dthieu 24-08-2020
   */
  toggle(e) {
    if (e) {
      this.isShowCustomColumn = true;
    }
  }

  /**
   * Chọn tiêu đề cột
   * Created by: dthieu 24-08-2020
   */
  valueChanged(e) {
    let fieldName = e?.itemData?.FieldName;
    this.groupGridByFieldName(fieldName);
    this.isCustomed = true;
  }

  /**
   * Đóng popup tùy chỉnh cột
   * Created by: dthieu 25-08-2020
   */
  closeCustomColumn(e) {
    this.isShowCustomColumn = true;
  }

  listColumnsGridDefault = [];

  customColumns = [];

  /**
   * Sự kiện bắn ra khi checkbox trên tùy chỉnh cột
   * Created by: dthieu 25-08-2020
   */
  customSettingColumn(data) {
    // if (this.listColumnsGridDefault && this.listColumnsGridDefault.length === 0) {
    //   this.listColumnsGridDefault = this.grid.columns;
    // }
    this.customColumns = data;
    const checkedColumns = this.customColumns.filter(i => i.IsVisible);
    if (checkedColumns.length >= 1) {
      this.isCustomed = true;
    } else {
      this.isCustomed = false;
    }
  }

  defaultCustom = false;
  setDefaultSettingColumn(e) {
    this.groupDefaultID = 0; // reset giá trị combo tùy chỉnh cột
    this.listMergeRow = []; // reset giá trị combo tùy chỉnh cột
    this.isCustomed = true;
    this.defaultCustom = true;
    this.getColumnConfig(true);
  }

  /**
   * Lưu tùy chỉnh cột
   * Created by: dthieu 26-08-2020
   */
  saveOptionColumn() {
    // Lưu thông tin thiết lập gom nhóm theo useroption
    const paramReport: any = {};
    paramReport.GroupGridBy = this.listMergeRow;

    //lưu cấu trúc tên tệp
    let param = {
      Report: this.currentUserInfo?.UserOptions?.Report?.length ? this.currentUserInfo?.UserOptions?.Report : []
    }
    let item = param.Report?.find(x => x.Key == this.typeReport);
    let objValue = {
      GroupGridBy: this.listMergeRow
    }
    if (item) {
      if (item.Value) {
        item.Value.GroupGridBy = this.listMergeRow
      }
    } else {
      let objData = {
        Key: this.typeReport,
        Value: objValue
      }
      param.Report.push(objData);
    }
    this.userOptionSV.saveUserOption(param).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
      if (res?.Success) {
        // bắn service cho paging show button mở rộng hoặc thu gọn
        this.transferData.changeGroupByField(objValue.GroupGridBy);
      }
    });

    if (this.customColumns?.length) {
      this.gridConfig.GridFieldConfigs = this.customColumns;

      this.layoutGridSV.saveLayoutGridConfig(this.gridConfig).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
        if (res && res.Success && res.Data) {
          this.amisTransferDataSV.showSuccessToast(this.translateSV.getValueByKey("SAVE_SUCCESS_CONFIG_COLUMN"));
          this.listFieldMergeRow = this.customColumns;
          this.selectedColumns = this.listFieldMergeRow.filter(i => i.IsVisible);
          this.renderGridAgain.emit(
            {
              Success: true,
              GroupBy: this.listMergeRow,
              IsDefault: this.defaultCustom
            }
          );
        } else {
          this.amisTransferDataSV.showErrorToast();
        }
      });
    } else {
      this.transferData.onChangedGroupGridField(this.listMergeRow);
    }

    this.isShowCustomColumn = true;
    this.isCustomed = false;
  }

  /**
   * Ẩn/Hiện button Reload khi di chuột vào/ra header
   * Created by: CVCuong
   */
  showRefresh(){
    this.isShowReload = true
  }
  hideRefresh(){
    this.isShowReload = false
  }
}

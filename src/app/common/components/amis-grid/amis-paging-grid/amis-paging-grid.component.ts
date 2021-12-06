import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewContainerRef, OnChanges, SimpleChanges, HostListener, ElementRef } from '@angular/core';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { GridColumn } from 'src/common/models/common/grid-columns';
import { ButtonType } from 'src/app/shared/enum/common/button-type.enum';
import { ButtonColor } from 'src/app/shared/enum/common/button-color.enum';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { DataType } from 'src/common/models/export/data-type.enum';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../base-component';
import { GroupConfigService } from 'src/app/services/group-config/group-config.service';
import { AmisListDragDropComponent } from '../../amis-list-drag-drop/amis-list-drag-drop.component';
import { TypeControl } from 'src/app/shared/enum/common/type-control.enum';
import * as _ from "lodash";
import { DownloadService } from 'src/app/services/base/download.service';
import { UploadTypeEnum } from 'src/app/shared/enum/uploadType/upload-type.enum';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { SortParam } from 'src/common/models/sort-param';
import { AvatarService } from 'src/app/services/user/avatar.service';
import { Router } from '@angular/router';
import { KeyCode } from 'src/common/enum/key-code.enum';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { JobStatusEnum } from 'src/common/enum/job-status.enum';
import { UserStatus } from 'src/app/shared/enum/users/user-status.enum';
import { ContextMenu } from 'src/app/shared/enum/context-menu/context-menu.enum';
import { HRMPermissionUtils } from 'src/app/shared/function/permission-utils';
import { SelfServiceStatus } from 'src/app/shared/enum/self-service-status/self-service-status.enum';
import { LayoutConfigGridService } from 'src/app/services/layout-grid-config/layout-grid-config.service';
import { LayoutGridConfig } from 'src/app/shared/models/layout-grid-config/layout-grid-config';

// import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'amis-paging-grid',
  templateUrl: './amis-paging-grid.component.html',
  styleUrls: ['./amis-paging-grid.component.scss']
})
export class AmisPagingGridComponent extends BaseComponent implements OnInit, OnChanges {
  @Input()
  set subSystemCode(value) {
    this.subsystemCode = value;
  }

  @Input()
  isCheckFinished = false;

  @Input()
  isCheckRejected = false;

  // Subsustem code để thực hiện finish
  @Input()
  subSystemCodeFinish: string = "";

  // permission code để thực hiện finish
  @Input()
  permissionCodeFinish: string = "";

  jobStatus = JobStatusEnum;

  selfServiceStatus = SelfServiceStatus;

  constructor(
    private transferDataSV: TransferDataService,
    public groupConfigSV: GroupConfigService,
    private downloadSV: DownloadService,
    private translateSV: AmisTranslationService,
    private amisTransferSV: AmisTransferDataService,
    private avatarSV: AvatarService,
    private router: Router,
    public amisDataSV: AmisDataService,
    private elementRef: ElementRef,
    private layoutGridSV: LayoutConfigGridService,
  ) {
    super();
    this.customizeText = this.customizeText.bind(this);
  }

  // Danh sách các cột trong grid
  columnGrids: GridColumn[] = [];

  @Input()
  columnAutoWidth = true;

  // Enum loại Button
  buttonType = ButtonType;

  isShowDrop = false;

  buttonColor = ButtonColor;

  dataType = DataType;

  typeControl = TypeControl;

  isCustomed = false;

  // Từ khóa tìm kiếm cột
  keyword = '';

  // bản ghi được chọn để hành xử context menu
  selectedRowItem: any;

  // đánh dấu bản ghi được chọn có phải là system không
  isSystem = false;

  // cờ check ẩn hiện button
  isVisible = false;

  isClearSelect = false; // có

  // danh sách cột mặc định
  @Input() defaultColumn = '';

  // danh sách cột mặc định
  @Input() gridHeight: any;

  // Cờ có để dạng link trường fullname hay không
  @Input()
  isShowLink = true;

  // SL bản ghi của 1 page
  @Input()
  pageSize = 50;

  // có cho phép thao tác với kiểu file trên grid k
  @Input()
  isActionWithFile: boolean = true;

  @Input()
  numberFix = 0;
  // SL bản ghi của 1 page
  @Input()
  isPageSizeEditable: boolean = true;

  // SL bản ghi của 1 page
  _dataSource: any;

  //dtnam1 thêm
  //sau khi data trong grid thay đổi
  @Output()
  afterDataChanged: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  set dataSource(data) {
    this.generateAvatarForTypeControlUser(data);
    // this._dataSource = data;
    //dtnam1 sửa:
    this.afterDataChanged.emit();
  }
  get dataSource() {
    return this._dataSource;
  }


  // hiển thị đường kẻ cột
  @Input()
  showColumnLines = false;

  // hiển thị đường kẻ dòng
  @Input()
  showRowLines = false;

  // hiển thị border
  @Input()
  showBorders = false;

  // cho phép xuống dòng
  @Input()
  wordWrapEnabled = true;

  // show button điều hướng
  @Input()
  showNavigationButtons = true;

  @Input()
  allowColumnResizing = true;

  // show thông tin
  @Input()
  showInfo = true;

  // Có cho fixed không
  @Input()
  isFixed = false;

  // page size lựa chọn
  @Input()
  showPageSizeSelector = true;

  // clear selection
  @Input()
  clearSelection = true;

  // chọn bản ghi khi click dòng
  @Input()
  isSelectOnRowClick = false;

  // show thông tin
  @Input()
  infoText = ''; // Hiển thị {0} trên {1} ({2} kết quả)

  // không có dữ liệu
  @Input()
  noDataText = 'Danh sách trống';

  _selectedItems = [];
  // không có dữ liệu
  @Input() set selectedItems(value) {
    if (value) {
      this._selectedItems = AmisCommonUtils.cloneDataArray(value);
      this.selectItemsOnGrid(value);
    }
  }

  @Input()
  allowedPageSizes: Array<number> = [5, 10, 30];

  /**
   * Danh sách cột để xử lý
   */
  _columns: Array<any>;
  @Input()
  set columns(data) {
    if (data) {
      this.renderColumn(data);
    }
  }
  get columns() {
    return this._columns;
  }
  /**
   * Ẩn hiện cột tùy chỉnh hay không
   */
  @Input()
  isShowCustomColumn: boolean = true;

  /**
   * Ẩn hiện dấu option action đầu dòng hay không
   */
  @Input()
  isShowMoreOption: boolean = true;

  /**
   * Có cho phép chọn một nhiều hay không
   */
  @Input()
  isSingleSelection: boolean = false;

  /**
   * Có cho phép chọn một nhiều hay không
   */
  @Input()
  isShowSelection: boolean = true;

  /**
   * Có cho phép chọn một nhiều hay không
   */
  @Input()
  isReport: boolean = false;

  /**
   * Danh sách cột để xử lý
   */
  // @Input()
  isContextMenuVisible = false;

  // Danh sách bản ghi được select
  selectedDatas = [];

  /**
   * Đối tượng hiện thị popover
   */
  popoverTarget: any;

  // Truyền vào trang hiện tại
  @Input() currentPageIndex = 1;

  // Truyền vào số lượng bản ghi trong 1 trang
  @Input() currentPageSize = 50;

  // Tổng số bản ghi để truyền vào paging:
  @Input() totalRecord = 0;

  // có phải grid trên popup không
  @Input() isGridOnPopup: boolean = false;

  // có phải grid trên popup không
  @Input() isBorderGrid: boolean = false;

  // có phải grid trên popup không
  @Input() isShowPaging: boolean = true;

  // có show chọn trang, next, back trang không
  @Input() isShowToolPaging: boolean = true;

  @Input()
  positionEmpoyeeDetail: string = "hrm-inherit-container-fluid";

  // tên phân hệ để show grid tương ứng
  @Input()
  layoutGridType = '';

  // tên bảng để show grid. ví dụ: thông tin gia đình, bằng cấp ...
  @Input()
  configGridTable = '';

  // tham số xác định key truyền vào để phục vụ cho việc select. VD: EmployeeID, JobPositionID...
  @Input()
  valueExpr = '';

  // cho phép sửa table hay k
  @Input()
  isEdit = false;

  // cho phép sửa table hay k
  @Input()
  formMode: FormMode;

  @Input()
  isSelectionOnly: boolean = false;

  // Lưu dữ liệu grid khi submmit
  @Input() set isSubmit(data) {
    this._isSubmit = data.isSubmit;
    if (this._isSubmit) {
      this.isValidateGrid = true;
      this.saveEditData(true);
      this.validateBeforeSave();
      if (this.isValidateSave) {
        if (this.isShowSelection) {
          this.saveData.emit(this.listChooseRecord);
        } else {
          this.saveData.emit(this.dataSource);
        }
      }
    }
  }

  // Lưu dữ liệu grid bắn data bình thường
  @Input() set isSaveGrid(data) {
    if (data?.isSaveGrid) {
      this.saveEditData();
    }
  }
  // dữ liệu config grid
  @Input() gridColumnConfig: any;
  //biến kiểm tra trc khi lưu
  isValidateSave = false;

  _isSubmit = false;
  // Mã phân hệ chứa configGridTable
  subsystemCode: string;

  // Lưu chỉnh sửa cột hiển thị
  @Output()
  save: EventEmitter<any> = new EventEmitter<any>();

  // thay đổi trạng thái của công việc
  @Output()
  changeStatusName: EventEmitter<any> = new EventEmitter<any>();

  // Hủy chỉnh sửa cột hiển thị
  @Output()
  cancel: EventEmitter<any> = new EventEmitter<any>();

  // Chọn row
  @Output()
  chooseRecord: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  clickViewMoreRow: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  doubleClickRow: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  clickRow: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  saveConfigColumn: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  loadDataPaging: EventEmitter<any> = new EventEmitter<any>();

  // Output bắn hành xử chức năng context Menu
  @Output()
  contextMenuAction: EventEmitter<any> = new EventEmitter<any>();

  // Output bắn hành xử chức năng context Menu
  @Output()
  downloadData: EventEmitter<any> = new EventEmitter<any>();

  //Output bắn dataSource
  @Output()
  outputDataSource: EventEmitter<any> = new EventEmitter<any>();

  //Output bắn saveData
  @Output()
  saveData: EventEmitter<any> = new EventEmitter<any>();

  // sau khi save thành công độ rộng cột
  @Output()
  afterSaveColumnWidth: EventEmitter<any> = new EventEmitter<any>();

  // Load lại grid khi xóa thành công từ form view
  @Output()
  reloadWhenDelete: EventEmitter<any> = new EventEmitter<any>();


  // Biến lưu id grid
  @ViewChild('grid', { static: false })
  grid: DxDataGridComponent;

  @ViewChild('myDrop', { static: false }) myDrop: NgbDropdown;

  @ViewChild('customColumn', { static: false }) customColumn: AmisListDragDropComponent;

  @ViewChild('container', { static: false }) container: ViewContainerRef;

  /**
   * Map chứa danh sách các dòng dữ liệu được chọn theo phân trang: key - page index, value - DS ứng viên được chọn
   */
  selectedRowsMap = new Map<number, Array<any>>();


  @Input()
  selectedColumns = [];

  customColumns = [];

  listColumnsGridDefault = [];

  layoutGridDefault: any = {};
  layoutGroupDefault: any = {};

  timeOutPaging: any; // (nếu isSelectionMode = true)

  // Danh sách chức năng phụ khi click vào 1 dòng
  @Input()
  contextMenuList = [];

  // Danh sách chức năng phụ khi click vào 1 dòng
  @Input()
  isShowAvatar = false;

  // có hiện dấu hiệu trên avatar không
  @Input()
  signalAvatar = {
    IsShowSignalAvatar: false,
    Icon: 'icon-signal-avatar',
    FieldKey: "IsUpdatedProfile",// trường để dựa vào ẩn hiện icon cho từng dòng
    IsShowTooltip: false,
    TooltipContent: ""
  };

  // Danh sách chức năng phụ khi click vào 1 dòng
  @Input()
  isCheckAll = false;

  // khai báo độ rộng cột
  columnWidth = 0;

  // Khai báo thứ tự cột
  orderColumn: number;

  // đối tượng lưu lại cột thay đổi(độ rộng)
  objectChangeColumn: any = {};

  // Danh sách cột đc thay đổi độ rộng
  arrColumnChange = [];

  // danh sách lưu lại các bản ghi khi load dữ liệu
  allRecordOfGrid = [];

  // custom sắp xếp trên grid
  @Output() sortData: EventEmitter<any> = new EventEmitter<any>();

  //load thành công hay chưa
  isLoaded = false;

  //validate trống
  pattern = /^\s*[0-9a-zA-Z][0-9a-zA-Z ]*$/

  //danh sách các item được chọn
  listChooseRecord = [];

  visiblePopupPreview = false;

  //kiểm tra thay đổi giá trị nhập vào input
  isChangeInput = false;

  //có validate hay k
  isValidateGrid = false;

  // tên groupFieldName đang sử dụng để hiện số lượng
  @Input()
  groupFieldName = '';

  // Hiển thị chi tiết hồ sơ
  isVisibleEmployeeDetail: boolean = false;

  // Input truyền vào form chi tiết hồ sơ
  inputEmployee: any;
  //delay khi repaint grid
  timeoutRepaint;
  //delay khi resize column
  timeoutWidthChange;

  ngOnInit() {
    const me = this;
    if (this.columns?.length) {
      this.columns.forEach(i => i.IsShow = true);
      this.selectedColumns = this.columns.filter(i => i.IsVisible === true);
    }

    if (this.grid && this.grid.columns?.length) {
      this.listColumnsGridDefault = AmisCommonUtils.cloneData(this.grid.columns);
    }

    const subRemoveSelection = this.transferDataSV.removeSelectedOneRecord.pipe(takeUntil(this._onDestroySub)).subscribe(x => {
      if (x == true) {
        this.selectedDatas = [];
        this._selectedItems = [];
        this.isCheckAll = false;
        me.grid?.instance?.clearSelection();
        // this.transferDataSV.selectedOneRecort({});
      }
    });
    this.unSubscribles.push(subRemoveSelection);

    // hàm gọi emit subcriber thay đổi group nhóm
    const subChangeGroupGridField = this.transferDataSV.changedGroupGridField.pipe(takeUntil(this._onDestroySub)).subscribe(res => {
      this.changedListRowMergeGroup(res);
    });
    this.unSubscribles.push(subChangeGroupGridField);

    if (this.contextMenuList.length > 0 && this.contextMenuList.length <= 2) {
      if (this.contextMenuList.length > 1) {
        this.columnWidth += this.contextMenuList.length * 8;
      }

      this.contextMenuList.forEach((k, index) => {
        this.columnWidth += k.width;
      });
    }

    this.getLookup();

    //sửa lỗi khoảng trắng giữa các cột
    const subRepaintGrid = this.transferDataSV.repaintGrid.pipe(takeUntil(this._onDestroySub)).subscribe(res => {
      // this.repaintGrid(this.gridWrapper?.nativeElement?.offsetWidth, 1);
      let grid: any = this.grid;
      grid = grid?.element?.nativeElement;
      if (grid?.getElementsByClassName("dx-scrollable-content")[0].offsetWidth - grid?.offsetWidth <= 180 && !res?.IsCollapse) {
        clearTimeout(this.timeoutRepaint);
        this.timeoutRepaint = setTimeout(() => {
          this.grid?.instance?.repaint();
        }, res.Time);
      }
    })
    this.unSubscribles.push(subRepaintGrid);

  }

  lastColumnData;
  /**
   * lưu thay đổi độ rộng cột
   * dtnam1 22/9/2020
   * @param e
   */
  saveWidthColumn(e) {
    if (e.fullName.split('.')[1] === "width") {
      clearTimeout(this.timeoutWidthChange);
      this.timeoutWidthChange = setTimeout(() => {
        if (e.fullName == this.lastColumnData?.fullName && e.value == this.lastColumnData?.value) {
          return;
        }
        let column = e.fullName.split('.')[0];
        let index = column.split('[')[1].split(']')[0];
        let columns: any = this.grid?.columns;
        //trừ đi những cột cố định đầu tiên (render tĩnh)
        index -= columns.findIndex(x => x.name);

        if (index < 0 || !this.gridColumnConfig) {
          return;
        }
        let service: any;

        // khi config lưu dưới dạng gridconfig
        if (this.gridColumnConfig.GridFieldConfigs?.length) {
          this.gridColumnConfig.GridFieldConfigs = this.columns;
          let gridFieldConfig = this.gridColumnConfig.GridFieldConfigs[index];
          gridFieldConfig.Width = e?.value;
          if (this.gridColumnConfig.IsSystem) {
            service = this.layoutGridSV.saveLayoutGridConfig(this.gridColumnConfig);
          }
          else {
            service = this.layoutGridSV.saveWidthColumnGrid({
              GridFieldConfigID: gridFieldConfig.GridFieldConfigID,
              SubsystemCode: gridFieldConfig.SubsystemCode,
              Width: gridFieldConfig.Width
            });
          }
        }
        //khi config lưu dưới dạng groupconfig
        else if (this.gridColumnConfig.GroupFieldConfigs?.length) {
          this.gridColumnConfig.GroupFieldConfigs = this.columns;
          let fieldConfig = this.gridColumnConfig.GroupFieldConfigs[index];
          let customConfigParse = JSON.parse(fieldConfig.CustomConfig);
          customConfigParse = !customConfigParse ? {} : customConfigParse;
          customConfigParse.GridConfigs = !customConfigParse.GridConfigs ? {} : customConfigParse.GridConfigs;
          customConfigParse.GridConfigs.Width = e?.value;
          fieldConfig.CustomConfig = JSON.stringify(customConfigParse);

          if (fieldConfig.IsSystem) {
            service = this.layoutGridSV.saveTableGridConfig(this.gridColumnConfig);
          }
          else {
            service = this.layoutGridSV.saveWidthColumnGrid({
              GroupFieldConfigID: fieldConfig.GroupFieldConfigID,
              SubsystemCode: fieldConfig.SubsystemCode,
              CustomConfig: fieldConfig.CustomConfig
            });
          }
        }

        service.subscribe(res => {
          if (res?.Success) {
            this.lastColumnData = e;
            this.afterSaveColumnWidth.emit(this.gridColumnConfig);
          }
        });

      }, 1000);
    }
  }

  /**
 * Lấy danh sách selectbox khi sửa thông tin trên table
 * Created by: pvthong 06-07-2020
 */
  getLookup() {
    if (this.isEdit) {
      let countCombobox = 0;
      this.columns.forEach(element => {
        if (element.TypeControl === TypeControl.Combobox && element.InfoLookup && element.Lookup) {
          countCombobox++;
        }
      });

      if (countCombobox) {
        let countTemp = 0;
        this.columns.forEach(element => {
          if (element.TypeControl === TypeControl.Combobox && element.InfoLookup && element.Lookup) {
            this.amisDataSV.getDataByURL(element.InfoLookup.url, element.InfoLookup.controller, element.InfoLookup.params, true).subscribe(res => {
              if (res?.Success) {
                countTemp++;
                element.Lookup.dataSource = res.Data;
                //kiểm tra Đã lấy đủ danh sách các combobox thì vẽ grid
                if (countTemp == countCombobox) {
                  this.isLoaded = true;
                }
              }
              else {
                this.isLoaded = true;
              }
            }, err => {
              this.isLoaded = true;
            });
          }

        });
      }
      else {
        this.isLoaded = true;
      }

    }
    else {
      this.isLoaded = true;
    }

  }

  /**
   * Click vào 1 dòng trên grid
   * Created by: dthieu 04-05-2020
   */
  onRowClick(e) {
    if (this.isEdit) {
      this.isValidateGrid = false;
      if (e.event?.offsetX > 45) {
        this.saveEditData();
        this.grid?.instance.editRow(e.rowIndex);
      }
      return;
    }
    if (!e.event.target.className.includes('icon-optional-more viewmore') && !e.event.target.className.includes('icon-action') && !e.event.target.className.includes('icon-finished') && !e.event.target.className.includes('icon-not-finished')) {
      if (this.isSelectOnRowClick && e.data) {
        const item = this._selectedItems.find(i => i[`${this.valueExpr}`] == e.data[`${this.valueExpr}`]);
        if (item) {
          this._selectedItems = this._selectedItems.filter(i => i[`${this.valueExpr}`] != e.data[`${this.valueExpr}`]);
        } else {
          this._selectedItems.push(e.data);
        }
        this.selectItemsOnGrid(this._selectedItems);
      }
      this.clickRow.emit(e);
      e.event.target.classList.add('scroll-to-select-row');
    }
  }

  /**
   * Double click row
   * Created by: dthieu 04-05-2020
   */
  onRowDblClick(e) {
    if (this.isEdit) {
      return;
    }
    // this.doubleClickRow.emit(e);
    if (!AmisCommonUtils.IsEmpty(this.objectChangeColumn)) {
      this.customColumns = AmisCommonUtils.cloneDataArray(this.columns);
      this.customColumns.forEach(element => {
        if (element.SortOrder == this.objectChangeColumn.Order - 2) {
          element.Width = this.objectChangeColumn.Width;
        }
      });
      this.saveOptionColumn();
    }
  }

  /**
   * Lưu lại thông tin mở rộng cột trên grid
   * Created by: dthieu 05-05-2020
   */
  saveOptionColumn() {
    const me = this;
    let tmpColumns = [];
    // this.customColumns.forEach(i => i.IsVisible = true);

    if (this.listColumnsGridDefault.length > 0) {
      me.grid.columns = this.listColumnsGridDefault;
    }

    const defaultColumns = [me.grid.columns[0]];
    defaultColumns.push(me.grid.columns[1]);

    // Sắp xếp lại thứ tự cột của menu chọn cột. Cột nào hiện lên trước, ẩn xuống sau
    const tmpShowColumn = me.customColumns.filter(el => el.IsVisible === true); // Các cột hiện
    const tmpHideColumn = me.customColumns.filter(el => el.IsVisible === false); // Các cột ẩn
    tmpColumns.push(...tmpShowColumn);
    tmpColumns.push(...tmpHideColumn);

    this.selectedColumns = AmisCommonUtils.cloneDataArray(tmpShowColumn);
    this.columns = AmisCommonUtils.cloneDataArray(this.customColumns);

    // Sắp xếp lại thứ tự cột trên grid, ăn theo thứ tự của menu chọn cột
    let tmpGridColumn = [];

    tmpGridColumn.push(...defaultColumns);

    const cloneGridColumn = AmisCommonUtils.cloneDataArray(me.grid.columns);
    if (tmpColumns && tmpColumns.length > 0) {
      tmpColumns.forEach(f => {
        const tmpField = cloneGridColumn.find(element => element.dataField === f.FieldName);
        if (tmpField) {
          tmpField.width = f.Width;
          tmpGridColumn.push(tmpField);
        }
      });
    }
    me.grid.columns = tmpGridColumn;
    tmpColumns.forEach(f => {
      me.grid?.instance.columnOption(f.FieldName, 'visible', f.IsVisible);
    });
    me.customColumns = AmisCommonUtils.cloneDataArray(tmpColumns);
    // me.selectedColumns = AmisCommonUtils.cloneDataArray(tmpColumns);

    if (this.layoutGridType) {
      if (!AmisCommonUtils.IsEmpty(this.layoutGridDefault)) {
        this.layoutGridDefault.GridFieldConfigs = tmpColumns;
        this.saveConfigColumn.emit(this.layoutGridDefault);
      } else {
        this.saveConfigColumn.emit(tmpColumns);
      }
    } else {
      if (!AmisCommonUtils.IsEmpty(this.layoutGroupDefault)) {
        this.layoutGroupDefault.GridFieldConfigs = tmpColumns;
        this.saveConfigColumn.emit(this.layoutGroupDefault);
      } else {
        this.saveConfigColumn.emit(tmpColumns);
      }
    }

    this.customColumn.sortOrderColumn(this.customColumns, this.selectedColumns);
    this.layoutGridDefault = {};
    this.layoutGroupDefault = {};
    this.isShowDrop = false;
    // đóng form tùy chỉnh
    this.myDrop.close();
    this.keyword = '';
    this.isCustomed = false;

  }

  /**
   * Set mặc định tùy chỉnh cột
   * Created by: dthieu 22-05-2020
   */
  columnsForAdvanceExport = ["JobPositionCode", "OrganizationUnitCode"];
  setDefaultSettingColumn(e) {
    const me = this;
    const typeConfig = this.layoutGridType;
    if (typeConfig) {
      this.groupConfigSV.getGridColumsConfig(typeConfig, true).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
        if (res && res.Success && res.Data) {
          this.layoutGridDefault = res.Data;

          me.columns = res.Data.GridFieldConfigs?.filter(k => !this.columnsForAdvanceExport.includes(k.FieldName));
          me.customColumn.items = res.Data.GridFieldConfigs;
          me.customColumn.selectedItems = res.Data.GridFieldConfigs.filter(o => o.IsVisible);
          me.customColumn.sortOrderColumn(me.customColumn.items, me.customColumn.selectedItems);
        }
      }, error => { });
    } else {
      const tableNameConfig = this.configGridTable;
      this.groupConfigSV.getDefaultGroupConfig(tableNameConfig, this.subsystemCode).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
        if (res && res.Success && res.Data) {
          this.layoutGroupDefault = res.Data;

          res.Data.GroupFieldConfigs = _.orderBy(res.Data.GroupFieldConfigs, [(o) => {
            return o.SortOrder || '';
          }], ['asc']);
          res.Data.GroupFieldConfigs.filter(item => {
            // if (item.IsVisible && item.IsUse) {
            if (item.IsUse) {
              return true;
            }
            return false;
          });
          res.Data.GroupFieldConfigs.forEach(ele => {
            if (ele.CustomConfig) {
              try {
                const obj = JSON.parse(ele.CustomConfig);
                if (obj.GridConfigs) {
                  for (let itm in obj.GridConfigs) {
                    ele[itm] = obj.GridConfigs[itm];
                  }
                }
              } catch (err) {

              }
            }
            if (ele.DisplayField) {
              ele.TmpFieldName = ele.FieldName;
              ele.FieldName = ele.DisplayField;
            }
          });
          me.customColumn.items = res.Data.GroupFieldConfigs;
          me.customColumn.selectedItems = res.Data.GroupFieldConfigs.filter(o => o.IsVisible);
          me.customColumn.sortOrderColumn(me.customColumn.items, me.customColumn.selectedItems);
        }
      }, error => { });
    }

  }


  /**
   * FireEvent khi Click selectbox đầu dong
   * Created by: dthieu 22-05-2020
   */
  selectedRowKeysChange(e) {
    if (e && !this.isClearSelect) {

      let listID = this._selectedItems.map(e => e[`${this.valueExpr}`]);
      if (e.currentSelectedRowKeys.length != 0) {
        e.currentSelectedRowKeys.forEach(element => {
          if (listID.indexOf(element[`${this.valueExpr}`]) < 0) {
            this._selectedItems.push(element);
          }
        });
      }
      if (e.currentDeselectedRowKeys.length != 0) {
        let deleteID = e.currentDeselectedRowKeys.map(e => e[`${this.valueExpr}`]);
        this._selectedItems.forEach(ele => {
          if (deleteID.indexOf(ele[`${this.valueExpr}`]) > -1) {
            this._selectedItems = this._selectedItems.filter(e => e[`${this.valueExpr}`] != ele[`${this.valueExpr}`]);
          }
        });
      }

      this.listChooseRecord = e.selectedRowsData;
      this.chooseRecord.emit(e);
    }
  }

  /**
   * Dữ liệu bắn ra khi check box chọn cột trên tùy chỉnh cột
   * Created by: dthieu 13-05-2020
   */
  customSettingColumn(e) {
    if (this.listColumnsGridDefault && this.listColumnsGridDefault.length === 0) {
      this.listColumnsGridDefault = this.grid.columns;
    }
    this.customColumns = e;
    const checkedColumns = this.customColumns.filter(i => i.IsVisible);
    if (checkedColumns.length >= 1) {
      this.isCustomed = true;
    } else {
      this.isCustomed = false;
    }
  }

  renderDefaultColumn(e) {

  }

  allowColumnReorderingChange(e) {

  }

  closeCustomColumn(e) {
    this.myDrop.close();
    this.isShowDrop = false;
    this.keyword = '';
  }

  /**
   * Load phân trang
   * Created by: dthieu 22-05-2020
   */
  onLoadPagingChanged(e) {
    if (e) {
      if (this.selectedDatas.length > 0) {
        this.isClearSelect = true;
      } else {
        this.isClearSelect = false;
      }
      this.currentPageIndex = e.PAGE_INDEX;
      this.currentPageSize = e.PAGE_SIZE;
      if (this.timeOutPaging) {
        clearTimeout(this.timeOutPaging);
      }

      this.timeOutPaging = setTimeout(() => {
        // Gọi lại service để truyền lại tham số pageIndex
        const paramPaging: any = {};

        paramPaging.PageIndex = this.currentPageIndex;
        paramPaging.PageSize = this.currentPageSize;
        paramPaging.Sort = window.btoa(`[{"selector":"CreatedDate","desc":"true"}]`);
        paramPaging.SelectedData = this.selectedDatas;

        // gọi service load paging theo pageing param truyền vào
        this.loadDataPaging.emit(paramPaging);
      }, 200);
    }
  }

  /**
   * Click vào nút 3 chấm đầu dòng show popup danh sách chức năng
   * Created by: dthieu 22-05-2020
   */
  onShowContextMenu(e, param) {
    e.stopPropagation();
    if (!this.isContextMenuVisible) {
      const element = e.target;
      this.selectedRowItem = param.data;
      let flagVisible

      if (!AmisCommonUtils.IsEmpty(this.selectedRowItem)) {
        this.contextMenuList.forEach(item => {
          if (this.selectedRowItem[`${item.Enable}`]) {
            item.ClassDisable = 'disabled';
          } else {
            item.ClassDisable = '';
          }

          if (item.Key == ContextMenu.Active) {
            // Trạng thái tài khoản là Chưa kích hoạt và ngưng hoạt động => button kích hoạt tài khoản
            if (!this.selectedRowItem[`${item.Status}`]) {
              item.ClassVisible = 'invisible';
            } else if ((this.selectedRowItem[`${item.Status}`] == UserStatus.NotActive || this.selectedRowItem[`${item.Status}`] == UserStatus.Inactive)) {
              item.ClassVisible = 'visible';
            } else {
              item.ClassVisible = 'invisible';
            }
          }
          if (item.Key == ContextMenu.DisActive) {
            // Trạng thái tài khoản là Chưa kích hoạt và ngưng hoạt động => button kích hoạt tài khoản
            if (!this.selectedRowItem[`${item.Status}`]) {
              item.ClassVisible = 'invisible';
            } else if ((this.selectedRowItem[`${item.Status}`] == UserStatus.NotActive || this.selectedRowItem[`${item.Status}`] == UserStatus.Inactive)) {
              item.ClassVisible = 'invisible';
            } else if (this.selectedRowItem[`${item.Status}`] == UserStatus.Active) {
              item.ClassVisible = 'visible';
            } else {
              item.ClassVisible = 'invisible';
            }
          }

        });
        // if (this.selectedRowItem.IsSystem) {
        //   this.renderer.addClass(e.target, 'disabled');
        //   this.isSystem = true;
        // }
        // else {
        //   this.isSystem = false;
        // }
      }

      this.popoverTarget = element.parentElement;
      this.isContextMenuVisible = true;

      this.clickViewMoreRow.emit(
        {
          Target: e,
          SelectedRow: param
        }
      );

    } else {
      this.isContextMenuVisible = false;
    }
  }

  /**
   * Click vào nút đầu dòng
   * Created by: dthieu 22-05-2020
   */
  clickContextMenu(e, item, param) {
    this.clickViewMoreRow.emit(
      {
        Target: e,
        SelectedRow: param,
        ContextMenu: item
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      this.checkInputChange(changes, 'dataSource')
    ) {
      this.formatDataGrid();
    }
  }

  /**
   * Check hiển thị trên control
   * Create by: dthieu 12/5/2020
   */
  checkInputChange(changes: SimpleChanges, inputName) {
    const inputChange = changes[inputName];
    return (
      inputChange && inputChange.previousValue !== inputChange.currentValue
    );
  }

  /**
   * Check hiển thị trên control
   * Create by: dthieu 12/5/2020
   */
  formatDataGrid() {
    if (this.columns && this.dataSource) {
      this.columns.forEach(item => {
        this.dataSource.forEach(data => {
          switch (item.DataType) {
            case DataType.DateType:
              // data[item.FieldName] = `Date : ${data[item.FieldName] ? data[item.FieldName] : '--'}`;
              // const checkData = this.getEmptyData(data[item.FieldName]);
              // data[item.FieldName] = AmisDateUtils.formatDate(checkData);
              break;
            // case DataType.NumberType:
            //   data[item.FieldName] = `${data[item.FieldName] ? data[item.FieldName] : '--'}`;
            //   break;
            // default:
            //   data[item.FieldName] = data[item.FieldName] ? data[item.FieldName] : '--';
            //   break;
          }
        });

      });
    }
  }

  /**
   * Check có trống dữ liệu không
   * Created by: dthieu 12-05-2020
   */
  getEmptyData(dataSource) {
    if (dataSource) {
      return dataSource;
    }
  }

  /**
   * Sự kiện thay đổi độ rộng cột
   * dthieu 1/6/2020
   * @param e
   */
  onOptionChanged(e) {
    if (e.fullName && e.fullName.endWith('width')) {
      const positionColumn = e.fullName.match(/\d/g, '').join('');
      this.orderColumn = parseInt(positionColumn, 0);

      this.objectChangeColumn.Width = e.value;
      this.objectChangeColumn.Order = this.orderColumn;

      const existItem = this.arrColumnChange.find(i => i.Order == this.objectChangeColumn.Order);
      if (existItem) {
        existItem.Width = this.objectChangeColumn.Width;
      }
      this.arrColumnChange.push(this.objectChangeColumn);

    }
    const obj: any = {};
    // obj.Key = e.fullName;
  }
  onDisposing(e) {

  }

  /**
   * Xử lí khi click vào tên
   * dthieu 15/05/2020
   */
  onEmployeeNameClick(event, data) {
    event.stopPropagation();
    let param = {
      mode: "detail",
      id: 0
    }
    if (AmisCommonUtils.IsNumeric(data)) {
      param.id = data;
      // this.showInforSupervisorWhenClick(data);
    } else {
      param.id = data.EmployeeID;
      // this.transferDataSV.openViewProfile(data);
    }
    // this.router.navigate([`profile/view`], {
    //   queryParams: param
    // });
    this.showEmployeeDetail(param.id);
  }

  /**
   * Show thông tin người quản lý trực tiếp quản lý gián tiếp
   * Created by: dthieu 19-06-2020
   */
  showInforSupervisorWhenClick(supervisorID) {
    const param = {
      id: supervisorID
    }
    this.router.navigate([`profile/detail`], {
      queryParams: param
    });
  }

  /**
   * Hành xử khi click menu item
   * Created by: dthieu 02-06-2020
   */
  contextMenuExecuteAction(e, key) {
    const objRowClick: any = {};
    objRowClick.Key = key;
    objRowClick.Data = this.selectedRowItem;
    this.isContextMenuVisible = false;
    this.contextMenuAction.emit(objRowClick);
  }

  /**
   * Sự kiện click ra ngoài dropdown
   * Created by: dthieu 06-06-2020
   */
  toggle(e) {
    if (!e) {
      this.isShowDrop = false;
    } else {
      this.isShowDrop = true;
    }
  }

  /**
   * Xử lý sự kiện click download tài liêu
   * Created by: dthieu 08-06-2020
   */
  download(e, param) {
    const obj: any = {};
    e.stopPropagation();
    obj.Target = e;
    obj.Data = param;
    this.downloadData.emit(obj);
  }

  /**
   * Tải file trên grid
   * Created by: dthieu 11-06-2020
   */
  downloadAttachment(e, param) {
    if (this.isActionWithFile) {
      e.stopPropagation();
      const attachmentID = param.data?.AttachmentID;
      const enumType = this.getTypeEnumDownload(param);
      if (attachmentID) {
        let temp = param?.key?.State == FormMode.Insert ? true : false;
        this.downloadSV.getTokenFile(attachmentID, enumType, temp).subscribe(res => {
          if (res && res.Success && res.Data) {
            window.open(this.downloadSV.downloadFile(res.Data), '_blank');
          } else {
            this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("TOAST_DOWNLOAD_RECORD_FAIL"));
          }
        }, error => {
          this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("ERROR_HAPPENED"));
        });
      }
    }
  }

  /**
   * Lấy type để download
   * Created by: dthieu 11-06-2020
   */
  getTypeEnumDownload(param: any) {
    let enumType = null;
    if (param.column.dataType == TypeControl.UploadDocument) {
      enumType = UploadTypeEnum.EmployeeAttachment;
    }
    else if (param.column.dataType == TypeControl.UploadImage) {
      enumType = UploadTypeEnum.Avatar;
    }
    return enumType;
  }

  /**
   * Xử lý chức năng sắp xếp
   * Created by: dthieu 11-06-2020
   */

  onCellClick(e) {
    if (this.isEdit) {
      const popCombox = document.querySelector('.dx-dropdownlist-popup-wrapper.dx-selectbox-popup-wrapper');
      if (!!popCombox && !!popCombox.classList) {
        popCombox.classList.add('amis-pop-select-grid-contro');
      }
      return;
    }
    if (e.rowType === "header" && e.column.type !== "selection") {
      if (!e.column.allowSorting) {
        return;
      }
      const sortGrid = AmisCommonUtils.Base64Encode(this.generateSort(e));
      this.sortData.emit(sortGrid);
    }
  }

  /**
   * Tạo câu sort
   * dthieu 11/6/2020
   */
  generateSort(e) {
    const listSortParam = [];
    if (e.rowType === "header" && e.column && e.column.type !== "selection") {
      const sortParam = new SortParam();
      sortParam.selector = e.column.dataField;

      sortParam.desc = e.column.sortOrder === "desc" ? true : false;
      listSortParam.push(sortParam);
    }
    return JSON.stringify(listSortParam);
  }

  generateAvatarForTypeControlUser(data) {
    this._dataSource = AmisCommonUtils.cloneDataArray(data);
    if (this._columns?.length) {
      this.renderAvatarUserType();
      // this._columns.forEach(item => {
      //   item.TmpFieldName = item.FieldName;
      //   this._dataSource.forEach(k => {
      //     if (item.TypeControl == TypeControl.SelectHuman) {
      //       item.TmpFieldName = this.getFieldNameForUserType(item.FieldName);
      //       if (!k.AvatarUser) {
      //         k.AvatarUser = {};
      //       }
      //       k.AvatarUser[item.TmpFieldName] = this.avatarSV.getAvatarDefault(k[item.TmpFieldName], item.EditVersion);
      //     }
      //   });
      // });
    }

  }



  getFieldNameForUserType(data) {
    const subStr = data.slice(0, -4);
    return subStr + 'ID';
  }

  /**
   * Sửa Caption grid nếu require
   * Created By PVTHONG 22/07/2020
   */
  renderColumn(data) {
    if (data?.length) {
      data.forEach(element => {
        if (this.isEdit && element.isEditting && element.IsRequire) {
          let index = element.Caption.indexOf("*");
          if (index < 0) {
            element.Caption += " *";
          }
        }
      });
      this._columns = AmisCommonUtils.cloneDataArray(data);
    }

    this.renderAvatarUserType();
  }


  private renderAvatarUserType() {
    this.preHandleData();
    this._columns?.forEach(item => {
      // if (!item.TmpFieldName) {
      //   item.TmpFieldName = item.FieldName;
      // }
      this.dataSource?.forEach(k => {
        if (item.TypeControl == TypeControl.Combobox ||
          item.TypeControl == TypeControl.MultiCombobox ||
          item.TypeControl == TypeControl.TreeBox ||
          item.TypeControl == TypeControl.UploadDocument ||
          item.TypeControl == TypeControl.UploadImage ||
          item.TypeControl == TypeControl.SelectHuman) {
          item.TmpFieldName = this.getFieldNameForUserType(item.FieldName);
        } else {
          item.TmpFieldName = item.FieldName;
        }

        // xử lý định dạng số file đính kèm
        if (item.TypeControl == TypeControl.FileSize) {
          item.TmpFieldName = 'ConvertSizeAttachment';
          k[item.TmpFieldName] = Math.ceil(parseInt(k[item.FieldName], 0) / 1024);
        }


        // Lưu avatar người dùng
        if (item.TypeControl == TypeControl.SelectHuman) {
          if (!k.AvatarUser) {
            k.AvatarUser = {};
          }
          k.AvatarUser[item.TmpFieldName] = this.avatarSV.getAvatarDefault(k[item.TmpFieldName], item.EditVersion);
        }

        // Lưu config màu
        if (!k.ColorConfig) {
          k.ColorConfig = {};
        }

        // nếu datasource có check màu thì sẽ show màu
        if (item.HasConfigColor) {
          if (item.TmpFieldName == 'Result') { // trường khi nhập khẩu
            k.ColorConfig[item.TmpFieldName] = item.ColorConfig?.Value[k.Success];
          } else {
            k.ColorConfig[item.TmpFieldName] = item.ColorConfig?.Value[k[item.TmpFieldName]];
          }
        } else {
          if (!k.ColorConfig[item.TmpFieldName]) {
            k.ColorConfig[item.TmpFieldName] = null;

          }
        }

        // phục vụ nhập khẩu lỗi bôi đỏ các text lỗi
        if (k.listFieldError?.length) {
          k.listFieldError.forEach(atem => {
            let tempCheck
            if (item.TypeControl == TypeControl.Combobox ||
              item.TypeControl == TypeControl.MultiCombobox ||
              item.TypeControl == TypeControl.TreeBox ||
              item.TypeControl == TypeControl.UploadDocument ||
              item.TypeControl == TypeControl.UploadImage ||
              item.TypeControl == TypeControl.SelectHuman) {
              tempCheck = item.DatabaseField;
            }
            else {
              tempCheck = item.FieldName;
            }
            if (atem == tempCheck) {
              item.HasErrorValidate = true;
              k.ColorConfig[item.TmpFieldName] = 'delete-status';
            } else {
              item.HasErrorValidate = false;
            }
          });
        }
        if (k.listFieldSuccess?.length) {
          k.listFieldSuccess.forEach(atem => {
            let tempCheck
            if (item.TypeControl == TypeControl.Combobox ||
              item.TypeControl == TypeControl.MultiCombobox ||
              item.TypeControl == TypeControl.TreeBox ||
              item.TypeControl == TypeControl.UploadDocument ||
              item.TypeControl == TypeControl.UploadImage ||
              item.TypeControl == TypeControl.SelectHuman) {
              tempCheck = item.DatabaseField;
            }
            else {
              tempCheck = item.FieldName;
            }
            if (atem == tempCheck) {
              item.HasErrorValidate = true;
              k.ColorConfig[item.TmpFieldName] = 'active-status';
            } else {
              item.HasErrorValidate = false;
            }
          });
        }
        // validate lỗi thì show màu
        // if (item.HasErrorValidate) {
        //   k.ColorConfig[item.TmpFieldName] = 'delete-status';
        // }

        // bổ sung thêm cờ check trạng thái của thủ tục từng dòng, phục vụ chuyển trạng thái danh sách công việc (bổ nhiệm, miễn nhiệm, ...)
        k.ConfigStatus = k[`${this.subsystemCode}StatusID`] ? k[`${this.subsystemCode}StatusID`] : JobStatusEnum.HasNotFinished

      });
    });
  }

  /**
   * Hàm xử lí dữ liệu object trước khi bind
   *
   * @memberof AmisPagingGridComponent
   * CREATED: PTSY 10/8/2020
   */
  preHandleData() {
    this._columns?.forEach(item => {
      if (item.TypeControl == TypeControl.UploadDocument && this.isActionWithFile) {
        this._dataSource?.forEach(e => {
          if (e) {

            e.AttachmentExtension = e.AttachmentName?.substring(e.AttachmentName?.lastIndexOf("."), e.AttachmentName?.length);
            const filePreview = [".pdf", ".jpg", ".jpeg", ".png", ".gif", ".html"];
            if (filePreview.includes(e.AttachmentExtension?.toLowerCase())) {
              e.AllowPreview = true;
            }
            else {
              e.AllowPreview = false;
            }
          }
        })
      }
    })
  }

  /**
 * Chọn các bản ghi trên grid
 * nmduy 06/07/2020
 */
  selectItemsOnGrid(data) {
    if (data?.length && this.valueExpr) {
      setTimeout(() => {
        this.isClearSelect = true;
        let iDArray = [];
        iDArray = data.map(e => e[`${this.valueExpr}`]); // Lấy danh sách bản ghi đã được chọn
        let selectedRow = this.dataSource.filter(e => iDArray.indexOf(e[`${this.valueExpr}`]) > -1); // Lấy những bản ghi được chọn ở grid hiện tại
        this.grid?.instance.selectRows(selectedRow, false); //thực hiện chọn grid
        setTimeout(() => {
          this.isClearSelect = false;
        }, 300);
      }, 100);
    } else {
      this.grid?.instance?.clearSelection();
    }
  }

  /**
  * validate trc khi lưu
  * pvthong 06/07/2020
  */
  validateBeforeSave() {
    if (this.grid['element'].nativeElement.querySelector(".dx-datagrid-invalid")) {
      this.grid['element'].nativeElement.querySelector(".dx-datagrid-invalid .dx-texteditor-input").focus();
      this.isValidateSave = false;
      return;
    }
    this.isValidateSave = true;

    let cellError = -1;
    let columnError = -1;
    let isBreak = false;
    for (let cell = 0; cell < this._dataSource.length; cell++) {
      for (let column = 0; column < this._columns.length; column++) {
        if (this._columns[column].IsRequire && !this._dataSource[cell][this._columns[column].FieldName]) {
          cellError = cell;
          columnError = column;
          isBreak = true;
          break;
        }
      }
      if (isBreak) {
        break;
      }
    }
    if (cellError >= 0 && columnError >= 0) {
      this.grid?.instance.editRow(cellError);
      setTimeout(() => {
        this.grid['element'].nativeElement.querySelectorAll("table tr.dx-data-row")[cellError].querySelectorAll('input')[columnError + 1].focus();
      })
      this.isValidateSave = false;
      return;
    }
    this.isValidateSave = true;

  }



  /**
  * lưu dữ liệu grid
  * pvthong 06/07/2020
  */
  saveEditData(passCheck = false) {
    if (this.isEdit && (this.grid?.instance.hasEditData() || passCheck)) {
      this.isChangeInput = false;
      this.grid?.instance.saveEditData();
      // gán data hiển thị
      this.columns.forEach(element => {
        if (element.TypeControl == TypeControl.Combobox) {
          this.dataSource.forEach(elementData => {
            if (elementData[element.FieldName] && element.Lookup?.dataSource) {
              let valueDisplay = element.Lookup?.dataSource?.find(x => x[element.Lookup?.valueExpr] == elementData[element.FieldName]);
              elementData[element.DisplayFieldName] = AmisCommonUtils.cloneData(valueDisplay[element.Lookup.displayExpr]);
            }
          });

        }
      });

      if (this.isShowSelection) {
        this.outputDataSource.emit(this.listChooseRecord);
      } else {
        this.outputDataSource.emit(this.dataSource);
      }

    }

  }

  /**
  * bắt phím enter để lưu dữ liệu
  * pvthong 07/07/2020
  */
  @HostListener("document:keyup", ["$event"])
  handleKeyUpEvent(event: KeyboardEvent) {
    if (event.keyCode === KeyCode.Enter) {
      this.saveEditData(true);
    }
  }

  /**
   * xử lý click chọn trên grid để thay đổi trạng thái
   * Created by: dthieu 21-07-2020
   */

  changeStatusGrid(e, param) {
    if (!HRMPermissionUtils.checkPermissionUser(this.subSystemCodeFinish, this.permissionCodeFinish)) {
      this.amisTransferSV.showWarningToast(this.translateSV.getValueByKey("VALIDATION_NOT_PERMISSION"));
      return;
    }
    let paramUpdate = param.data;
    let index = this._dataSource.indexOf(param.data);
    if (this.formMode == FormMode.Insert) {
      if (paramUpdate[`ConfigStatus`] == JobStatusEnum.HasNotFinished) {
        this.dataSource[index][`${this.subsystemCode}StatusID`] = JobStatusEnum.HasFinished;
        this.dataSource[index][`${this.subsystemCode}StatusName`] = this.translateSV.getValueByKey('HRM_STATUS_HAS_FINISHED');
        this.dataSource[index][`ConfigStatus`] = JobStatusEnum.HasFinished;
      } else {
        this.dataSource[index][`${this.subsystemCode}StatusID`] = JobStatusEnum.HasNotFinished;
        this.dataSource[index][`ConfigStatus`] = JobStatusEnum.HasNotFinished;
        this.dataSource[index][`${this.subsystemCode}StatusName`] = this.translateSV.getValueByKey('HRM_STATUS_NOT_HAS_FINISHED');
      }
      this.dataSource[index][`State`] = FormMode.Insert;
      this.changeStatusName.emit(this.dataSource);
    } else {
      if (paramUpdate[`ConfigStatus`] == JobStatusEnum.HasNotFinished) {
        paramUpdate[`${this.subsystemCode}StatusID`] = JobStatusEnum.HasFinished;
        paramUpdate[`${this.subsystemCode}StatusName`] = this.translateSV.getValueByKey('HRM_STATUS_HAS_FINISHED');
      } else {
        paramUpdate[`${this.subsystemCode}StatusID`] = JobStatusEnum.HasNotFinished;
        paramUpdate[`${this.subsystemCode}StatusName`] = this.translateSV.getValueByKey('HRM_STATUS_NOT_HAS_FINISHED');
      }
      paramUpdate.State = FormMode.Update;
      this.amisDataSV.save(this.subsystemCode, paramUpdate).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
        if (res?.Success && res?.Data) {
          this.dataSource[index]['EditVersion'] = res?.Data?.EditVersion;
          this.dataSource[index][`${this.subsystemCode}StatusID`] = res?.Data[`${this.subsystemCode}StatusID`];
          this.dataSource[index][`${this.subsystemCode}StatusName`] = res?.Data[`${this.subsystemCode}StatusName`];
          this.dataSource[index][`ConfigStatus`] = res?.Data[`${this.subsystemCode}StatusID`];
          this.changeStatusName.emit(this.dataSource);
          this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("HRM_UPDATE_STATUS_SUCCESS"));
          return;
        } else {
          this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("ERROR_HAPPENED"));
        }
      }, err => {
        this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("ERROR_HAPPENED"));
      });;
    }
  }

  /**
   * Mở popup preview
   *
   * @param {any} e
   * @param {any} param
   * @memberof AmisPagingGridComponent
   * CREATED: PTSY 10/8//2020
   */
  openPreview(e, param) {
    e.stopPropagation();
    this.selectedRowItem = param.data;
    this.visiblePopupPreview = true;

  }

  /**
  * Đóng popup preview
  *
  * @param {any} e
  * @param {any} param
  * @memberof AmisPagingGridComponent
  * CREATED: PTSY 10/8//2020
  */
  onClosePopupPreview() {
    this.visiblePopupPreview = false;
  }

  /**
   * Xóa bản ghi
   *
   * @param {any} e
   * @param {any} param
   * @memberof AmisPagingGridComponent
   * CREATED: PTSY 10/8//2020
   */
  deleteItem(data) {
    if (!data?.FileID) {

      const objRowClick: any = {};
      objRowClick.Key = "Delete";
      objRowClick.Data = data;
      this.contextMenuAction.emit(objRowClick);
    }
    else {
      this.selectedRowItem.data = data
      this.clickViewMoreRow.emit(
        {
          SelectedRow: this.selectedRowItem,
          ContextMenu: {

            Key: 3

          }
        }
      );
    }
  }

  /**
   * bắt keydown trong input
   * created by PVTHONG 14/08/2020
   */
  onKeyDown(e) {
    this.isChangeInput = true;
  }

  /**
   * bắt click trong grid
   * created by PVTHONG 14/08/2020
   */
  click(e) {
    // if (this.isChangeInput && $(e.target).parents('tr.dx-freespace-row').length ) {
    if (this.isChangeInput && e.target?.parentElement?.className?.includes('dx-freespace-row')) {
      this.saveEditData(true);
    }
  }

  /**
   * bắt sự kiện click để lưu thay đổi value
   * created by PVTHONG 14/08/2020
   */
  @HostListener('document:click', ['$event'])
  clickout(e) {
    // if (this.isChangeInput && !$(e.target).parents('tr').length) {
    if (this.isChangeInput && !e.currentTarget?.className?.includes('grid-container dx-widget dx-visibility-change-handler')) {
      this.saveEditData(true);
    }
  }
  /**
   * hàm thay đổi gom nhóm cho
   *
   * @memberof AmisPagingGridComponent
   * vbcong (24/08/2021)
   */
  changedListRowMergeGroup(listColumnGroup) {
    if (listColumnGroup?.length > 0) {
      let groupIn = 0;
      this.groupFieldName = listColumnGroup[0];
      this.columns.forEach(item => {
        if (listColumnGroup.includes(item.FieldName)) {
          let listColumnGrid = [];
          listColumnGrid = this.grid.columns;
          if (listColumnGrid) {
            this.grid.instance.columnOption(item.FieldName, 'groupIndex', groupIn);
            groupIn += 1;
          }
        } else {
          this.grid.instance.columnOption(item.FieldName, 'groupIndex', -1);
        }
      });
    } else {
      this.columns.forEach(item => {
        this.grid.instance.columnOption(item.FieldName, 'groupIndex', -1);
      });
    }
  }

  customizeText(e) {
    if (e.value < 4) {
      return "Less than 4 items"
    }
    return "Items: " + e.value;
  };

  //#region Chi tiết hồ sơ


  /**
   * Hiển thị form chi tiết hồ sơ
   * @param {any} data
   * @memberof HrmOverviewRemindComponent
   * created by vhtruong - 05/08/2020
   */
  showEmployeeDetail(data, isFocusOnGroup = false) {
    this.isVisibleEmployeeDetail = true;
    let activeGroup = "";
    this.inputEmployee = AmisCommonUtils.cloneData({
      FormMode: FormMode.View,
      EmployeeID: data,
      ActiveGroup: activeGroup
    });
  }


  /**
   * Sự kiện hủy trên form chi tiết hồ sơ
   * @param {any} e
   * @memberof HrmOverviewRemindComponent
   * created by vhtruong - 05/08/2020
   */
  afterCancelEmployeeDetail(e) {
    this.isVisibleEmployeeDetail = false;
  }

  /**
   * Sự kiện sửa và lưu trên form chi tiết hồ sơ
   * @param {any} e
   * @memberof HrmOverviewRemindComponent
   * created by vhtruong - 05/08/2020
   */
  afterSaveSuccessEmployeeDetail(e) {
    this.isVisibleEmployeeDetail = false;
  }

  /**
   * Sự kiện đóng trên form chi tiết hồ sơ
   * @param {any} e
   * @memberof HrmOverviewRemindComponent
   * created by vhtruong - 05/08/2020
   */
  afterCloseEmployeeDetail(e) {
    this.isVisibleEmployeeDetail = false;
  }

  /**
   * Sự kiện xóa trên form chi tiết hồ sơ
   * @param {any} e
   * @memberof HrmOverviewRemindComponent
   * created by vhtruong - 05/08/2020
   */
  afterDeleteEmployeeDetail(e) {
    this.isVisibleEmployeeDetail = false;

    this.reloadWhenDelete.emit();
  }

  isExpandAll: boolean = true;
  @Input() typeReport = "";
  expandGridGroup(e) {
    this.isExpandAll = e;
  }

  /**
   * Hiện tooltip thông báo trên avatar
   * dtnam1 17/09/2020
   * @param e
   */
  targetTooltip: any;
  contentTooltip: string;
  visibleTooltip: boolean
  showToolTipAvatar(e, param) {
    if (e && this.signalAvatar?.IsShowTooltip && this.signalAvatar?.IsShowSignalAvatar && param?.data[this.signalAvatar?.FieldKey]) {
      this.targetTooltip = e?.target;
      this.contentTooltip = this.signalAvatar?.TooltipContent;
      this.visibleTooltip = true;
    }
  }
  /**
   * Hiện tooltip thông báo
   * dtnam1 17/09/2020
   * @param e
   */
  showToolTip(e, contentTooltip, isLocalize: boolean) {
    this.targetTooltip = e?.target;
    this.contentTooltip = isLocalize ? this.translateSV.getValueByKey(contentTooltip) : contentTooltip;
    this.visibleTooltip = true;
  }

  logParam(e) {
    console.log(e)
  }
  //#endregion
}


import { Component, OnInit, Input, ViewChild, ViewContainerRef, Injector, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { FormMode } from 'src/common/enum/form-mode.enum';

import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { TypeControl } from '../../enum/common/type-control.enum';
import { AttachmentLazyLoadService } from 'src/app/services/lazy-load-modules/attachment-lazy-load.service';
import { Attachment } from '../../models/attachment/attachment';
import { BaseCustomGridComponent } from '../base-component-custom-grid';
import { DataService } from 'src/app/services/data/data.service';
import { ContextMenu } from '../../enum/context-menu/context-menu.enum';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { LayoutGridConfig } from '../../models/layout-grid-config/layout-grid-config';
import { LayoutConfigGridService } from 'src/app/services/layout-grid-config/layout-grid-config.service';
import { UploadTypeEnum } from '../../enum/uploadType/upload-type.enum';

@Component({
  selector: 'amis-hrm-attachment',
  templateUrl: './hrm-attachment.component.html',
  styleUrls: ['./hrm-attachment.component.scss']
})
export class HrmAttachmentComponent extends BaseCustomGridComponent implements OnInit {

  @Input() formPosition: string = "";

  //title form tải tệp
  @Input() formTitle: string = this.translateSV.getValueByKey("HRM_ATTACHMENT_TITLE");

  //title form sửa
  @Input() titleEdit: string = this.translateSV.getValueByKey("HRM_ATTACHMENT_TITLE_EDIT");

  @Input() subsystemCode: string;

  @Input() set dataSource(data) {
    if (data?.length) {
      data.sort(this.dynamicSort(this.sortName));
      this._dataSource = AmisCommonUtils.cloneDataArray(data);
    }
  }
  _dataSource: Attachment[] = [];

  //Tên trường sắp xếp danh sách
  @Input() sortName = "AttachmentTypeName";

  //input columns
  @Input() set inputColumns(data) {
    if (data) {
      this.columns = data;
    }
  };

  //input context menu
  @Input() set contextMenu(data) {
    if (data) {
      this.listOption = data;
    } else {
      this.listOption = [
        {
          Key: ContextMenu.Edit,
          Icon: 'icon-edit',
          Text: this.translateSV.getValueByKey("EDIT2")
        },
        {
          Key: ContextMenu.Delete,
          Icon: 'icon-delete-red',
          Text: this.translateSV.getValueByKey("DELETE")
        }
      ]
    }
  };

  // list loại file chấp nhận import
  @Input() typeAccept = "";

  //output bắn ra dataSource
  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('attachmentForm', { read: ViewContainerRef }) attachmentForm: ViewContainerRef;

  //Có dữ liệu hay k
  isHaveData: boolean = false;

  //cột grid
    columns: any = [
        {
            Caption: this.translateSV.getValueByKey("HRM_ATTACHMENT_ATTACHMENT_NAME"),
            FieldName: "AttachmentTypeName",
            IsSystem: true,
            IsVisible: true,
            MinWidth: 150,
            SortOrder: 1,
            State: 0,
            Tooltip: this.translateSV.getValueByKey("HRM_ATTACHMENT_ATTACHMENT_NAME"),
            Width: 145,
            isEditting: true,
            IsRequire: true
        },
        {
            Caption: this.translateSV.getValueByKey("HRM_ATTACHMENT_ATTACHMENT_FILE"),
            FieldName: "AttachmentName",
            TextAlign: "Right",
            IsSystem: true,
            IsVisible: true,
            MinWidth: 150,
            SortOrder: 2,
            TypeControl: TypeControl.UploadDocument,
            State: 0,
            Tooltip: this.translateSV.getValueByKey("HRM_ATTACHMENT_ATTACHMENT_FILE"),
            Width: 110,
        },
        {
            Caption: this.translateSV.getValueByKey("HRM_ATTACHMENT_ATTACHMENT_FILESIZE"),
            FieldName: "AttachmentFileSize",
            IsSystem: true,
            IsVisible: true,
            MinWidth: 150,
            SortOrder: 3,
            State: 0,
            Tooltip: this.translateSV.getValueByKey("HRM_ATTACHMENT_ATTACHMENT_FILESIZE"),
            Width: 215,
            TypeControl: TypeControl.FileSize
        },
        {
            Caption: this.translateSV.getValueByKey("HRM_ATTACHMENT_ATTACHMENT_DESCRIPTION"),
            FieldName: "Description",
            IsSystem: true,
            IsVisible: true,
            MinWidth: 150,
            SortOrder: 5,
            State: 0,
            Tooltip: this.translateSV.getValueByKey("HRM_ATTACHMENT_ATTACHMENT_DESCRIPTION"),
            Width: 200,
            isEditting: true,
        }
    ];

  //ID file được chọn
  selectedID: string;
  //thư tự file được chọn
  selectedRowIndex: number;

  //data Row được chọn
  dataRow: any;

  //form sửa tài liệu
  visibleEditForm = false;

  // Input truyền vào form sửa, xem chi tiết tài liệu
  inputForm: any;

  /**
   * Các thông tin của form popup xóa
   */
  popupDelete = {
    TitlePopupDelete: this.translateSV.getValueByKey("DELETE"),
    VisiblePopupDelete: false,
    ContentPopupDelete: this.translateSV.getValueByKey("HRM_ATTACHMENT_DELETE_CONFIRM"),
    ItemDelete: null
  };

  constructor(
    private attachmentLazyLoadService: AttachmentLazyLoadService,
    private injector: Injector,
    public translateSV: AmisTranslationService,
    public amisTransferSV: AmisTransferDataService,
    private cdr: ChangeDetectorRef,
    public dataService: DataService,
    private attachmentService: AttachmentService,
    private layoutGridSV: LayoutConfigGridService,
  ) {
    super(dataService, amisTransferSV, translateSV);
  }

  ngOnInit(): void {
    this.subsys = 'Attachment';
    super.getGridConfig();
  }


  /**
   * Lấy dữ liệu từ master
   * @param {any} data 
   * @memberof HrmAttachmentComponent
   * created by vhtruong - 13/07/2020
   */
  initForm(data) {
    if (data) {
      if (data.ListData) {
        this.listObject = data.ListData;
        this.dataSourceGrid = AmisCommonUtils.cloneDataArray(this.listObject);
      }
      this.masterValue = data.MasterValue;
      this.masterField = data.MasterField;
      this.subSystemActionCode = data.SubSystemActionCode;
      this.permissionActionCode = data.PermissionActionCode;
      this.isIgnorePermission = data.IsIgnorePermission;
      this.permissionObject = data.PermissionObject ?? null;
      this.controller = "Attachment";
      this.primaryKey = "AttachmentID";
    }
  }

  /**
   * click hiển thị form tài liệu đính kèm
   * pvthong 07/07/2020
   */
  onClickAddAttachment() {
    this.loadForm();
  }

  /**
  * load form tài liệu đính kèm
  * pvthong 02/07/2020 
  */
  async loadForm() {
    this.attachmentForm?.clear();
    const compFactory = await this.attachmentLazyLoadService.loadAddAttachmentForm();
    const { instance: componentInstance } = this.attachmentForm.createComponent(compFactory, undefined, this.injector);

    componentInstance.visiblePopup = true;
    componentInstance.title = this.translateSV.getValueByKey("HRM_ATTACHMENT_ADD_ATTACHMENT");
    componentInstance.inputColumns = this.columns;
    componentInstance.btnSave = this.translateSV.getValueByKey("HRM_ATTACHMENT_ATTACH_FILE");
    componentInstance.typeAccept = this.typeAccept;
    componentInstance.sortName = this.sortName;
    componentInstance.masterValue = this.masterValue;
    componentInstance.formMode = this.formMode;
    componentInstance.subsystemCode = this.subsystemCode;

    componentInstance.outputCancel?.pipe(takeUntil(componentInstance._onDestroySub)).subscribe(this.onCloseAttachmentForm.bind(this));
    componentInstance.ouputDataSource?.pipe(takeUntil(componentInstance._onDestroySub)).subscribe(this.outputDataSource.bind(this));
  }

  /**
   * Xử lý chức năng context menu trên từng màn hình danh sách (sửa , xóa)
   * Created By PVTHONG 08/07/2020
   */
  contextMenuExecuteAction(e) {
    if (e?.Key) {
      const key = e.Key;
      if (key === ContextMenu.Edit) {
        this.dataRow = e.Data;
        this.showFormDetail({
          FormMode: FormMode.Update,
          //Data: e.Data;
          //dtnam1 sửa 
          Data: this.dataRow
        });
      }
      if (key === ContextMenu.Delete) {
        this.objectDelete = e;
        this.popupDelete.VisiblePopupDelete = true;
      }
    }
  }


  /**
   * 
   * @param {any} e 
   * @memberof HrmAttachmentComponent
   * created by vhtruong - 13/07/2020
   */
  onClickRow(e) {
    this.selectedRowIndex = e?.dataIndex;
    this.showFormDetail({
      FormMode: FormMode.View,
      Data: e.data
    });
  }


  /**
   * 
   * @memberof HrmAttachmentComponent
   * created by vhtruong - 13/07/2020
   */
  showFormDetail(data) {
    this.inputForm = {
      FormMode: data.FormMode,
      Data: data.Data,
      MasterFormMode: this.formMode,
      SubSystemActionCode: this.subSystemActionCode,
      PermissionActionCode: this.permissionActionCode,
      IsIgnorePermission: this.isIgnorePermission,
    }
    this.visibleEditForm = true;
  }

  /**
   * Sửa thông tin file đính kèm
   * Created By PVTHONG 08/07/2020
   */
  afterSaveEditForm(e) {
    if (!e) {
      return;
    }
    let index;
    if (this.formMode == FormMode.Insert && this.selectedRowIndex >= 0) {
      index = this.selectedRowIndex;
    }
    else if (e.Data.ID > 0) {
      index = this._dataSource.findIndex(x => x.ID == e.Data.ID);
    }
    if (index >= 0) {
      this._dataSource[index] = e.Data;
    }
    this._dataSource.sort(this.dynamicSort(this.sortName));
    this._dataSource = AmisCommonUtils.cloneDataArray(this._dataSource);
    this.afterSave.emit(this._dataSource);
    this.visibleEditForm = false;
  }

  /**
   * Đóng form tài liệu đính kèm
   * pvthong 07/07/2020
   */
  onCloseAttachmentForm() {
    this.attachmentForm.clear();
    this.visibleEditForm = false;
  }

  /**
   * output dataSource
   * pvthong 07/07/2020
   */
  outputDataSource(data) {
    let source = AmisCommonUtils.cloneDataArray(this._dataSource);
    if (!this._dataSource?.length) {
      source = [];
    }
    source.push(...data);
    //sắp xếp danh sách tài liệu
    source.sort(this.dynamicSort(this.sortName));

    this._dataSource = AmisCommonUtils.cloneDataArray(source);
  }

  /**
   * Sự kiện click nút 3 chấm đầu dòng
   * Created by: pvthong 08-07-2020
   */
  viewMoreRow(e) {
    this.selectedID = e?.SelectedRow?.data?.FileID;
    this.selectedRowIndex = e?.SelectedRow?.rowIndex;
  }

  /**
   * Xác nhận xóa file đính kèm
   * Created by: pvthong 08-07-2020
   */
  confirmPopupDelete(e) {
    if (this.formMode === FormMode.Insert) {
      let source = AmisCommonUtils.cloneDataArray(this._dataSource);
      source.splice(this.selectedRowIndex, 1);
      this._dataSource = AmisCommonUtils.cloneDataArray(source);
      this.afterSave.emit(this._dataSource);
      this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("HRM_ATTACHMENT_DELETE_FILE_SUCCESS"));
    } else if (this.formMode === FormMode.Update || this.formMode === FormMode.View) {
      this.attachmentService.delete([this.objectDelete?.Data]).subscribe(res => {
        if (res?.Success) {
          let source = AmisCommonUtils.cloneDataArray(this._dataSource);
          source.splice(this.selectedRowIndex, 1);
          this._dataSource = AmisCommonUtils.cloneDataArray(source);
          this.afterSave.emit(this._dataSource);
          this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("HRM_ATTACHMENT_DELETE_FILE_SUCCESS"));
          return;
        }
        this.amisTransferSV.showErrorToast();
      }, error => {
        this.amisTransferSV.showErrorToast();
      })
    }
  }

  /**
   * HỦy bỏ việc xóa file đính kèm
   * Created by: pvthong 08-07-2020
   */
  cancelPopupDelete(e) {
    this.popupDelete.VisiblePopupDelete = false;
  }

  /**
   * HỦy bỏ việc xóa file đính kèm
   * Created by: pvthong 08-07-2020
   */
  afterDeleteEditForm(e) {
    this.visibleEditForm = false;
    let source = AmisCommonUtils.cloneDataArray(this._dataSource);
    source.splice(this.selectedRowIndex, 1);
    this._dataSource = AmisCommonUtils.cloneDataArray(source);
  }

  /**
   * Swps xếp danh sách
   * Created By PVTHONG 20/07/2020
   */
  dynamicSort(property) {
    var sortOrder = 1;
    if (property && property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1)
    }
    return function (a, b) {
      let aName = a[property]?.toUpperCase() ? AmisStringUtils.convertVNtoENToLower(a[property]?.toUpperCase()) : "";
      let bName = b[property]?.toUpperCase() ? AmisStringUtils.convertVNtoENToLower(b[property]?.toUpperCase()) : "";
      var res = (aName < bName) ? -1 : (aName > bName) ? 1 : 0;
      return res * sortOrder;
    }
  }
  /**
   * Lưu tùy chỉnh cột trên danh sách
   * Created by: hgvinh 22-07-2020
   */
  saveCustomColumnsClient(data) {
    let layoutConfigGrid = new LayoutGridConfig();
    if (AmisCommonUtils.IsArray(data)) {
      data.forEach((element, index) => {
        element.SortOrder = index;
      });
      layoutConfigGrid = this.gridConfig;
      layoutConfigGrid.GridFieldConfigs = data;
    } else {
      layoutConfigGrid = data;
    }
    this.gridColumns = layoutConfigGrid?.GridFieldConfigs;
    this.layoutGridSV.saveLayoutGridConfig(layoutConfigGrid).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
      if (res && res.Success && res.Data) {
        this.amisTransferSV.showSuccessToast(this.amisTranslateSV.getValueByKey('SAVE_CUSTOM_COLUMN_SUCCESS'));
        // this.removeConfigFromSessionStorage("EmployeePlanningPhase");
        this.saveCustomColumns(this.gridColumns);
      } else {
        this.amisTransferSV.showErrorToast(this.amisTranslateSV.getValueByKey('SAVE_CUSTOM_COLUMN_FAILURE'));
      }
    });
  }
}

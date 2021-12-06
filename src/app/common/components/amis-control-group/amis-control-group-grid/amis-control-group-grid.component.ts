import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewContainerRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { GroupConfig } from 'src/app/shared/models/group-config/group-config';
import { GridColumn } from 'src/common/models/common/grid-columns';
import { BaseComponent } from '../../base-component';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import * as _ from "lodash";
import { takeUntil } from 'rxjs/operators';
import { LayoutConfigGridService } from 'src/app/services/layout-grid-config/layout-grid-config.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { TypeControl } from 'src/app/shared/enum/common/type-control.enum';
import { AvatarService } from 'src/app/services/user/avatar.service';
import { GroupType } from 'src/app/shared/enum/group-config/group-type.enum';
import { BaseHRMModel } from 'src/app/shared/models/base-hrm';
import { DependenDictionary } from 'src/app/shared/models/field-dependancy/field-dependancy';
import { DependentData } from 'src/app/shared/models/dependent-data/dependent-data';
import { DependentClone } from 'src/app/shared/models/dependent-clone/dependent-clone';
import { GroupConfigUtils } from 'src/app/shared/function/group-control-utils';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { GroupFieldConfig } from 'src/app/shared/models/group-field-config/group-field-config';
import { TypeFormGrid } from 'src/app/shared/enum/form-grid/type-form-grid.enum';
import { ConfigValidate } from 'src/app/shared/models/config-validate/config-validate';
import { AmisPagingGridComponent } from 'src/common/components/amis-grid/amis-paging-grid/amis-paging-grid.component';
import { ContextMenu } from 'src/app/shared/enum/context-menu/context-menu.enum';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { DocumentType } from 'src/app/shared/enum/document-download-type/document-type.enum';
import { HRMPermissionUtils } from 'src/app/shared/function/permission-utils';
import { PermissionCode } from 'src/app/shared/constant/permission-code/permission-code';
import { TypeShowControl } from 'src/common/models/base/typeShow';
import { SelfServiceStatus } from 'src/app/shared/enum/self-service-status/self-service-status.enum';


@Component({
  selector: 'amis-amis-control-group-grid',
  templateUrl: './amis-control-group-grid.component.html',
  styleUrls: ['./amis-control-group-grid.component.scss']
})
export class AmisControlGroupGridComponent extends BaseComponent implements OnInit {

  // Biến lưu id grid
  @ViewChild('pagingGrid', { static: false })
  pagingGrid: AmisPagingGridComponent;

  @Input() groupbox: GroupConfig = new GroupConfig();

  @Input() DependentDictionaries: DependenDictionary[];

  @Input() DependentDatas: DependentData[];

  @Input() DependentClones: DependentClone[];

  @Input() ConfigValidates: ConfigValidate[];

  @Input() ListFieldAndData: GroupFieldConfig[];

  @Input() MasterData: any;

  @Input() isCallFromEmployeeApp: boolean = false;

  @Input() fns: Function;

  @Input()
  positionFormDataGrid: string = "";

  @Output()
  clickActionInRow: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  clickRow: EventEmitter<any> = new EventEmitter<any>();

  // Sự kiện bắn ra khi có thay đổi dữ liệu của grid
  @Output()
  afterChangeDataGrid: EventEmitter<any> = new EventEmitter<any>();

  @Output() addItemGrid: EventEmitter<any> = new EventEmitter();

  // Danh sách các cột trong grid
  columnGrids: GridColumn[] = [];

  // Từ khóa tìm kiếm cột
  keyword = '';

  // Dữ liệu đã thay đổi hay chưa
  isChangedData: boolean = false;

  // danh sách cột mặc định
  @Input() defaultColumn = '';

  @Input() configGridTable: string;

  @Input() inorgeCheckPermission: boolean = false;

  subsys: string;

  @Input() set subCode(data) {
    if (data) {
      this.subsys = data;
    }
  }

  // Các aciton truyền vào grid
  @Input() set actionInGrid(data) {
    if (data) {
      if (data.GroupConfig?.GroupConfigID === this.groupbox.GroupConfigID) {
        this.actionGrid(data);
      }
    }
  }

  _typeShow: TypeShowControl;
  @Input() get typeShow() {
    return this._typeShow;
  }
  set typeShow(val) {
    if (val) {
      this._typeShow = val
    }
  }

  // SL bản ghi của 1 page
  @Input()
  pageSize = 50;

  /**
   * Danh sách cột để xử lý
   */
  @Input() set columns(value) {
    if (value) {
      this.processDataForBindingGrid(AmisCommonUtils.cloneDataArray(value));
    }
  }

  // SL bản ghi của 1 page
  dataSourceGrid;
  @Input() set dataSource(data) {
    if (data) {
      this.setDataBeforeBinding(data);
    }
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

  @Input()
  allowColumnResizing = true;

  // show thông tin
  @Input()
  showInfo = true;

  // có hiển thị các option trên grid không
  @Input()
  isShowMoreOption = true;

  // không có dữ liệu
  @Input()
  noDataText = 'Danh sách trống';

  // chỉ cho phép xem, không có phép sửa 
  @Input()
  isViewOnly: boolean = false;

  /**
   * Hiển thị button trên grid
   * @type {boolean}
   * @memberof AmisControlGroupComponent
   */
  _isShowButtonGrid: boolean = true;
  @Input() get isShowButtonGrid() {
    return this._isShowButtonGrid;
  }
  set isShowButtonGrid(val) {
    this._isShowButtonGrid = val;
  }

  /**
   * Hiển thị nodata grid
   * @type {boolean}
   * @memberof AmisControlGroupComponent
   */
  _isShowNodataGrid: boolean = true;
  @Input() get isShowNodataGrid() {
    return this._isShowNodataGrid;
  }
  set isShowNodataGrid(val) {
    this._isShowNodataGrid = val;
  }


  /**
   * FormMode
   * created by nmduy 06/05/2020
   */
  _isDisplayHeader: boolean = true;
  @Input() get isDisplayHeader() {
    return this._isDisplayHeader;
  }
  set isDisplayHeader(val) {
    this._isDisplayHeader = val;
  }

  /**
   * FormMode
   * created by nmduy 06/05/2020
   */
  _formMode: FormMode;
  @Input() get formMode() {
    return this._formMode;
  }
  set formMode(val) {
    this._formMode = val;
  }

  @Input()
  masterIDValue: string = "";

  masterIDField: string = ""; // trường key của master

  @ViewChild('formGrid', { read: ViewContainerRef }) formGrid: ViewContainerRef;

  gridColumns = []; //convert lại dữ liệu cột khi truyền vào grid

  contextMenuItems = [
    {
      text: 'Sửa',
      icon: 'plus'
    },
  ];


  listOption = [
    {
      Key: ContextMenu.Edit,
      Icon: 'icon-edit',
      Text: this.amisTranslateSV.getValueByKey('EDIT2'),
      Class: ""
    },
    {
      Key: ContextMenu.Delete,
      Icon: "icon-delete-red",
      Text: this.amisTranslateSV.getValueByKey('DELETE'),
      Class: 'text-red'
    },

  ]
  selfServiceStatus = SelfServiceStatus;

  // Hiển thị popup confirm xóa dữ liệu
  isShowDeleteDataGrid: boolean = false;

  // Title Form
  titleFormGrid: string = "";

  // FormMode hiển thị của data grid
  formModeGrid: FormMode;

  // Index của dữ liệu
  indexData: number = -1;

  // Object binding form thêm sửa
  objectDataGrid: BaseHRMModel = new BaseHRMModel();

  // Content popup xóa dữ liệu
  contentPopupDelete: string = "";

  // Dữ liệu chuẩn bị xóa
  dataDelete: any;

  // Dữ liệu show form group box
  listGroupBoxDataGrid = [];

  // Hiển thị popup thông báo
  visiblePopupNotify: boolean = false;

  isAllowSelect: boolean = false; // grid có cho phép tích chọn không

  selectedData = []; // mảng các bản ghi được chọn trên grid

  headerMenu = []; // option hiển thị khi chọn bản ghi trên grid
  //trường check xem có phải hiển thị bản ghi từ chối hay không
  isCheckRejected = false;

  constructor(
    public amisDataService: AmisDataService,
    public amisTransferSV: AmisTransferDataService,
    public transferDataSV: TransferDataService,
    public amisTranslateSV: AmisTranslationService,
    public readonly componentFactoryResolver: ComponentFactoryResolver,
    public readonly injector: Injector,
    public layoutGridSV: LayoutConfigGridService,
    public avatarSV: AvatarService

  ) {
    super();
  }

  ngOnInit() {
    this.getGroupboxInfo();
  }

  /**
   * Lấy custom config trong group box
   * nmduy 30/06/2020
   */
  getGroupboxInfo() {
    if (this.groupbox?.CustomConfigObject) {
      if (this.groupbox?.CustomConfigObject.hasOwnProperty('IsAllowSelect')) {
        this.isAllowSelect = this.groupbox.CustomConfigObject.IsAllowSelect;
      }
      if (this.groupbox?.CustomConfigObject.hasOwnProperty('GridHeaderMenu')) {
        this.headerMenu = this.groupbox.CustomConfigObject.GridHeaderMenu;
      }
      if (this.groupbox?.CustomConfigObject.hasOwnProperty('ContextMenu')) {
        this.listOption = this.groupbox.CustomConfigObject.ContextMenu;
      }
      if (this.groupbox?.CustomConfigObject.hasOwnProperty('IsNotUseDefaultFromDataGrid')) {
        this.groupbox.IsNotUseDefaultFromDataGrid = this.groupbox.CustomConfigObject.IsNotUseDefaultFromDataGrid;
      }
    }
  }

  /**
   * hàm check xem có bản ghi nào bị từ chối hay không
   * created by: hgvinh25/09/2020
   */
  checkExistDataReject() {
    let rejected = this.dataSourceGrid?.filter(x => x.CustomConfig?.SelfService_Status == this.selfServiceStatus.Reject);
    if (rejected?.length) {
      this.isCheckRejected = true;
    }
  }

  /**
   * Nhận sự kiện click vào dòng
   * @param {any} e
   * @memberof AmisControlGroupGridComponent
   * created by vhtruong - 25/05/2020
   */
  clickOptions(e) {
    if (e?.ContextMenu) {
      this.eventItemInGrid({
        Data: e,
        GroupConfig: this.groupbox
      });
      // this.clickActionInRow.emit({
      //   Data: e,
      //   GroupConfig: this.groupbox
      // });
    }
  }


  /**
   * Xử lý dữ liệu trước khi truyền vào grid
   * nmduy 27/05/2020
   */
  processDataForBindingGrid(value) {
    if (value?.length) {
      value = _.orderBy(value, [(o) => {
        return o.SortOrder || '';
      }], ['asc']);
      this.gridColumns = value.filter(item => {
        // if (item.IsVisible && item.IsUse) {
        if (item.IsUse) {
          return true;
        }
        return false;
      });
      this.gridColumns = value;
      this.gridColumns.forEach(element => {
        if (element.CustomConfig) {
          try {
            const obj = JSON.parse(element.CustomConfig);
            if (obj.GridConfigs) {
              for (let itm in obj.GridConfigs) {
                element[itm] = obj.GridConfigs[itm];
              }
            }
          } catch (err) {

          }
        }
        if (element.DisplayField) {
          element.TmpFieldName = element.FieldName;
          element.FieldName = element.DisplayField;
        }
        if (AmisCommonUtils.IsArray(this.dataSourceGrid)) {
          this.dataSourceGrid.forEach(k => {
            if (element.TypeControl == TypeControl.SelectHuman) {
              if (!k.AvatarUser) {
                k.AvatarUser = {};
              }
              k.AvatarUser[element.TmpFieldName] = this.avatarSV.getAvatarDefault(k[element.TmpFieldName], element.EditVersion);
            }
          });
        }
      });
    }
  }


  /**
   * Set object trước khi hiển thị
   * @param {any} data
   * @memberof AmisControlGroupGridComponent
   * created by vhtruong - 17/06/2020
   */
  setDataBeforeBinding(data) {
    let isChangedDataLength = data?.length != this.dataSourceGrid?.length ? true : false;
    this.dataSourceGrid = AmisCommonUtils.cloneData(data.filter(e => e.State != FormMode.Delete));
    this.checkExistDataReject();
    this.afterChangeDataGrid.emit({
      GroupConfig: this.groupbox,
      Data: this.groupbox.DataGroupConfig,
      IsChangedData: this.isChangedData,
      IsChangeDataLength: isChangedDataLength
    });

    if (this.groupbox.ConfigSortOrder) {
      try {
        const listSort = JSON.parse(this.groupbox.ConfigSortOrder);
        if (listSort?.length) {
          this.dataSourceGrid = _.orderBy(this.dataSourceGrid, listSort.map(e => e.FieldName), listSort.map(e => e.OrderBy?.toLowerCase()));
        }
        if (AmisCommonUtils.IsArray(this.dataSourceGrid) && AmisCommonUtils.IsArray(this.gridColumns)) {
          this.gridColumns.forEach(element => {

            this.dataSourceGrid.forEach(ku => {
              if (element.TypeControl == TypeControl.SelectHuman) {
                if (!ku.AvatarUser) {
                  ku.AvatarUser = {};
                }
                ku.AvatarUser[element.TmpFieldName] = this.avatarSV.getAvatarDefault(ku[element.TmpFieldName], ku.EditVersion);
              }
            });
          });
        }
      }
      catch (ex) {
        console.log(ex);
      }
    }
  }


  /**
     * Xử lý chức năng context menu trên từng màn hình danh sách
     * Created by: dthieu 02-06-2020
     */
  contextMenuExecuteAction(e) {
    const obj: any = {};
    obj.SelectedRow = e.Data;
    obj.ContextMenu = e.Key;

    if (e.Key == ContextMenu.Edit || e.Key == ContextMenu.Delete || e.Key == ContextMenu.Duplicate) {
      this.eventItemInGrid({
        Data: obj,
        GroupConfig: this.groupbox
      });
    } else { // nếu không phải thao tác xem sửa xóa dữ liệu
      this.onClickContextMenuOption(obj);
    }
  }

  /**
   * Lưu lại thiết lập vào DB
   * Created by: dthieu 14-05-2020
   */
  saveCustomColumns(data) {
    let groupClone = AmisCommonUtils.cloneData(this.groupbox);
    if (AmisCommonUtils.IsArray(data)) {
      data.forEach((element, index) => {
        element.SortOrder = index;
        if (element.TypeControl == TypeControl.Combobox ||
          element.TypeControl == TypeControl.SelectHuman ||
          element.TypeControl == TypeControl.UploadDocument ||
          element.TypeControl == TypeControl.UploadImage ||
          element.TypeControl == TypeControl.MultiCombobox ||
          element.TypeControl == TypeControl.TreeBox
        ) {
          element.FieldName = element.TmpFieldName;
        }

      });
      groupClone.GroupFieldConfigs = data;
    } else {
      if (data && data.GroupFieldConfigs && data.GroupFieldConfigs.length > 0) {
        data.GroupFieldConfigs.forEach((element, index) => {
          element.SortOrder = index;
          if (element.TypeControl == TypeControl.Combobox ||
            element.TypeControl == TypeControl.SelectHuman ||
            element.TypeControl == TypeControl.UploadDocument ||
            element.TypeControl == TypeControl.UploadImage ||
            element.TypeControl == TypeControl.TreeBox ||
            element.TypeControl == TypeControl.MultiCombobox
          ) {
            element.FieldName = element.TmpFieldName;
          }

        });
        groupClone = data;
      }
    }

    this.layoutGridSV.saveTableGridConfig(groupClone).pipe(takeUntil(this._onDestroySub)).subscribe(res => {
      if (res && res.Success) {
        this.amisTransferSV.showSuccessToast('Lưu thành công tùy chỉnh cột');
      } else {
        this.amisTransferSV.showErrorToast('Có lỗi xảy ra');
      }
    });
  }


  /**
   * Thực hiện action trong grid
   * @param {any} data
   * @memberof AmisControlGroupGridComponent
   */
  actionGrid(data) {
    switch (data.Action) {
      case 1:
        this.addItemIntoGrid();
        break;
    }
  }

  /**
   * Nhận sự kiện hiển thị form từ group
   * @param {any} groupbox
   * @returns
   * @memberof AmisControlFormGroupComponent
   */
  addItemIntoGrid() {
    if (!this.checkPermissionAction(PermissionCode.Insert) && !this.inorgeCheckPermission) {
      return;
    }
    this.addItemGrid.emit({
      Action: FormMode.Insert,
      GroupConfig: this.groupbox
    });
    if (this.groupbox.IsNotUseDefaultFromDataGrid) {
      return;
    }
    this.showFormDataGrid();
  }


  /**
   * Xử lý dữ liệu truyền vào trước khi show form
   * @memberof AmisControlGroupGridComponent
   * created by vhtruong - 22/06/2020
   */
  setDataBeforeShowForm() {
    if (this.groupbox.ConfigCloneDataMaster) {
      let arr = [];
      try {
        let listClone = JSON.parse(this.groupbox.ConfigCloneDataMaster);
        if (listClone?.length) {
          listClone.forEach(e => {
            if (e.IsUsePropertyInMaster) {
              if (this.MasterData) {
                arr.push({
                  FieldName: e.FieldName,
                  Value: this.MasterData[e.FieldCloneValue],
                  ValueText: e.FieldCloneValueText ? this.MasterData[e.FieldCloneValueText] : null,
                  PropertyChange: e.PropertyChange
                })
              }
            } else {
              if (e.FieldCloneValue) {
                if (this.ListFieldAndData?.length) {
                  let obj = this.ListFieldAndData.find(f => f.FieldName == e.FieldCloneValue);
                  if (obj) {
                    arr.push({
                      FieldName: e.FieldName,
                      Value: obj.Value,
                      ValueText: e.FieldCloneValueText ? obj.ValueText : null,
                      PropertyChange: e.PropertyChange
                    })
                  }
                }
              } else {
                arr.push({
                  FieldName: e.FieldName,
                  PropertyChange: e.PropertyChange
                })
              }
            }
          })
        }
        return arr;
      } catch (ex) {
        console.log(ex);
      }
    }
    return null;
  }

  /**
   * Hiển thị form thêm sửa data grid
   * @param {any} e
   * @memberof AmisControlFormGroupComponent
   * create by vhtruong - 25/05/2020
   */
  showFormDataGrid() {

    if (!this.checkPermissionAction(PermissionCode.Insert)) {
      return;
    }

    const obj = AmisCommonUtils.cloneData(this.groupbox);

    const masterIDField = obj.MappingConfigs?.length ? obj.MappingConfigs[0].DetailField : null;

    this.masterIDField = masterIDField;

    this.titleFormGrid = obj.GroupConfigName;

    this.objectDataGrid = new BaseHRMModel();

    let dataCloneAndChangeField = this.setDataBeforeShowForm();

    // Gọi sang phân hệ khác
    if (obj.SubsystemCodeGroup) {

      this.lazyLoadForm({
        Controller: obj.TableName,
        SubSystemCode: obj.SubsystemCodeGroup,
        FormMode: FormMode.Insert,
        Title: this.titleFormGrid,
        IsCallAPIInit: true,
        IsCallAPISave: true,
        GroupConfig: obj,
        IsDisplayHeader: true,
        MasterIDField: masterIDField,
        MasterIDValue: this.masterIDValue,
        DataCloneAndChangeField: dataCloneAndChangeField,
        TypeForm: TypeFormGrid.UseOtherForm,
        PermissionCode: this._typeShow.PermissionCode,
        PermissionSystemCode: this._typeShow.SubSystemCode,
        IsIgnorePermission: this._typeShow.IsInorgeSubSuystem,
        CallFromEmployeeApp: this.isCallFromEmployeeApp

      })

    }
    // Sử dụng luôn các trường groupo field config
    else {

      obj.GroupFieldConfigs = AmisCommonUtils.cloneDataArray(this.groupbox.GroupFieldConfigs);
      obj.GroupType = GroupType.Field;
      obj.IsChild = false;
      obj.IsNotSetChild = true;
      let listGroup = [];
      listGroup.push(obj);
      listGroup.forEach(t => {
        t.DataGroupConfig = [];
        t.IsExpand = null;
        t.IsShowExpand = true;
        t.ColOne = [];
        t.ColTwo = [];
        if (t?.GroupFieldConfigs?.length) {
          t.GroupFieldConfigs.forEach(gf => {
            gf.Value = null;
            gf.ValueText = null;
          })
        }
      })

      this.objectDataGrid.GroupConfigs = AmisCommonUtils.cloneDataArray(GroupConfigUtils.GetData(listGroup));

      if (this._formMode === FormMode.Insert || this._formMode === FormMode.Duplicate) {

        this.lazyLoadForm({
          Controller: obj.TableName,
          SubSystemCode: obj.SubsystemCode,
          Data: this.objectDataGrid,
          FormMode: FormMode.Insert,
          Title: this.titleFormGrid,
          IsCallAPIInit: false,
          IsCallAPISave: false,
          GroupConfig: obj,
          IsDisplayHeader: false,
          MasterIDField: masterIDField,
          MasterIDValue: this.masterIDValue,
          DataCloneAndChangeField: dataCloneAndChangeField,
          TypeForm: TypeFormGrid.UseGroupFieldConfig,
          DependentClones: this.DependentClones,
          DependentDatas: this.DependentDatas,
          DependentDictionaries: this.DependentDictionaries,
          ConfigValidates: this.ConfigValidates,
          IsIgnorePermission: true,
          CallFromEmployeeApp: this.isCallFromEmployeeApp

        })

      } else {

        this.lazyLoadForm({
          Controller: obj.TableName,
          SubSystemCode: obj.SubsystemCode,
          Data: this.objectDataGrid,
          FormMode: FormMode.Insert,
          Title: this.titleFormGrid,
          IsCallAPIInit: false,
          IsCallAPISave: true,
          GroupConfig: obj,
          IsDisplayHeader: false,
          MasterIDField: masterIDField,
          MasterIDValue: this.masterIDValue,
          DataCloneAndChangeField: dataCloneAndChangeField,
          TypeForm: TypeFormGrid.UseGroupFieldConfig,
          DependentClones: this.DependentClones,
          DependentDatas: this.DependentDatas,
          DependentDictionaries: this.DependentDictionaries,
          ConfigValidates: this.ConfigValidates,
          PermissionCode: this._typeShow.PermissionCode,
          PermissionSystemCode: this._typeShow.SubSystemCode,
          IsIgnorePermission: this._typeShow.IsInorgeSubSuystem,
          CallFromEmployeeApp: this.isCallFromEmployeeApp

        })

      }

    }
  }


  /**
   * Sửa dữ liệu
   * @param {any} e
   * @memberof AmisControlFormGroupComponent
   * created by vhtruong - 26/05/2020
   */
  showFormEditDataGrid(data) {

    if (!this.checkPermissionAction(PermissionCode.Edit)) {
      return;
    }

    this.listGroupBoxDataGrid = [];

    if (data) {

      const dataObject = data.SelectedRow;

      if (dataObject) {

        this.objectDataGrid = dataObject;

        // Lấy index của object trong list data hiện tại
        if (this._formMode === FormMode.Insert || this._formMode === FormMode.Duplicate) {
          this.indexData = this.groupbox.DataGroupConfig?.findIndex(e => e.IndexGrid === dataObject.IndexGrid);
        } else {
          this.indexData = this.groupbox.DataGroupConfig?.findIndex(e => e[this.groupbox.FieldID] == dataObject[this.groupbox.FieldID]);
        }

        if (this.indexData != -1) {

          const obj = AmisCommonUtils.cloneData(this.groupbox);

          this.titleFormGrid = obj.GroupConfigName;

          let dataCloneAndChangeField = this.setDataBeforeShowForm();

          const masterIDField = obj.MappingConfigs?.length ? obj.MappingConfigs[0].DetailField : null;
          this.masterIDField = masterIDField;

          // Gọi sang phân hệ khác
          if (obj.SubsystemCodeGroup) {

            this.lazyLoadForm({
              Controller: obj.TableName,
              SubSystemCode: obj.SubsystemCodeGroup,
              FormMode: FormMode.Update,
              Title: this.titleFormGrid,
              IsCallAPIInit: true,
              IsCallAPISave: true,
              GroupConfig: obj,
              IsDisplayHeader: true,
              MasterIDValue: dataObject[obj.FieldID],
              ObjectID: dataObject[obj.FieldID],
              DataCloneAndChangeField: dataCloneAndChangeField,
              TypeForm: TypeFormGrid.UseOtherForm,
              Data: this.objectDataGrid,
              PermissionCode: this._typeShow.PermissionCode,
              PermissionSystemCode: this._typeShow.SubSystemCode,
              IsIgnorePermission: this._typeShow.IsInorgeSubSuystem,
              CallFromEmployeeApp: this.isCallFromEmployeeApp

            })

          }
          // Sử dụng luôn các trường groupo field config
          else {

            obj.GroupType = GroupType.Field;
            obj.IsChild = false;
            obj.IsNotSetChild = true;
            let listGroup = [];
            listGroup.push(obj);
            const listGroupConfigs = AmisCommonUtils.cloneDataArray(GroupConfigUtils.GetData(listGroup));

            // Set value
            listGroupConfigs.forEach(t => {
              t.DataGroupConfig = [];
              t.IsExpand = null;
              t.IsShowExpand = true;
              if (t?.GroupFieldConfigs?.length) {
                t.GroupFieldConfigs.forEach(gf => {
                  gf.Value = dataObject[gf.FieldName];
                  gf.ValueText = dataObject[gf.DisplayField];
                })
              }
            })
            this.objectDataGrid.GroupConfigs = listGroupConfigs;

            if (this._formMode === FormMode.Insert || this._formMode === FormMode.Duplicate) {

              this.lazyLoadForm({
                Controller: obj.TableName,
                SubSystemCode: obj.SubsystemCode,
                Data: this.objectDataGrid,
                FormMode: FormMode.Update,
                Title: this.titleFormGrid,
                IsCallAPIInit: false,
                IsCallAPISave: false,
                GroupConfig: obj,
                IsDisplayHeader: false,
                MasterIDField: masterIDField,
                MasterIDValue: this.masterIDValue,
                DataCloneAndChangeField: dataCloneAndChangeField,
                TypeForm: TypeFormGrid.UseGroupFieldConfig,
                DependentClones: this.DependentClones,
                DependentDatas: this.DependentDatas,
                DependentDictionaries: this.DependentDictionaries,
                ConfigValidates: this.ConfigValidates,
                IsIgnorePermission: true,
                CallFromEmployeeApp: this.isCallFromEmployeeApp

              })

            } else {

              this.lazyLoadForm({
                Controller: obj.TableName,
                SubSystemCode: obj.SubsystemCode,
                Data: this.objectDataGrid,
                FormMode: FormMode.Update,
                Title: this.titleFormGrid,
                IsCallAPIInit: false,
                IsCallAPISave: true,
                GroupConfig: obj,
                IsDisplayHeader: false,
                MasterIDField: masterIDField,
                MasterIDValue: this.masterIDValue,
                DataCloneAndChangeField: dataCloneAndChangeField,
                TypeForm: TypeFormGrid.UseGroupFieldConfig,
                DependentClones: this.DependentClones,
                DependentDatas: this.DependentDatas,
                DependentDictionaries: this.DependentDictionaries,
                ConfigValidates: this.ConfigValidates,
                PermissionCode: this._typeShow.PermissionCode,
                PermissionSystemCode: this._typeShow.SubSystemCode,
                IsIgnorePermission: this._typeShow.IsInorgeSubSuystem,
                CallFromEmployeeApp: this.isCallFromEmployeeApp

              })

            }

          }

        }
      }
    }
  }


  /**
   * Set index cho dữ liệu grid
   * @memberof AmisControlGroupGridComponent
   */
  getIndexGrid() {
    let index = 0;
    this.groupbox.DataGroupConfig?.forEach(e => {
      if (e.IndexGrid) {
        if (e.IndexGrid > index) {
          index = e.IndexGrid;
        }
      }
    })
    return index + 1;
  }


  /**
   * Lưu dữ liệu vào db
   * @memberof AmisControlFormGroupComponent
   * created by vhtruong - 25/05/2020
   */
  saveDataGrid(event) {

    this.objectDataGrid = event.Data;

    // Form thêm mới => không gọi lên server lưu dữ liệu bảng trong form
    if (this._formMode === FormMode.Insert || this._formMode === FormMode.Duplicate) {


      const dataObject = AmisCommonUtils.cloneData(this.setDataAfterSave(this.objectDataGrid));

      dataObject.State = FormMode.Insert;

      if (!this.groupbox.DataGroupConfig) {
        this.groupbox.DataGroupConfig = [];
      }

      // Thêm mới
      if (event.FormMode == FormMode.Insert) {
        dataObject.IndexGrid = this.getIndexGrid();
        this.groupbox.DataGroupConfig?.push(dataObject);
      }
      // Sửa
      else if (event.FormMode == FormMode.Update) {
        this.groupbox.DataGroupConfig[this.indexData] = dataObject;
      }
      this.isChangedData = true;
      this.groupbox.DataGroupConfig = AmisCommonUtils.cloneDataArray(this.groupbox.DataGroupConfig);

    }
    // Form view => lưu luôn dữ liệu vào db
    else if (this._formMode === FormMode.View || this._formMode == FormMode.Update) {

      const dataObject = AmisCommonUtils.cloneData(this.setDataAfterSave(this.objectDataGrid));

      if (dataObject) {
        if (!this.groupbox.DataGroupConfig) {
          this.groupbox.DataGroupConfig = [];
        }

        // Thêm mới => add object vào list data
        if (event.FormMode == FormMode.Insert) {
          dataObject.GroupConfigs = [];
          this.groupbox.DataGroupConfig?.push(dataObject);
        }

        // Sửa => thay đổi object thành thông tin mới
        else if (event.FormMode == FormMode.Update) {
          if (this.groupbox.DataGroupConfig[this.indexData]) {
            this.groupbox.DataGroupConfig[this.indexData] = dataObject;
          }
        }
        this.isChangedData = true;
        this.groupbox.DataGroupConfig = AmisCommonUtils.cloneDataArray(this.groupbox.DataGroupConfig);

      }

    }
  }


  /**
   * Gán data cho object
   * @param {BaseHRMModel} data
   * @returns
   * @memberof AmisControlFormGroupComponent
   * created by vhtruong - 25/05/2020
   */
  setDataAfterSave(data: BaseHRMModel) {
    if (data?.GroupConfigs?.length) {
      data?.GroupConfigs.forEach(e => {
        if (e.GroupFieldConfigs?.length) {
          e.GroupFieldConfigs.forEach(gf => {
            data[gf.FieldName] = gf.Value;
            if (gf.DisplayField) {
              data[gf.DisplayField] = gf.ValueText;
            }
          })
        }
        data.GroupConfigs = [];
      })
    }
    data.State = FormMode.None;
    return data;
  }


  /**
   * Nhận sự kiện từ grid
   * @param {any} e
   * @memberof AmisControlFormGroupComponent
   * created by vhtruong - 26/05/2020
   */
  eventItemInGrid(e) {
    if (e) {
      const data = e.Data;
      if (data?.ContextMenu) {

        // Xóa
        if (data?.ContextMenu === ContextMenu.Delete) {

          // FormGroup là form thêm mới
          if (this._formMode === FormMode.Insert || this._formMode === FormMode.Duplicate) {
            if (data.SelectedRow) {
              let indexData = this.groupbox.DataGroupConfig?.findIndex(e => e.IndexGrid === data.SelectedRow.IndexGrid);
              if (indexData != -1) {
                this.groupbox.DataGroupConfig.splice(indexData, 1);
                this.groupbox.DataGroupConfig = AmisCommonUtils.cloneDataArray(this.groupbox.DataGroupConfig);

              }
            }
          }
          // FormGroup là form thêm xem chi tiết
          else if (this._formMode === FormMode.View || this._formMode === FormMode.Update) {
            this.showPopupDeleteDataGrid(e);
          }
          // FormGroup là form sửa
          // else if (this._formMode === FormMode.Update) {
          //   if (data.SelectedRow) {
          //     let index = this.listGroupbox.findIndex(t => t.GroupConfigID === group.GroupConfigID);
          //     if (index != -1) {
          //       const dataObject = data.SelectedRow;
          //       if (dataObject.State != FormMode.Insert) {
          //         dataObject.State = FormMode.Delete;
          //         if (!this.listGroupbox[index].DataGroupConfig) {
          //           this.listGroupbox[index].DataGroupConfig = [];
          //         }
          //         this.listGroupbox[index].DataGroupConfig[this.indexData] = dataObject;
          //       } else {
          //         let indexData = this.listGroupbox[index].DataGroupConfig?.findIndex(g => g == dataObject);
          //         if (indexData != -1) {
          //           this.listGroupbox[index].DataGroupConfig.splice(indexData, 1);;
          //         }
          //       }
          //       this.listGroupbox[index].DataGroupConfig = AmisCommonUtils.cloneDataArray(this.listGroupbox[index].DataGroupConfig);
          //     }
          //   }
          // }

        }
        // Sửa
        else if (data?.ContextMenu === ContextMenu.Edit) {
          this.showFormEditDataGrid(data);
        }
      }
    }
  }


  /**
   * Sự kiện click vào một dòng show chi tiết
   * nmduy thêm biến mặc định 
   * @param {any} e
   * @memberof AmisControlFormGroupComponent
   */
  onClickRow(e, isViewOnly = false) {
    const dataObject = e?.key;

    if (dataObject) {

      this.objectDataGrid = dataObject;

      // Lấy index của object trong list data hiện tại
      if (this._formMode === FormMode.Insert || this._formMode === FormMode.Duplicate) {
        this.indexData = this.groupbox.DataGroupConfig?.findIndex(e => e.IndexGrid === dataObject.IndexGrid);
      } else {
        if (!this.checkPermissionAction(PermissionCode.View, PermissionCode.View)) {
          return;
        }
        this.indexData = this.groupbox.DataGroupConfig?.findIndex(e => e[this.groupbox.FieldID] == dataObject[this.groupbox.FieldID]);
      }

      if (this.indexData != -1) {

        const obj = AmisCommonUtils.cloneData(this.groupbox);

        this.titleFormGrid = obj.GroupConfigName;

        let dataCloneAndChangeField = this.setDataBeforeShowForm();

        const masterIDField = obj.MappingConfigs?.length ? obj.MappingConfigs[0].DetailField : null;
        this.masterIDField = masterIDField;

        // Gọi sang phân hệ khác
        if (obj.SubsystemCodeGroup) {

          this.lazyLoadForm({
            Controller: obj.TableName,
            SubSystemCode: obj.SubsystemCodeGroup,
            FormMode: FormMode.View,
            Title: this.titleFormGrid,
            IsCallAPIInit: true,
            IsCallAPISave: true,
            GroupConfig: obj,
            IsDisplayHeader: true,
            MasterIDValue: this.masterIDValue,
            ObjectID: dataObject[obj.FieldID],
            DataCloneAndChangeField: dataCloneAndChangeField,
            TypeForm: TypeFormGrid.UseOtherForm,
            Data: this.objectDataGrid,
            PermissionCode: this._typeShow.PermissionCode,
            PermissionSystemCode: this._typeShow.SubSystemCode,
            IsIgnorePermission: this._typeShow.IsInorgeSubSuystem,
            IsViewOnly: isViewOnly ? true : this.isViewOnly,
            CallFromEmployeeApp: this.isCallFromEmployeeApp
          })

        }
        // Sử dụng luôn các trường groupo field config
        else {

          obj.GroupType = GroupType.Field;
          obj.IsChild = false;
          obj.IsNotSetChild = true;
          let listGroup = [];
          listGroup.push(obj);
          const listGroupConfigs = AmisCommonUtils.cloneDataArray(GroupConfigUtils.GetData(listGroup));

          // Set value
          listGroupConfigs.forEach(t => {
            t.DataGroupConfig = [];
            t.IsExpand = null;
            t.IsShowExpand = true;
            if (t?.GroupFieldConfigs?.length) {
              t.GroupFieldConfigs.forEach(gf => {
                gf.Value = dataObject[gf.FieldName];
                gf.ValueText = dataObject[gf.DisplayField];
              })
            }
          })
          this.objectDataGrid.GroupConfigs = listGroupConfigs;

          if (this._formMode === FormMode.Insert || this._formMode === FormMode.Duplicate) {

            this.lazyLoadForm({
              Controller: obj.TableName,
              SubSystemCode: obj.SubsystemCode,
              Data: this.objectDataGrid,
              FormMode: FormMode.View,
              Title: this.titleFormGrid,
              IsCallAPIInit: false,
              IsCallAPISave: false,
              GroupConfig: obj,
              IsDisplayHeader: false,
              MasterIDField: masterIDField,
              MasterIDValue: this.masterIDValue,
              DataCloneAndChangeField: dataCloneAndChangeField,
              TypeForm: TypeFormGrid.UseGroupFieldConfig,
              DependentClones: this.DependentClones,
              DependentDatas: this.DependentDatas,
              DependentDictionaries: this.DependentDictionaries,
              ConfigValidates: this.ConfigValidates,
              IsIgnorePermission: true,
              IsViewOnly: isViewOnly ? true : this.isViewOnly,
              CallFromEmployeeApp: this.isCallFromEmployeeApp
            })

          } else {

            this.lazyLoadForm({
              Controller: obj.TableName,
              SubSystemCode: obj.SubsystemCode,
              Data: this.objectDataGrid,
              FormMode: FormMode.View,
              Title: this.titleFormGrid,
              IsCallAPIInit: false,
              IsCallAPISave: true,
              GroupConfig: obj,
              IsDisplayHeader: false,
              MasterIDField: masterIDField,
              MasterIDValue: this.masterIDValue,
              DataCloneAndChangeField: dataCloneAndChangeField,
              TypeForm: TypeFormGrid.UseGroupFieldConfig,
              DependentClones: this.DependentClones,
              DependentDatas: this.DependentDatas,
              DependentDictionaries: this.DependentDictionaries,
              ConfigValidates: this.ConfigValidates,
              PermissionCode: this._typeShow.PermissionCode,
              PermissionSystemCode: this._typeShow.SubSystemCode,
              IsIgnorePermission: this._typeShow.IsInorgeSubSuystem,
              IsViewOnly: isViewOnly ? true : this.isViewOnly,
              CallFromEmployeeApp: this.isCallFromEmployeeApp
            })

          }

        }

      }
    }
  }


  /**
   * Đóng form xóa
   * @param {any} e
   * @memberof AmisControlFormGroupComponent
   * created by vhtruong - 26/05/2020
   */
  closePopupDelete(e) {
    this.isShowDeleteDataGrid = false;
  }

  /**
   * Xác nhận xóa
   * @param {any} e
   * @memberof AmisControlFormGroupComponent
   * created by vhtruong - 26/05/2020
   */
  deleteDataGrid(e) {
    this.isShowDeleteDataGrid = false;

    this.amisTransferSV.showLoading("", this.positionFormDataGrid);

    var data = [];
    data = data.concat(this.dataDelete.Data?.SelectedRow);
    if (data?.length) {
      data.forEach(element => {
        element.State = FormMode.Delete;
      });
      this.amisDataService.delete(this.groupbox.TableName, data).subscribe(res => {
        this.amisTransferSV.hideLoading();
        if (res?.Success) {
          this.amisTransferSV.showSuccessToast(this.amisTranslateSV.getValueByKey("DELETE_SUCCESS"));
          for (let i = 0; i < data.length; i++) {
            const element = data[i];
            let indexData = this.groupbox.DataGroupConfig?.findIndex(g => g[this.groupbox.FieldID] == element[this.groupbox.FieldID]);
            if (indexData != -1) {
              this.isChangedData = true;
              this.groupbox.DataGroupConfig.splice(indexData, 1);
              this.groupbox.DataGroupConfig = AmisCommonUtils.cloneDataArray(this.groupbox.DataGroupConfig);
            }
          }
          return;
        }
        this.amisTransferSV.showErrorToast();
      }, error => {
        console.log(error);
        this.amisTransferSV.hideLoading();
        this.amisTransferSV.showErrorToast();
      })
    }
  }

  /**
   * show form xóa
   * @param {any} e
   * @memberof AmisControlFormGroupComponent
   * created by vhtruong - 26/05/2020
   */
  showPopupDeleteDataGrid(e) {
    if (!this.checkPermissionAction(PermissionCode.Delete)) {
      return;
    }
    if (e) {
      this.dataDelete = e;
      const group = this.dataDelete.GroupConfig;
      this.contentPopupDelete = `Bạn có chắc chắn muốn xóa dữ liệu <strong>${group?.GroupConfigName}</strong> đã chọn hay không?`
      this.isShowDeleteDataGrid = true;
    }
  }

  /**
   * Load form trường hợp sử dụng layout khác
   * @param {any} data
   * @memberof AmisControlFormGroupComponent
   */
  async lazyLoadForm(data) {
    const { AmisLayoutFormGroupViewModule } = await import('src/common/components/amis-layout/amis-layout-group-form/amis-layout-form-group-view/amis-layout-form-group-view.module');
    this.formGrid?.clear();
    const compFactory = this.componentFactoryResolver.resolveComponentFactory(AmisLayoutFormGroupViewModule.components.form);
    const { instance: componentInstance } = this.formGrid.createComponent(compFactory, undefined, this.injector);
    componentInstance.controller = data.Controller;
    componentInstance.subSystemCode = data.SubSystemCode;
    componentInstance.titleForm = data.Title;
    componentInstance.positionFormDataGrid = this.positionFormDataGrid;
    componentInstance.inputParam = {
      DependentClones: data.DependentClones,
      DependentDatas: data.DependentDatas,
      DependentDictionaries: data.DependentDictionaries,
      ConfigValidates: data.ConfigValidates,
      IsCallAPIInit: data.IsCallAPIInit,
      IsCallAPISave: data.IsCallAPISave,
      GroupConfig: data.GroupConfig,
      IsDisplayHeader: data.IsDisplayHeader,
      FormMode: data.FormMode,
      IDValue: data.IDValue,
      MasterIDValue: data.MasterIDValue,
      MasterIDField: data.MasterIDField,
      ObjectData: data.Data,
      ObjectID: data.ObjectID,
      DataCloneAndChangeField: data.DataCloneAndChangeField,
      TypeForm: data.TypeForm,
      PermissionCode: data.PermissionCode,
      PermissionSystemCode: data.PermissionSystemCode,
      IsIgnorePermission: data.IsIgnorePermission,
      IsViewOnly: data.IsViewOnly,
      CallFromEmployeeApp: data.CallFromEmployeeApp
    }
    componentInstance.visibleForm = true;
    componentInstance.afterCancel.pipe(takeUntil(componentInstance._onDestroySub)).subscribe(this.cancelFormLazyLoad.bind(this));
    componentInstance.afterSaveSuccess.pipe(takeUntil(componentInstance._onDestroySub)).subscribe(this.saveSuccessFormLazyLoad.bind(this));
    componentInstance.afterClose.pipe(takeUntil(componentInstance._onDestroySub)).subscribe(this.closeFormLazyLoad.bind(this));
  }


  /**
   *
   * @memberof AmisControlFormGroupComponent
   */
  cancelFormLazyLoad(e?) {
    if (e?.IsReloadData) {
      this.reloadDataGrid();
    }
    this.formGrid?.clear();
  }

  /**
   *
   * @memberof AmisControlFormGroupComponent
   */
  closeFormLazyLoad(e?) {
    if (e?.IsReloadData) {
      this.reloadDataGrid();
    }
    this.formGrid?.clear();
  }


  /**
   *
   * @param {any} event
   * event dạng:
   * {
   *   FormMode
   *   Data
   *   Object
   * }
   * @memberof AmisControlFormGroupComponent
   */
  saveSuccessFormLazyLoad(event) {
    if (event) {
      if (event.IsReloadData) {
        this.reloadDataGrid();
        switch (event.FormModeSaveData) {
          case FormMode.Insert:
            this.closeFormLazyLoad();
            break;
          case FormMode.SaveAndInsert:
            return;
            break;
          case FormMode.Update:
            this.closeFormLazyLoad();
            break;
        }
      } else {
        switch (event.FormModeSaveData) {
          case FormMode.Insert:
            if (event.Data) {
              this.objectDataGrid = event.Data;
              this.saveDataGrid(event);
            }
            this.closeFormLazyLoad();
            break;
          case FormMode.SaveAndInsert:
            if (event.Data) {
              this.objectDataGrid = event.Data;
              this.saveDataGrid(event);
            }
            break;
          case FormMode.Update:
            if (event.Data) {
              this.objectDataGrid = event.Data;
              this.saveDataGrid(event);
            }
            this.closeFormLazyLoad();
            break;
        }
      }
    }
  }


  /**
   * Load lại dữ liệu data grid
   * @memberof AmisControlGroupGridComponent
   * created by vhtruong - 13/07/2020
   */
  reloadDataGrid() {
    this.amisDataService.getDataByGroupConfig({
      GroupConfigID: this.groupbox.GroupConfigID,
      MasterValue: this.masterIDValue,
      SubsystemCode: this.groupbox.SubsystemCode
    }).subscribe(res => {
      if (res?.Success && res.Data) {
        this.groupbox.DataGroupConfig = AmisCommonUtils.cloneDataArray(res.Data.DataGroupConfig)
      }
    })
  }

  //#region xử lý sự kiện trên grid


  /**
 * Bỏ chọn bản ghi
 * Created by: nmduy  13-05-2020
 */
  removeSelectedRecord() {
    this.pagingGrid.grid.instance.deselectAll();
    this.selectedData = [];
  }

  /**
* select phần tử trong grid
* created by nmduy  - 12/05/2020
*/
  chooseRecord(data) {
    let listID = this.selectedData.map(e => e[this.groupbox.FieldID]);
    if (data.currentSelectedRowKeys.length != 0) {
      data.currentSelectedRowKeys.forEach(element => {
        if (listID.indexOf(element[this.groupbox.FieldID]) < 0) {
          this.selectedData.push(element);
        }
      });
    }
    if (data.currentDeselectedRowKeys.length != 0) {
      let deleteID = data.currentDeselectedRowKeys.map(e => e[this.groupbox.FieldID]);
      this.selectedData.forEach(ele => {
        if (deleteID.indexOf(ele[this.groupbox.FieldID]) > -1) {
          this.selectedData = this.selectedData.filter(e => e[this.groupbox.FieldID] != ele[this.groupbox.FieldID]);
        }
      });
    }
  }


  /**
   * click thao tác option trên grid
   * nmduy 30/06/2020
   */
  onClickHeaderMenuItem(item) {
    if (item.SubSystemCode && item.PermissionCode) {
      if (!this.checkPermission(item.SubSystemCode, item.PermissionCode)) {
        return;
      }
    }
    switch (item.Key) {
      case ContextMenu.Delete:
        const obj: any = {};
        obj.SelectedRow = this.selectedData;
        obj.ContextMenu = ContextMenu.Delete;
        this.eventItemInGrid({
          Data: obj,
          GroupConfig: this.groupbox
        });
        break;
      case ContextMenu.CreateDocument:
        this.onCreateDocument(this.selectedData);
        break;
      default:
        break;
    }
  }

  /**
   * click vào option trên context menu grid
   * nmduy 30/06/2020
   */
  onClickContextMenuOption(data) {
    if (data.ContextMenu == ContextMenu.CreateDocument) {
      this.onCreateDocument([data.SelectedRow]);
    }
  }


  /**
   * Click chọn option tạo văn bản
   * nmduy 30/06/2020
   */
  onCreateDocument(data) {
    this.transferDataSV.showPopupCreateDocument(data, { DocumentType: DocumentType.AppendixContract });
  }


  //#endregion


  /**
   * Kiểm tra quyền cos action
   * @returns 
   * @memberof AmisControlGroupGridComponent
   */
  checkPermissionAction(actionCode, permissionCode = this._typeShow.PermissionCode) {
    const me = this;
    if (!HRMPermissionUtils.checkPermissionUserInListPermission(this._typeShow.SubSystemCode, permissionCode, actionCode, this.groupbox.PermissionConfigObject)) {
      me.amisTransferSV.showWarningToast(me.amisTranslateSV.getValueByKey("VALIDATION_NOT_PERMISSION"));
      return false;
    }
    return true;
  }

  /**
   * Kiểm tra quyền 
   * @returns 
   * @memberof AmisControlGroupGridComponent
   */
  checkPermission(subSystemCode, permissionCode) {
    const me = this;
    if (!HRMPermissionUtils.checkPermissionUser(subSystemCode, permissionCode)) {
      me.amisTransferSV.showWarningToast(me.amisTranslateSV.getValueByKey("VALIDATION_NOT_PERMISSION"));
      return false;
    }
    return true;
  }
}

import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, Injector, AfterViewInit } from '@angular/core';
import { GroupConfig } from 'src/app/shared/models/group-config/group-config';
import { DependenDictionary } from 'src/app/shared/models/field-dependancy/field-dependancy';
import { DependentData } from 'src/app/shared/models/dependent-data/dependent-data';
import { DependentClone } from 'src/app/shared/models/dependent-clone/dependent-clone';
import { ConfigValidate } from 'src/app/shared/models/config-validate/config-validate';
import { ContextMenu } from 'src/app/shared/enum/context-menu/context-menu.enum';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { BaseComponent } from '../../base-component';
import { LayoutConfig } from 'src/app/shared/models/layout-config/layout-config';
import * as _ from "lodash";
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { TypeControl } from 'src/app/shared/enum/common/type-control.enum';
import { AvatarService } from 'src/app/services/user/avatar.service';
import { takeUntil } from 'rxjs/operators';
import { TypeFormGrid } from 'src/app/shared/enum/form-grid/type-form-grid.enum';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { GroupType } from 'src/app/shared/enum/group-config/group-type.enum';
import { GroupConfigUtils } from 'src/app/shared/function/group-control-utils';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { ColumnGroup } from 'src/app/shared/enum/group-config/column-group.enum';
import { AmisPagingGridComponent } from '../../amis-grid/amis-paging-grid/amis-paging-grid.component';
import { ApproveProfileUpdateEnum } from 'src/common/enum/approve-profile-update.enum';
import { EmployeeSelfService } from 'src/app/services/employee-myself/employee-self.service';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { PermissionCode } from 'src/app/shared/constant/permission-code/permission-code';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { Observable } from 'rxjs';
import { SessionStorageUtils } from 'src/common/fn/session-storage-utils';
import { CacheKey } from 'src/app/shared/constant/cache-key/cache-key';
@Component({
  selector: 'amis-amis-control-compare-group-grid',
  templateUrl: './amis-control-compare-group-grid.component.html',
  styleUrls: ['./amis-control-compare-group-grid.component.scss']
})
export class AmisControlCompareGroupGridComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('pagingGrid', { static: true })
  pagingGrid: AmisPagingGridComponent;

  @ViewChild('formGrid', { read: ViewContainerRef, static: true })
  formGrid: ViewContainerRef

  _groupConfig: GroupConfig = new GroupConfig();
  @Input() set groupConfig(data) {
    if (data) {
      this._groupConfig = data;
      this._title = this._groupConfig.GroupConfigName;
      this.processDataForBindingGrid(this._groupConfig.GroupFieldConfigs);
    }
  }

  @Input() layoutConfig: LayoutConfig

  _currentData = [];
  @Input() set currentData(data) {
    if (data) {
      this._currentData = data;
    }
  }

  _masterIDValue
  @Input() set masterIDValue(data) {
    if (data) {
      this._masterIDValue = data
    }
  }

  _updateData = [];
  @Input() set updateData(data) {
    if (data) {
      this._updateData = data;
      this.removeSelectedRecord();
    }
  }

  _employeeSelfServiceData = []
  @Input() set employeeSelfServiceData(data) {
    if (data) {
      this._employeeSelfServiceData = data;
    }
  }
  _title = "";


  // Danh sách option trong viewmore 3 chấm
  contextMenuList = [
    {
      Key: ContextMenu.Edit,
      Text: "Sửa",
      Icon: 'icon-edit',
      Class: "",
      ClassDisable: ""
    },
    {
      Key: ContextMenu.RejectUpdateProfile,
      Text: "Từ chối",
      Icon: 'icon-reject-red',
      Class: "",
      ClassDisable: ""
    },
    {
      Key: ContextMenu.ApproveUpdateProfile,
      Text: "Duyệt",
      Icon: 'icon-accept-green',
      Class: "",
      ClassDisable: ""
    }
  ]


  selectedData = [];

  gridColumns = [];


  // Hiển thị lí do từ chối
  visibleRejectReason = false;

  rejectType;

  rejectReason = "";

  currentRow;

  visibleApproveReason = false;

  visiblePopoverInstruc = false;

  constructor(
    private dataSV: AmisDataService,
    private avatarSV: AvatarService,
    public readonly componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private translateSV: AmisTranslationService,
    private employeeSelfService: EmployeeSelfService,
    private tranferSV: TransferDataService,
    private amisTranferSV: AmisTransferDataService
  ) {
    super();
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    setTimeout(() => {

      this.pagingGrid.grid.onEditorPreparing.subscribe(e => {
        if (e.row?.data?.State == FormMode.None || !e.row?.data?.State ) {
          e.editorOptions.disabled = true;
          e.row.cells[0].cellElement.querySelector(".icon-optional-more").style.display = "none"
        }
      })

    }, 100);

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
        if (AmisCommonUtils.IsArray(this._currentData)) {
          this._currentData.forEach(k => {
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

  onShowContextMenu(e) {
    const data = e.SelectedRow.key;
    if (data?.State != FormMode.None) {
      this.contextMenuList.forEach(e => e.ClassDisable = "")
    }
    else {
      this.contextMenuList.forEach(e => e.ClassDisable = "disable")
    }
  }

  /**
   * Sự kiện click ba chấm đầu dòng
   *
   * @param {any} e
   * @memberof AmisControlCompareGroupGridComponent
   * CREATED: PTSY
   */
  contextMenuAction(e) {
    if (e.Key == ContextMenu.Edit) {
      this.loadLayoutConfig().subscribe(data => {
        if (data) {
          this.editAction(e.Data);
        }
      })
    }

    else if (e.Key == ContextMenu.ApproveUpdateProfile) {
      this.approveUpdateProfile(e.Data);
    }
    else {
      this.rejectUpdateProfile(e.Data);
    }
  }

  /**
   * Phee duyệt cập nhật
   *
   * @param {any} data
   * @memberof AmisControlCompareGroupRowComponent
   */
  approveUpdateProfile(data) {

    this.rejectType = ApproveProfileUpdateEnum.OneField;
    this.visibleApproveReason = true;

    this.currentRow = data;


  }

  /**
   * Từ chối cập nhật
   *
   * @param {any} data
   * @memberof AmisControlCompareGroupRowComponent
   */
  rejectUpdateProfile(data) {

    this.rejectType = ApproveProfileUpdateEnum.OneField;
    this.visibleRejectReason = true;
    this.currentRow = data;

  }

  /** */
  removeSelectedRecord() {
    this.pagingGrid?.grid?.instance?.deselectAll();
    this.selectedData = [];
  }

  /**
   * Reject nhiều
   *
   * @memberof AmisControlCompareGroupGridComponent
   */
  rejectUpdateEmployeeInGrid() {

    this.rejectType = ApproveProfileUpdateEnum.OneGroup;
    this.visibleRejectReason = true;

  }

  /**
   * Chấp thuận nhiều
   *
   * @memberof AmisControlCompareGroupGridComponent
   */
  approveUpdateEmployeeInGrid() {
    this.rejectType = ApproveProfileUpdateEnum.OneGroup;
    this.visibleApproveReason = true;
  }

  /**
   * Chọn bản ghi trên grid
   *
   * @param {any} e
   * @memberof AmisControlCompareGroupGridComponent
   *
   */
  chooseRecord(data) {
    let listID = this.selectedData.map(e => e[this._groupConfig.FieldID]);
    if (data.currentSelectedRowKeys.length != 0) {
      data.currentSelectedRowKeys.forEach(element => {
        if (listID.indexOf(element[this._groupConfig.FieldID]) < 0) {
          this.selectedData.push(element);
        }
        if (element.State == FormMode.None || !element.State) {
          data.component.deselectRows(element);
        }
      });
    }
    if (data.currentDeselectedRowKeys.length != 0) {
      let deleteID = data.currentDeselectedRowKeys.map(e => e[this._groupConfig.FieldID]);
      // this.selectedData.forEach(ele => {
      //   if (deleteID.indexOf(ele[this._groupConfig.FieldID]) > -1) {
      //     this.selectedData = this.selectedData.filter(e => e[this._groupConfig.FieldID] != ele[this._groupConfig.FieldID]);
      //   }
      // });
      if (deleteID?.length) {
        deleteID.forEach(e => {

          this.selectedData.splice(this.selectedData.findIndex(d => {
            d[this._groupConfig.FieldID] == e
          }), 1);
        })
      }
    }
  }

  /**
   * Sự kiện edit
   *
   * @param {any} data
   * @memberof AmisControlCompareGroupGridComponent
   * CREATED: PTSY 22/9/2020
   */
  editAction(data) {
    if (data.State != FormMode.None && data.State) {



      const dataObject = data;

      this.currentRow = data;

      const obj = AmisCommonUtils.cloneData(this._groupConfig);

      obj.ColumnGroup = ColumnGroup.TwoCol;

      const titleFormGrid = this.translateSV.getValueByKey("EDIT2") + " " + obj.GroupConfigName.toLocaleLowerCase();

      const masterIDField = obj.MappingConfigs?.length ? obj.MappingConfigs[0].DetailField : null;



      // Gọi sang phân hệ khác
      if (obj.SubsystemCodeGroup) {

        this.lazyLoadForm({
          Controller: obj.TableName,
          SubSystemCode: obj.SubsystemCodeGroup,
          FormMode: FormMode.Update,
          Title: titleFormGrid,
          IsCallAPIInit: true,
          IsCallAPISave: false,
          GroupConfig: obj,
          IsDisplayHeader: true,
          MasterIDValue: masterIDField,
          ObjectID: dataObject[obj.FieldID],
          DataCloneAndChangeField: null,
          TypeForm: TypeFormGrid.UseOtherForm,
          Data: dataObject,
          PermissionCode: null,
          PermissionSystemCode: null,
          IsIgnorePermission: true,
          IsViewOnly: false
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
              // bind lại field name
              if (gf.TmpFieldName) {
                gf.FieldName = gf.TmpFieldName;
              }
              gf.Value = dataObject[gf.FieldName];
              gf.ValueText = dataObject[gf.DisplayField];
            })
          }
        })
        dataObject.GroupConfigs = listGroupConfigs;

        this.lazyLoadForm({
          Controller: obj.TableName,
          SubSystemCode: obj.SubsystemCode,
          Data: dataObject,
          FormMode: FormMode.Update,
          Title: titleFormGrid,
          IsCallAPIInit: false,
          IsCallAPISave: false,
          GroupConfig: obj,
          IsDisplayHeader: false,
          MasterIDField: masterIDField,
          MasterIDValue: this._masterIDValue,
          DataCloneAndChangeField: null,
          TypeForm: TypeFormGrid.UseGroupFieldConfig,
          DependentClones: null,
          DependentDatas: this.layoutConfig.DependentDatas,
          DependentDictionaries: this.layoutConfig.DependentDictionaries,
          ConfigValidates: this.layoutConfig.ConfigValidates,
          PermissionCode: null,
          PermissionSystemCode: null,
          IsIgnorePermission: true,
          IsViewOnly: false

        })



      }
    }
    else {

    }
  }

  /**
   * Layzy load form
   *
   * @param {any} data
   * @memberof AmisControlCompareGroupGridComponent
   */
  async lazyLoadForm(data) {
    const { CompareGroupGridLayoutEditModule } = await import('./compare-group-grid-layout-edit/compare-group-grid-layout-edit.module');
    this.formGrid?.clear();

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(CompareGroupGridLayoutEditModule.components.form)

    const { instance: componentInstance } = this.formGrid.createComponent(componentFactory, null, this.injector);

    componentInstance.controller = data.Controller;
    componentInstance.subSystemCode = data.SubSystemCode;
    componentInstance.titleForm = data.Title;
    componentInstance.positionFormDataGrid = 'hrm-profile-approve';
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
      IsViewOnly: data.IsViewOnly
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
   * Sau khi bấm lưu
   *
   * @param {any} e
   * @memberof AmisControlCompareGroupGridComponent
   */
  saveSuccessFormLazyLoad(e) {
    if (e.FormModeSaveData == FormMode.Update) {
      const id = e.Data.EmployeeSelfServicesID;
      let dataUpdate = e.Data;
      const data = this._employeeSelfServiceData.find(e => e.EmployeeSelfServiceID == id);
      dataUpdate.State = data.ModelState;
      const objCompare = {};
      if (data.ModelState == FormMode.Update) {
        const idObj = JSON.parse(data.Data)[this._groupConfig.FieldID];

        const objectCurrent = this._currentData.find(e => e[this._groupConfig.FieldID] == idObj);


        Object.getOwnPropertyNames(objectCurrent).forEach(e => {
          if (dataUpdate[e] != objectCurrent[e]) {
            objCompare[e] = dataUpdate[e];
          }
        });

        objCompare["State"] = 2;
        objCompare[this._groupConfig.FieldID] = idObj;
        dataUpdate = objCompare;
      }




      data.Data = JSON.stringify(dataUpdate);
      const param = {
        EmployeeSelfService: data
      };

      this.employeeSelfService.updateDataSelf(param).subscribe(data => {
        if (data?.Success) {
          this.tranferSV.updateApproveData({ Data: param.EmployeeSelfService, Type: "UpdateGrid" });
        }
        else if (data?.ValidateInfo?.length) {

        }
        else {

        }
      },
        err => {

        });
    }
    else if (e.FormModeSaveData == FormMode.SaveAndInsert) {
      const id = e.Data.EmployeeSelfServicesID;
      const data = this._employeeSelfServiceData.find(e => e.EmployeeSelfServiceID == id);
      data.Data = JSON.stringify(e.Data);

      const param = {
        EmployeeSelfServices: [data],
        PushNotificationType: ApproveProfileUpdateEnum.OneField
      }
      this.employeeSelfService.approveEmployeeUpdate(param).subscribe(data => {
        if (data?.Success) {
          this.tranferSV.updateApproveData({ Data: param.EmployeeSelfServices, Type: "Approve" });
        }
        else if (data?.ValidateInfo?.length) {

        }
        else {

        }
      },
        err => {

        });
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

  reloadDataGrid() {

  }



  /**
   * Đóng popup lí do
   *
   * @memberof AmisControlCompareGroupRowComponent
   */
  onHidden() {
    this.visibleRejectReason = false;
    this.rejectReason = "";
  }


  /**
   * Click loại
   *
   * @memberof AmisControlCompareGroupRowComponent
   */
  onClickReject() {
    if (this.rejectType == ApproveProfileUpdateEnum.OneGroup) {

      const listID = this.selectedData.map(v => v.EmployeeSelfServicesID);
      const param = {
        EmployeeSelfServices: this._employeeSelfServiceData.filter(e => listID.includes(e.EmployeeSelfServiceID)),
        PushNotificationType: ApproveProfileUpdateEnum.OneGroup
      }

      param.EmployeeSelfServices.forEach(e => e.Reason = this.rejectReason)
      this.employeeSelfService.rejectEmployeeUpdate(param).subscribe(data => {
        if (data?.Success) {
          this.tranferSV.updateApproveData({ Data: param.EmployeeSelfServices, Type: "Approve" });
          this.onHidden();
          this.amisTranferSV.showSuccessToast(this.translateSV.getValueByKey("HRM_PROFILE_REJECT_SUCCESS"))
        }
        else if (data?.ValidateInfo) {
          this.amisTranferSV.showErrorToast(this.translateSV.getValueByKey(data.ValidateInfo[0].ErrorMessage))
        }
        else {
          this.amisTranferSV.showErrorToast()
        }
      },
        err => {
          this.amisTranferSV.showErrorToast()
        });
    }
    else if (this.rejectType == ApproveProfileUpdateEnum.OneField) {

      const id = this.currentRow?.EmployeeSelfServicesID;

      const param = {
        EmployeeSelfServices: [this._employeeSelfServiceData.find(e => e.EmployeeSelfServiceID == id)],
        PushNotificationType: ApproveProfileUpdateEnum.OneField
      }
      param.EmployeeSelfServices.forEach(e => e.Reason = this.rejectReason)
      this.employeeSelfService.rejectEmployeeUpdate(param).subscribe(data => {
        if (data?.Success) {
          this.tranferSV.updateApproveData({ Data: param.EmployeeSelfServices, Type: "Approve" });
          this.onHidden();
          this.amisTranferSV.showSuccessToast(this.translateSV.getValueByKey("HRM_PROFILE_REJECT_SUCCESS"))
        }
        else if (data?.ValidateInfo) {
          this.amisTranferSV.showErrorToast(this.translateSV.getValueByKey(data.ValidateInfo[0].ErrorMessage))
        }
        else {
          this.amisTranferSV.showErrorToast();
        }
      },
        err => {
          this.amisTranferSV.showErrorToast();
        });
    }
  }

  focusOutFieldReject(e) {
    if (e) {

      this.rejectReason = e;
    }
  }

  /**
   * Đóng popup approve confirm
   *
   * @memberof AmisControlCompareGroupGridComponent
   */
  onHiddenPopupAprove() {
    this.visibleApproveReason = false;
  }

  /**
   * Click approve trên popup
   *
   * @memberof AmisControlCompareGroupGridComponent
   */
  onClickApprove() {
    if (this.rejectType == ApproveProfileUpdateEnum.OneField) {
      const id = this.currentRow?.EmployeeSelfServicesID;
      const param = {
        EmployeeSelfServices: [this._employeeSelfServiceData.find(e => e.EmployeeSelfServiceID == id)],
        PushNotificationType: ApproveProfileUpdateEnum.OneField
      }
      this.employeeSelfService.approveEmployeeUpdate(param).subscribe(data => {
        if (data?.Success) {
          this.tranferSV.updateApproveData({ Data: param.EmployeeSelfServices, Type: "Approve" });
          this.amisTranferSV.showSuccessToast(this.translateSV.getValueByKey("HRM_PROFILE_APPROVE_SUCCESS"))
          this.onHiddenPopupAprove();
        }
        else if (data?.ValidateInfo) {
          this.amisTranferSV.showErrorToast(data.ValidateInfo[0].ErrorMessage)
        }
        else {
          this.amisTranferSV.showErrorToast()
        }
      }, err => {
        this.amisTranferSV.showErrorToast()
      });
    }
    else {
      const listID = this.selectedData.map(v => v.EmployeeSelfServicesID);
      const param = {
        EmployeeSelfServices: this._employeeSelfServiceData.filter(e => listID.includes(e.EmployeeSelfServiceID)),
        PushNotificationType: this._employeeSelfServiceData.filter(e => listID.includes(e.EmployeeSelfServiceID)).length > 1 ? ApproveProfileUpdateEnum.OneGroup : ApproveProfileUpdateEnum.OneField
      }

      this.employeeSelfService.approveEmployeeUpdate(param).subscribe(data => {
        if (data?.Success) {
          this.tranferSV.updateApproveData({ Data: param.EmployeeSelfServices, Type: "Approve" });
          this.amisTranferSV.showSuccessToast(this.translateSV.getValueByKey("HRM_PROFILE_APPROVE_SUCCESS"))
          this.onHiddenPopupAprove();
        }
        else if (data?.ValidateInfo) {
          this.amisTranferSV.showErrorToast(data.ValidateInfo[0].ErrorMessage)
        }
        else {
          this.amisTranferSV.showErrorToast()
        }
      },
        err => {

        });
    }
  }

  /**
   * Lấy dữ liệu lauout config
   *
   * @memberof AmisControlCompareGroupGridComponent
   *
   */
  loadLayoutConfig(): Observable<any> {
    return new Observable((noti) => {
      const layoutJSON = SessionStorageUtils.get(CacheKey.EmployeeSelfServiceLayout);
      if (layoutJSON && layoutJSON != "null") {
        this.layoutConfig = JSON.parse(layoutJSON);
        noti.next(true);
      }
      else {
        this.employeeSelfService.getLayoutConfig().subscribe(data => {
          if (data?.Success) {
            this.layoutConfig = data.Data
            SessionStorageUtils.set(CacheKey.EmployeeSelfServiceLayout, JSON.stringify(data.Data));
            noti.next(true);
          }
          else {
            noti.next(false);
          }
        })
      }
    })

  }
}

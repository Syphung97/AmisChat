import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { TypeControl } from 'src/app/shared/enum/common/type-control.enum';
import { AvatarService } from 'src/app/services/user/avatar.service';
import { BaseComponent } from '../../base-component';
import { ContextMenu } from 'src/app/shared/enum/context-menu/context-menu.enum';
import { DxDataGridComponent } from 'devextreme-angular'
import * as _ from "lodash";
import { GroupConfig } from 'src/app/shared/models/group-config/group-config';
import { LayoutConfig } from 'src/app/shared/models/layout-config/layout-config';
import { EmployeeSelfService } from 'src/app/services/employee-myself/employee-self.service';
import { ApproveProfileUpdateEnum } from 'src/common/enum/approve-profile-update.enum';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { Observable } from 'rxjs';
import { GroupFieldConfig } from 'src/app/shared/models/group-field-config/group-field-config';
import { SessionStorageUtils } from 'src/common/fn/session-storage-utils';
import { CacheKey } from 'src/app/shared/constant/cache-key/cache-key';

@Component({
  selector: 'amis-amis-control-compare-group-row',
  templateUrl: './amis-control-compare-group-row.component.html',
  styleUrls: ['./amis-control-compare-group-row.component.scss']
})
export class AmisControlCompareGroupRowComponent extends BaseComponent implements OnInit {

  _title = "";

  typeControl = TypeControl;
  // Biến lưu id grid
  @ViewChild('grid', { static: false })
  pagingGrid: DxDataGridComponent;

  _groupConfig: GroupConfig;
  @Input() set groupConfig(data) {
    if (data) {
      this._groupConfig = data;
      this._title = this._groupConfig.GroupConfigName;
    }
  }

  _dataSourceGrid = [];
  @Input() set dataSource(data) {
    if (data) {
      this._dataSourceGrid = data;
      this.setDataBeforeBinding();
    }
  }
  _groupFieldConfigs = []
  @Input() set groupFieldConfigs(data) {
    if (data) {
      this._groupFieldConfigs = data;
    }
  }

  // mảng các bản ghi được chọn trên grid
  selectedData = [];

  // Danh sách_ option trong viewmore 3 chấm
  contextMenuList = [
    {
      Key: ContextMenu.Edit,
      Text: "Sửa",
      Icon: 'icon-edit',
      Class: ""
    },
    {
      Key: ContextMenu.RejectUpdateProfile,
      Text: "Từ chối",
      Icon: 'icon-reject-red',
      Class: ""
    },
    {
      Key: ContextMenu.ApproveUpdateProfile,
      Text: "Duyệt",
      Icon: 'icon-accept-green',
      Class: ""
    }
  ]




  // Biến check hiển thị popover contexxt menu
  isContextMenuVisible: boolean = false;

  // target hiển thị popover contexxt menu
  popoverTarget: any;

  // bản ghi được chọn để hành xử context menu
  selectedRowItem: any;

  // Hiển thị popup update
  visiblePopupUpdate = false;

  // Hiển thị lí do từ chối
  visibleRejectReason = false;

  rejectType;

  rejectReason = "";

  currentRow;

  isContextPopoverAvatar = false;

  srcAvatar = "";

  popoverAvatarTarget;

  visibleApproveReason = false;

  layoutConfig;

  currentGroupFieldConfig: GroupFieldConfig;

  _titlePopupEdit = ";"

  dependentGroupFieldConfig: GroupFieldConfig;

  conflictFieldOnEdit = [];

  conflictFieldOnEditText = "";

  visiblePopupConflictDependent = false;
  constructor(
    public avatarSV: AvatarService,
    private employeeSelfService: EmployeeSelfService,
    private tranferSV: TransferDataService,
    private amisTranferSV: AmisTransferDataService,
    private translateSV: AmisTranslationService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  /**
   * Set object trước khi hiển thị
   * created by vhtruong - 17/06/2020
   */
  setDataBeforeBinding() {

    this._dataSourceGrid.forEach(d => {
      if (d.TypeControl == TypeControl.SelectHuman) {
        const id = d.CurrentValue.Value;
        if (id) {

          d.CurrentValue.Value = this.avatarSV.getAvatar(id, new Date());
        }

        const id2 = d.UpdateValue.Value
        if (id2) {

          d.UpdateValue.Value = this.avatarSV.getAvatar(id2, new Date());
        }
      }
      if (d.TypeControl == TypeControl.UploadImage) {
        const id = d.CurrentValue.Value;
        if (id) {

          d.CurrentValue.Value = this.avatarSV.getAvatar(id, new Date());
        }

        const id2 = d.UpdateValue.Value
        if (id2) {

          d.UpdateValue.Value = this.avatarSV.getAvatar(id2, new Date());
        }
      }
    });
  }
  catch(ex) {
    console.log(ex);

  }

  /**
   * Nhận sự kiện click vào dòng
   * created by vhtruong - 25/05/2020
   */
  clickOptions(e) {
  }

  /**
   * Sự kiện click vào một dòng show chi tiết
   */
  onClickRow(e) {
  }

  /**
   * Hành xử khi click menu item
   */
  contextMenuExecuteAction(e, key) {
    const objRowClick: any = {};
    objRowClick.Key = key;
    objRowClick.Data = this.selectedRowItem;
    this.isContextMenuVisible = false;

    if (key == ContextMenu.Edit) {
      this.loadLayoutConfig().subscribe(data => {
        if (data) {


          this.actionEdit(objRowClick);
        }
      })
    }
    else if (key == ContextMenu.ApproveUpdateProfile) {
      this.approveUpdateProfile(objRowClick)
    }
    else {
      this.rejectUpdateProfile(objRowClick)
    }

  }


  /**
   * Sự kiện edit row
   *
   * @param {any} objRowClick
   * @memberof AmisControlCompareGroupRowComponent
   */
  actionEdit(objRowClick) {

    const groupConfig = this.layoutConfig.ListGroupConfig.find(e => e.GroupConfigCode == this._groupConfig.GroupConfigCode);



    groupConfig.ListGroupConfigChild = this.layoutConfig.ListGroupConfig.filter(e1 => e1.GroupConfigParentID == groupConfig.GroupConfigID)

    groupConfig.ListGroupConfigChild.forEach(e => {
      groupConfig.GroupFieldConfigs.push(...e.GroupFieldConfigs);
    });
    this.currentGroupFieldConfig = groupConfig.GroupFieldConfigs?.find(e => e.FieldName == this.selectedRowItem?.DataUpdate?.FieldName);

    const dependentDictionaries = this.layoutConfig?.DependentDictionaries;
    const dependentDictionary = dependentDictionaries.find(e => {
      if (e.FieldName == this.currentGroupFieldConfig.FieldName) return e;
    });

    // Kieerm tra trong danh có trường bị phụ thuộc bởi trường sửa hay không
    if (dependentDictionary) {
      this.conflictFieldOnEdit = [];
      const dependentField = dependentDictionaries.filter(e => e.DependentField == dependentDictionary.FieldName);
      if (dependentField) {
        dependentField.forEach(e => {
          this._dataSourceGrid.forEach(e1 => {
            if (e.FieldName == e1.DataUpdate.FieldName) {
              this.conflictFieldOnEdit.push(e1.Caption);
            }
          })
        })
      }
    }

    if (dependentDictionary) {
      const dependentField = dependentDictionary.DependentField;

      let groupFieldConfigDependent;
      this.layoutConfig.ListGroupConfig.forEach(e => {
        e.GroupFieldConfigs.forEach(x => {
          if (x.FieldName == dependentField) {
            groupFieldConfigDependent = x;
          }
        })
      })

      this._dataSourceGrid.forEach(e => {
        if (e.DataUpdate.FieldName == dependentField) {
          groupFieldConfigDependent.Value = e.UpdateValue.Value;
          groupFieldConfigDependent.ValueText = e.UpdateValue.ValueText;
        }
      })

      if (!groupFieldConfigDependent.Value) {
        this._dataSourceGrid.forEach(e => {
          if (e.DataCurrent[dependentField]) {
            groupFieldConfigDependent.Value = e.DataCurrent[dependentField];
          }
        })
      }

      this.dependentGroupFieldConfig = groupFieldConfigDependent;
      this.dependentGroupFieldConfig.IsVisible = false;
      this.dependentGroupFieldConfig.IsUse = false;
      this.dependentGroupFieldConfig.IsReadOnly = true;
    }
    this._titlePopupEdit = objRowClick?.Data?.Caption;
    if (!this.conflictFieldOnEdit.length) {
      this.visiblePopupUpdate = true;

    }
    else {
      this.conflictFieldOnEditText = this.conflictFieldOnEdit.join(",")
      this.visiblePopupConflictDependent = true;
    }

  }

  /**
   * Phee duyệt cập nhật
   *
   * @param {any} data
   * @memberof AmisControlCompareGroupRowComponent
   */
  approveUpdateProfile(data) {
    this.currentRow = data;
    this.visibleApproveReason = true;
    this.rejectType = ApproveProfileUpdateEnum.OneField;

  }

  /**
   * Từ chối cập nhật
   *
   * @param {any} data
   * @memberof AmisControlCompareGroupRowComponent
   */
  rejectUpdateProfile(data) {
    this.currentRow = [data.Data]
    this.rejectType = ApproveProfileUpdateEnum.OneField;
    this.visibleRejectReason = true;
  }
  /**
   *
   */
  onCellClick(e) {

  }


  /**
   * tích chọn trên grid
   */
  selectedRowKeysChange(e) {
    if (e) {
      this.chooseRecord(e);
    }
  }

  /**
   * select phần tử trong grid
   */
  chooseRecord(data) {
    this.selectedData = data.selectedRowsData;
  }


  /**
   * Bỏ chọn bản ghi
   */
  removeSelectedRecord() {
    this.pagingGrid.instance.deselectAll();
    this.selectedData = [];
  }

  /**
   * click thao tác option trên grid
   */
  onClickHeaderMenuItem(item) {
    switch (item.Key) {
      case ContextMenu.Delete:
        break;
      case ContextMenu.CreateDocument:
        break;
      default:
        break;
    }
  }

  /**
   * Click vào nút 3 chấm đầu dòng show popup danh sách chức năng
   */
  onShowContextMenu(e, param) {
    e.stopPropagation();
    if (param.key.DataUpdate.FieldName == "UserID" || this.checkFieldReadOnly(param.key.DataUpdate.FieldName)) {
      this.contextMenuList[0].Class = "dis-none";
    }
    else {
      this.contextMenuList[0].Class = "";
    }
    if (!this.isContextMenuVisible) {
      const element = e.target;
      this.selectedRowItem = param.data;

      this.popoverTarget = element.parentElement;
      this.isContextMenuVisible = true;

    } else {
      this.isContextMenuVisible = false;
    }
  }

  /**
   * Kiểm tra có read only hay không
   *
   * @memberof AmisControlCompareGroupRowComponent
   */
  checkFieldReadOnly(fieldName) {
    let isReadOnly;
    this.loadLayoutConfig().subscribe(data => {
      if (data) {
        const groupConfig = this.layoutConfig.ListGroupConfig;
        for (let index = 0; index < groupConfig.length; index++) {
          const element = groupConfig[index];
          const groupFieldConfig = element.GroupFieldConfigs;
          for (let index = 0; index < groupFieldConfig.length; index++) {
            const element = groupFieldConfig[index];
            if (element.FieldName == fieldName) {
              isReadOnly = element.IsReadOnly;
              break;
            }
          }
          if (isReadOnly != undefined) break;
        }
      }
    })
    return isReadOnly;
  }

  /**
   * Phê duyệt một danh sách các trường
   */
  approveUpdateEmployeeInGrid() {
    this.rejectType = ApproveProfileUpdateEnum.OneGroup;
    this.visibleApproveReason = true;
  }

  /**
   * Từ chối một danh sách các trường
   */
  rejectUpdateEmployeeInGrid() {
    this.rejectType = ApproveProfileUpdateEnum.OneGroup;
    this.visibleRejectReason = true;
  }

  convert(e) {
    console.log(e);
  }

  /**
   * Xử lí khi focusout
   *
   * @param {any} $event
   * @memberof AmisControlCompareGroupRowComponent
   */
  focusOutFieldReject(event) {
    if (event) {

      this.rejectReason = event;
    }
  }

  /**
   * Click loại
   *
   * @memberof AmisControlCompareGroupRowComponent
   */
  onClickReject() {

    if (this.rejectType == ApproveProfileUpdateEnum.OneGroup) {
      this.selectedData.map(e => e.DataUpdate).forEach(d => {
        d.Reason = this.rejectReason;
      })
      const param = {
        EmployeeSelfServices: this.selectedData.map(e => e.DataUpdate),
        PushNotificationType: ApproveProfileUpdateEnum.OneGroup
      }
      this.employeeSelfService.rejectEmployeeUpdate(param).subscribe(data => {
        if (data?.Success) {
          this.tranferSV.updateApproveData({ Data: param.EmployeeSelfServices, Type: "Approve" });
          this.onHidden();
          this.amisTranferSV.showSuccessToast(this.translateSV.getValueByKey("HRM_PROFILE_REJECT_SUCCESS"));
        }
        else if (data?.ValidateInfo?.length) {
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
    else if (this.rejectType == ApproveProfileUpdateEnum.OneField) {
      this.currentRow.map(e => e.DataUpdate).forEach(d => {
        d.Reason = this.rejectReason;
      })
      const param = {
        EmployeeSelfServices: this.currentRow.map(e => e.DataUpdate),
        PushNotificationType: ApproveProfileUpdateEnum.OneField
      }

      this.employeeSelfService.rejectEmployeeUpdate(param).subscribe(data => {
        if (data?.Success) {
          this.tranferSV.updateApproveData({ Data: param.EmployeeSelfServices, Type: "Approve" });
          this.onHidden();
          this.amisTranferSV.showSuccessToast(this.translateSV.getValueByKey("HRM_PROFILE_REJECT_SUCCESS"))
        }
        else if (data?.ValidateInfo?.length) {
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
   * Hover vào avatar
   *
   * @param {any} data
   * @memberof AmisControlCompareGroupRowComponent
   */
  hoverAvatar(data) {
    this.srcAvatar = data.value.Value;
    this.isContextPopoverAvatar = true;
    this.popoverAvatarTarget = data.cellElement.querySelector("img");
  }

  /**
   * bỏ hover avatar
   *
   * @memberof AmisControlCompareGroupRowComponent
   */
  leaveAvatar() {
    this.srcAvatar = "";
    this.isContextPopoverAvatar = false;
    this.popoverAvatarTarget = null;
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
      const param = {
        EmployeeSelfServices: [this.currentRow.Data.DataUpdate],
        PushNotificationType: ApproveProfileUpdateEnum.OneField
      }
      this.employeeSelfService.approveEmployeeUpdate(param).subscribe(data => {
        if (data?.Success) {
          this.tranferSV.updateApproveData({ Data: param.EmployeeSelfServices, Type: "Approve" });
          this.amisTranferSV.showSuccessToast(this.translateSV.getValueByKey("HRM_PROFILE_APPROVE_SUCCESS"))
          this.onHiddenPopupAprove();
        }
        else if (data?.ValidateInfo?.length) {
          this.amisTranferSV.showErrorToast(data.ValidateInfo[0].ErrorMessage);
        }
        else {
          this.amisTranferSV.showErrorToast()
        }
      },
        err => {
          this.amisTranferSV.showErrorToast()
        });
    }
    else {
      const param = {
        EmployeeSelfServices: this.selectedData.map(e => e.DataUpdate),
        PushNotificationType: this.selectedData.map(e => e.DataUpdate).length > 1 ? ApproveProfileUpdateEnum.OneGroup : ApproveProfileUpdateEnum.OneField
      }
      this.employeeSelfService.approveEmployeeUpdate(param).subscribe(data => {
        if (data?.Success) {
          this.tranferSV.updateApproveData({ Data: param.EmployeeSelfServices, Type: "Approve" });
          this.amisTranferSV.showSuccessToast(this.translateSV.getValueByKey("HRM_PROFILE_APPROVE_SUCCESS"));
          this.onHiddenPopupAprove();
        }
        else if (data?.ValidateInfo?.length) {
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
            this.layoutConfig = data.Data;
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

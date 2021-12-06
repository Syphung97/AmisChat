import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from 'src/common/components/base-component';
import { GroupFieldConfig } from '../../models/group-field-config/group-field-config';
import { TypeShowControl } from 'src/common/models/base/typeShow';
import { TypeControl } from '../../enum/common/type-control.enum';
import { DataType } from 'src/common/models/export/data-type.enum';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { UserOptionService } from 'src/app/services/user-option/user-option.service';
import { IUsers } from '../../models/user/user';

@Component({
  selector: 'amis-popup-request-update-profile',
  templateUrl: './popup-request-update-profile.component.html',
  styleUrls: ['./popup-request-update-profile.component.scss']
})
export class PopupRequestUpdateProfileComponent extends BaseComponent implements OnInit {

  groupConfig = [
    {
      GroupType: 1,
      ColumnGroup: 1,
      IsVisible: true,
      IsChild: false,
      IsExpand: true,
      IsUse: true,
      GroupFieldConfigs: [
        {
          FieldName: "JobPositionRoleCode",
          Caption: "Nội dung",
          DataType: DataType.DefaultType,
          TypeControl: TypeControl.OneRow,
          SubsystemCode: "JobRole",
          ID: null,
          TableName: "job_position_role",
          IsRequire: true,
          IsReadOnly: false,
          IsUnique: true,
          IsVisible: true,
          IsUse: true,
          ColumnIndex: 1,
          ValidateMethod: [],
          Value:"Cập nhật hồ sơ cá nhân"
        },
        {
          Caption: "Đơn vị công tác",
          ColumnIndex: 1,
          DataType: 8,
          DefaultValue: null,
          DisplayField: "OrganizationUnitName",
          DisplayFieldSource: "OrganizationUnitName",
          EditVersion: null,
          FieldName: "OrganizationUnitID",
          FieldNameSource: "OrganizationUnitID",
          GroupConfigID: 93,
          GroupConfigs: null,
          GroupFieldConfigID: 273,
          ID: null,
          IsCustom: false,
          IsDeleted: false,
          IsImport: true,
          IsMergeField: false,
          IsReadOnly: null,
          IsRequire: true,
          IsShowTooltip: false,
          IsSystem: true,
          IsUnique: false,
          IsUse: true,
          IsVisible: true,
          LayoutConfigID: 3,
          RowIndex: 2,
          SortOrder: 6,
          State: 0,
          SubsystemCode: "JobPosition",
          TableName: "job_position",
          TableNameSource: null,
          TenantID: "00000000-0000-0000-0000-000000000000",
          Tooltip: "",
          TypeControl: 24,
          TypeEditField: 0,
          UserID: null,
          Value: null,
          ValueText: null
        }
      ],
      ColOne: [],
      ColTwo: []
    }
  ]

  employeeIDs = "";
  //submit thông tin
  isSubmit: boolean = false;

  typeShowControlCurrent: TypeShowControl = {
    IsEditable: false,
    IsViewOnly: false,
    IsViewEditable: false
  };

  type = "Employee";

  @Input() visible;

  @Input() set data(data) {
    if (data) {
      if (!data?.length) {
        this.type = "Orgs";
        this.groupConfig[0].GroupFieldConfigs[1].IsUse = true;
        this.groupConfig[0].GroupFieldConfigs[1].IsVisible = true;

        this.groupConfig[0].GroupFieldConfigs[1].Value = this.currentUserInfo.OrganizationUnitID;
        this.groupConfig[0].GroupFieldConfigs[1].ValueText = this.currentUserInfo.OrganizationUnitName;

      }
      else {
        this.type = "Employee";
        this.groupConfig[0].GroupFieldConfigs[1].IsUse = false;
        this.groupConfig[0].GroupFieldConfigs[1].IsVisible = false;
        this.employeeIDs = data.map(d => d.EmployeeID).join(";");
      }
      this.groupConfig = AmisCommonUtils.cloneDeepData(this.groupConfig);
    }
  }
  public currentUserInfo: IUsers = UserOptionService.userInfor;

  @Output() onClosePopup = new EventEmitter();
  constructor(
    private employeeSV: EmployeeService,
    private amisTranferSV: AmisTransferDataService,
    private translateSV: AmisTranslationService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  /**
   * Sau khi bấm gửi
   *
   * @param {any} e
   * @memberof PopupRequestUpdateProfileComponent
   */
  afterValidated(e) {
    if (!e.length) {
      let param;
      if (this.type == "Employee") {
        param = {
          Content: this.groupConfig[0].GroupFieldConfigs[0].Value,
          EmployeeIDs: this.employeeIDs
        }

      }
      else {
        param = {
          Content: this.groupConfig[0].GroupFieldConfigs[0].Value,
          OrganizationUnits: this.groupConfig[0].GroupFieldConfigs[1].Value
        }
      }
      this.employeeSV.pushNotificationToEmployeeUpdateProfile(param).subscribe(data => {
        if (data?.Success) {
          this.amisTranferSV.showSuccessToast(this.translateSV.getValueByKey("Gửi thông báo thành công"))
          this.closePopup();
        }
        else if (data?.ValidateInfo) {
          this.amisTranferSV.showErrorToast(data.ValidateInfo[0].ErrorMessage)
        }
        else {
          this.amisTranferSV.showErrorToast()
        }
      },
        err => {
          this.amisTranferSV.showErrorToast()
        })
    }
  }

  updatedField(e) {

  }

  /**
   * Sau khi đổi field
   *
   * @param {any} e
   * @memberof PopupRequestUpdateProfileComponent
   */
  valueFieldChanged(e) {

  }
  /**
   * Sự kiện đóng popup
   *
   * @memberof PopupRequestUpdateProfileComponent
   */
  closePopup() {
    this.onClosePopup.emit();
  }

  /**
   * Sự kiện gửi yêu cầu
   *
   * @memberof PopupRequestUpdateProfileComponent
   */
  sendRequest() {
    this.isSubmit = AmisCommonUtils.cloneData({ IsSubmit: true });
  }
}

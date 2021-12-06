import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GroupFieldConfig } from 'src/app/shared/models/group-field-config/group-field-config';
import { TypeShowControl } from 'src/common/models/base/typeShow';
import { BaseComponent } from 'src/common/components/base-component';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { EmployeeSelfService } from 'src/app/services/employee-myself/employee-self.service';
import { ApproveProfileUpdateEnum } from 'src/common/enum/approve-profile-update.enum';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { GroupConfig } from 'src/app/shared/models/group-config/group-config';
import { SessionStorageUtils } from 'src/common/fn/session-storage-utils';
import { CacheKey } from 'src/app/shared/constant/cache-key/cache-key';

@Component({
  selector: 'amis-popup-compare-update-field',
  templateUrl: './popup-compare-update-field.component.html',
  styleUrls: ['./popup-compare-update-field.component.scss']
})
export class PopupCompareUpdateFieldComponent extends BaseComponent implements OnInit {

  @Input() currentValue;

  @Input() updateValue;

  @Input() groupFieldConfig: GroupFieldConfig;

  @Input() dependentGroupFieldConfig: GroupFieldConfig;

  groupFieldConfigUpdate: GroupFieldConfig;

  @Output() onClosePopup = new EventEmitter();

  @Input() visiblePopup = false;

  @Input() selfData;

  @Input() title = "";

  isSubmit: boolean = false;

  currentUpdateValue;

  dependentDictionaries;

  typeShowControlCurrent: TypeShowControl = {
    IsEditable: false,
    IsViewOnly: false,
    IsViewEditable: false
  };

  typeShowControlUpdate: TypeShowControl = {
    IsEditable: false,
    IsViewOnly: false,
    IsViewEditable: false
  };
  constructor(
    private translateSV: AmisTranslationService,
    private employeeSelfService: EmployeeSelfService,
    private tranferSV: TransferDataService
  ) {
    super();
  }

  groupConfig;

  submitType;
  ngOnInit(): void {

    const layoutConfigJSON = SessionStorageUtils.get(CacheKey.EmployeeSelfServiceLayout);
    if (layoutConfigJSON && layoutConfigJSON != "null") {
      const layoutConfig = JSON.parse(layoutConfigJSON);
      this.dependentDictionaries = layoutConfig?.DependentDictionaries;
    }
    let isReadOnly;
    if(!this.groupFieldConfig.IsReadOnly) {
      isReadOnly = false;
    }
    else {
      isReadOnly = true;
    }
    if(!isReadOnly) {
      this.groupFieldConfig.IsReadOnly = true;
    }
    this.groupFieldConfig.IsDynamicCombobox = false;
    this.groupFieldConfig.Value = this.currentValue.Value;
    this.groupFieldConfig.ValueText = this.currentValue.ValueText;
    this.groupFieldConfig.Caption = this.translateSV.getValueByKey("EMPLOYEE_CURRENT_VALUE");
    this.groupFieldConfig.ColumnIndex = 1;
    this.groupFieldConfig.RowIndex = 1;

    this.groupFieldConfigUpdate = AmisCommonUtils.cloneDeepData(this.groupFieldConfig);
    this.groupFieldConfigUpdate.Value = this.updateValue.Value;
    this.groupFieldConfigUpdate.ValueText = this.updateValue.ValueText;
    if(!isReadOnly) {
      this.groupFieldConfigUpdate.IsReadOnly = false;
    }
    this.groupFieldConfigUpdate.Caption = this.translateSV.getValueByKey("EMPLOYEE_UPDATE_VALUE");
    this.groupFieldConfigUpdate.ColumnIndex = 1;
    this.groupFieldConfigUpdate.RowIndex = 2;
    this.title = this.translateSV.getValueByKey("TITLE_POPUP_COMPARE_UPDATE", { value: this.title })
    this.currentUpdateValue = this.updateValue;

    this.groupFieldConfig.FieldName = `${this.groupFieldConfig.FieldName}*`;

    this.groupConfig = [
      {
        GroupType: 1,
        ColumnGroup: 1,
        IsVisible: true,
        IsChild: false,
        IsExpand: true,
        IsUse: true,
        GroupFieldConfigs: [
          this.groupFieldConfig,
          this.groupFieldConfigUpdate
        ],
        ColOne: [],
        ColTwo: []
      }
    ]
    if (this.dependentGroupFieldConfig) {
      this.groupConfig[0].GroupFieldConfigs.push(this.dependentGroupFieldConfig);
    }


  }

  closePopup() {
    this.onClosePopup.emit();
  }

  /**
   * Xử lí click save
   *
   * @param {any} check
   * @memberof PopupCompareUpdateFieldComponent
   */
  onClickSave(check) {
    this.submitType = check;
    this.isSubmit = AmisCommonUtils.cloneData({ IsSubmit: true });


  }

  afterValidated(e) {
    if (e?.length == 0) {
      if (!this.submitType) {
        const param = {
          EmployeeSelfService: this.selfData
        };

        this.employeeSelfService.updateDataSelf(param).subscribe(data => {
          if (data?.Success) {
            this.tranferSV.updateApproveData({ Data: param.EmployeeSelfService, Type: "UpdateField" });
            this.closePopup();
          }
          else if (data?.ValidateInfo?.length) {

          }
          else {

          }
        },
          err => {

          });
      }
      //Bấm lưu và duyệt
      else {

        const param = {
          EmployeeSelfServices: [this.selfData],
          PushNotificationType: ApproveProfileUpdateEnum.OneField
        }
        this.employeeSelfService.approveEmployeeUpdate(param).subscribe(data => {
          if (data?.Success) {
            this.tranferSV.updateApproveData({ Data: param.EmployeeSelfServices, Type: "Approve" });
            this.closePopup();
          }
          else if (data?.ValidateInfo?.length) {

          }
          else {

          }
        },
          err => {

          });
      }
    }
    // // Nếu chỉ bấm lưu

  }

  updatedField(e) {

  }

  /**
   * Sự kiện cập nhậ giá trị cập nhật
   *
   * @param {any} e
   * @memberof PopupCompareUpdateFieldComponent
   */
  valueFieldChanged(e) {
    this.currentUpdateValue = {
      Value: e.Data?.Value,
      ValueText: e.Data?.ValueText
    }

    this.selfData.Data = JSON.stringify(this.currentUpdateValue)
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { TypeShowControl } from 'src/common/models/base/typeShow';
import { DataType } from 'src/common/models/export/data-type.enum';

import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { GroupType } from 'src/app/shared/enum/group-config/group-type.enum';
import { ColumnGroup } from 'src/app/shared/enum/group-config/column-group.enum';
import { TypeControl } from 'src/app/shared/enum/common/type-control.enum';
import { GroupConfigUtils } from 'src/app/shared/function/group-control-utils';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { BaseCustomFormComponent } from '../../base-component-custom-form';
import { Attachment } from 'src/app/shared/models/attachment/attachment';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { SaveDataType } from 'src/common/enum/action-save.enum';
import { BackgroundType } from 'src/app/shared/enum/common/background-type.enum';
@Component({
  selector: 'amis-hrm-attachment-edit',
  templateUrl: './hrm-attachment-edit.component.html',
  styleUrls: ['./hrm-attachment-edit.component.scss']
})
export class HrmAttachmentEditComponent extends BaseCustomFormComponent implements OnInit {

  @Input() formPosition: string = ""; // vị trí hiển thị form

  @Input() formTitle: string = this.translateSV.getValueByKey("HRM_ATTACHMENT_EDIT_TITLE");

  @Input() dataSource: any; // data

  // Sau khi gọi api lưu thành công
  @Output() afterSaveSuccess: EventEmitter<any> = new EventEmitter();

  //Sau khi xóa thành công
  @Output() afterDeleteSuccess: EventEmitter<any> = new EventEmitter();

  // Sau khi ddongs form
  @Output() afterClose: EventEmitter<any> = new EventEmitter();

  //config form sửa tài liệu
  groupBox: any = {
    GroupConfigName: this.formTitle,
    GroupType: GroupType.Field,
    ColumnGroup: ColumnGroup.TwoCol,
    GroupFieldConfigs: [
      {
        TableName: "attachment",
        FieldName: "AttachmentID",
        DisplayField: "AttachmentName",
        FieldNameSource: "",
        DisplayFieldSource: "",
        Caption: this.translateSV.getValueByKey("HRM_ATTACHMENT_EDIT_ATTACHMENT_FILE"),
        RowIndex: 1,
        ColumnIndex: 1,
        TypeControl: TypeControl.UploadDocument,
        IsRequire: true,
        IsVisible: true,
        IsUse: true,
        SortOrder: 1,
        DataType: DataType.DefaultType,
        CustomConfig: `{"ListFieldChange": [{"FieldName": "AttachmentFileSize", "FieldSetValue": "FileSize"}, {"FieldName": "AttachmentTypeName", "FieldSetValue": "AttachmentTypeName"}]}`
      },
      {
        TableName: "attachment",
        FieldName: "AttachmentFileSize",
        Caption: this.translateSV.getValueByKey("HRM_ATTACHMENT_EDIT_ATTACHMENT_FILESIZE"),
        RowIndex: 1,
        ColumnIndex: 2,
        TypeControl: TypeControl.FileSize,
        IsReadOnly: true,
        IsVisible: true,
        IsUse: true,
        SortOrder: 2,
        DataType: DataType.DefaultType,
      },
      {
        TableName: "attachment",
        FieldName: "AttachmentTypeName",
        Caption: this.translateSV.getValueByKey("HRM_ATTACHMENT_EDIT_ATTACHMENT_NAME"),
        RowIndex: 2,
        ColumnIndex: 1,
        TypeControl: TypeControl.OneRow,
        IsVisible: true,
        IsRequire: true,
        IsUse: true,
        SortOrder: 3,
        DataType: DataType.DefaultType,
      },
      {
        TableName: "attachment",
        FieldName: "Description",
        Caption: this.translateSV.getValueByKey("HRM_ATTACHMENT_EDIT_ATTACHMENT_DESCRIPTION"),
        RowIndex: 2,
        ColumnIndex: 2,
        TypeControl: TypeControl.MultiRow,
        IsVisible: true,
        IsUse: true,
        SortOrder: 4,
        DataType: DataType.DefaultType,
      }
    ]
  };

  backgroundIcon: BackgroundType = BackgroundType.Grey;

  visibleForm: boolean = true; // hiển thị form
  formMode: FormMode;

  isHaveData: boolean = false;

  typeShow = new TypeShowControl();

  listOption = [
    {
      Key: FormMode.Delete,
      Icon: "icon-delete-red",
      Value: this.translateSV.getValueByKey('DELETE'),
      SubSystemCode: this.subSystemActionCode,
      PermissionCode: this.permissionActionCode,
      IsIgnorePermission: this.isIgnorePermission
    }
  ]

  /**
   * Các thông tin của form popup xóa
   */
  popupDelete = {
    TitlePopupDelete: this.translateSV.getValueByKey("DELETE"),
    VisiblePopupDelete: false,
    ContentPopupDelete: this.translateSV.getValueByKey("HRM_ATTACHMENT_DELETE_CONFIRM"),
    ItemDelete: null
  };


  // Dữ liệu đã bị thay đổi hay chưa
  isChangedData: boolean = false;

  // Hiển thị popup thông báo
  visiblePopupNotify: boolean = false;

  // Hiển thị popup thông báo
  popupNotifyContent: string = "";

  // Kiểu lưu dũ liệu
  actionSaveData: SaveDataType;
  constructor(
    private amisTransferSV: AmisTransferDataService,
    private translateSV: AmisTranslationService,
    private attachmentService: AttachmentService,
  ) {
    super();
  }

  ngOnInit(): void {
  }


  /**
   * lấy dữ liệu từ master
   * @param {any} data
   * @memberof HrmAttachmentEditComponent
   * created by vhtruong - 13/07/2020
   */
  getInputParam(data) {
    this.setConfig();
    if (data.FormMode) {
      this.formMode = data.FormMode;
      this.masterFormMode = data.MasterFormMode;
      this.subSystemActionCode = data.SubSystemActionCode;
      this.permissionActionCode = data.PermissionActionCode;
      this.isIgnorePermission = data.IsIgnorePermission;
      this.handleFormView(data);
    }
  }

  /**
 * Binding dữ liệu lúc vào form
 * @memberof HrmAttachmentEditComponent
 * created by vhtruong - 08/07/2020
 */
  handleFormView(data) {
    if (this.formMode == FormMode.Insert) {
      this.objectMaster = new Attachment();
      this.formTitle = this.translateSV.getValueByKey("HRM_ATTACHMENT_EDIT_TITLE_ADD_ATTACHMENT");
      this.typeShow = {
        IsEditable: false,
        IsViewOnly: false,
        IsViewEditable: false
      };
    } else if (this.formMode == FormMode.Update) {
      this.objectMaster = data.Data;
      this.formTitle = this.translateSV.getValueByKey("HRM_ATTACHMENT_EDIT_TITLE_EDIT_ATTACHMENT");
      this.typeShow = {
        IsEditable: false,
        IsViewOnly: false,
        IsViewEditable: false
      };
      this.setGroupBox();
    } else if (this.formMode == FormMode.View) {
      this.objectMaster = data.Data;
      this.formTitle = this.translateSV.getValueByKey("HRM_ATTACHMENT_EDIT_TITLE_DETAIL_ATTACHMENT");
      this.typeShow = {
        IsEditable: false,
        IsViewOnly: true,
        IsViewEditable: false
      };
      this.setGroupBox();
    }
  }

  /**
   * set groupBox
   * @memberof HrmAttachmentEditComponent
   * modified by vhtruong - 13/07/2020
   */
  setGroupBox() {
    this.groupBox.GroupFieldConfigs.forEach(element => {
      element.Value = this.objectMaster[element.FieldName];
      if (element.DisplayField) {
        element.ValueText = this.objectMaster[element.DisplayField];
      }
    });
    this.groupBox = GroupConfigUtils.SetDataGroupCOnfig(this.groupBox);
  }

  /**
   * save form
   * @memberof HrmAttachmentEditComponent
   * modified by vhtruong - 13/07/2020
   */
  saveData() {
    if (this.masterFormMode == FormMode.Insert) {
      super.saveData();
      this.visibleForm = false;
    } else if (this.masterFormMode == FormMode.Update || this.masterFormMode == FormMode.View) {
      this.setDataToOject();
      this.objectMaster["GroupConfigs"] = AmisCommonUtils.cloneDataArray([this.groupBox]);
      this.objectMaster.GroupConfigs.forEach(p => {
        p.ListGroupConfigChild = [];
        p.ColOne = [];
        p.ColTwo = [];
        p.GroupFieldConfigs.forEach(element => {
          this.objectMaster[`${element.FieldName}`] = element.Value;
          if (element.DisplayField) {
            this.objectMaster[`${element.DisplayField}`] = element.ValueText;
          }
        });
      })
      // Gán state cho object
      if (this.formModeSubmit == FormMode.Update) {
        this.objectMaster.State = FormMode.Update;
      }

      this.attachmentService.save(this.objectMaster).subscribe(res => {
        if (res?.Success) {
          this.afterSaveSuccess.emit({
            FormModeSubmit: this.formModeSubmit,
            Data: res?.Data
          })
          this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("HRM_ATTACHMENT_EDIT_FILE_SUCCESS"));
          this.visibleForm = false;
          return;
        }
        this.amisTransferSV.showErrorToast();
      }, error => {
        this.amisTransferSV.showErrorToast();
      })
    }
  }

  /**
   * Đóng form
   * @memberof HrmAttachmentEditComponent
   */
  closeForm() {
    if (this.isChangedData) {
      this.popupNotifyContent = this.translateSV.getValueByKey("CANCEL_RECENT_TYPE_CONTENT")
      this.visiblePopupNotify = true;
    } else {
      this.afterClose.emit();
    }
  }

  /**
   * Ấn sửa ở form xem chi tiết
   * @memberof BaseCustomFormComponent
   * created by vhtruong - 08/07/2020
   */
  edit() {
    this.formTitle = this.translateSV.getValueByKey("HRM_ATTACHMENT_EDIT_TITLE_EDIT_ATTACHMENT");
    super.edit();
  }


  /**
   * Chọn giá trj trong action
   * Created by: pvthong 21-07-2020
   */
  selectItem(key) {
    if (!key) {
      return;
    }
    switch (key) {
      case FormMode.Delete:
        this.popupDelete.VisiblePopupDelete = true;
        break;

    }
  }

  /**
   * HỦy bỏ việc xóa file đính kèm
   * Created by: pvthong 21-07-2020
   */
  cancelPopupDelete(e) {
    this.popupDelete.VisiblePopupDelete = false;
  }


  /**
   * Xác nhận xóa file đính kèm
   * Created by: pvthong 21-07-2020
   */
  confirmPopupDelete(e) {
    if (this.masterFormMode === FormMode.Insert) {
      this.afterDeleteSuccess.emit(true);
      this.visibleForm = false;
      this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("HRM_ATTACHMENT_DELETE_FILE_SUCCESS"));
    } else if (this.masterFormMode === FormMode.Update || this.masterFormMode === FormMode.View) {
      this.attachmentService.delete([this.objectMaster]).subscribe(res => {
        if (res?.Success) {
          this.afterDeleteSuccess.emit(true);
          this.visibleForm = false;
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
 * Sự kiện thay đổi dữ liệu
 * hgvinh 12/08/2020
 */
  valueFieldChanged(e) {
    if (e.FieldName == "OrganizationUnitID" && !e.Value) {
      return;
    }
    this.isChangedData = true;
  }

  //#region notify edit
  /**
   * Đóng popup cancel
   * created by hgvinh - 11/08/2020
   */
  closePopupNotify() {
    this.visiblePopupNotify = false;
  }

  /**
   * Nhấn confirm trên popup notify
   * created by hgvinh - 11/08/2020
   */
  onConfirm() {
    this.closePopupNotify();
    this.isChangedData = false;
    this.closeForm();
  }

}

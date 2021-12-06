import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, HostListener, ElementRef } from '@angular/core';
import { ButtonType } from '../../enum/common/button-type.enum';
import { ButtonColor } from '../../enum/common/button-color.enum';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AvatarService } from 'src/app/services/user/avatar.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { EmailParameter } from 'src/common/models/base/email-parameter';
import { TemplateTypeService } from 'src/app/services/template-type/template-type.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { Observable } from 'rxjs';
import { convertVNtoENToLower } from 'src/common/fn/convert-VNtoEn';
import { EmailRecipientItem } from 'src/common/models/base/email-recipient-item';
import { ValidateFileEnum } from '../../enum/validate-file/validate-file.enum';
import { UploadService } from 'src/app/services/base/upload.service';
import { UploadTypeEnum } from '../../enum/uploadType/upload-type.enum';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';
import { DocumentType } from '../../enum/document-download-type/document-type.enum';

declare var $: any;
@Component({
  selector: 'amis-popup-send-mail',
  templateUrl: './popup-send-mail.component.html',
  styleUrls: ['./popup-send-mail.component.scss']
})
export class PopupSendMailComponent implements OnInit {

  constructor(
    private templateTypeSV: TemplateTypeService,
    private employeeSV: EmployeeService,
    private amisTransferSV: AmisTransferDataService,
    private amisTranslateSV: AmisTranslationService,
    private uploadeSV: UploadService,
    public httpBase: AmisDataService,
    private avatarSV: AvatarService,
    private cdr: ChangeDetectorRef,
    private transferDataSV: TransferDataService
  ) { }

  @Input() visiblePopup = false;
  @Input() employees;
  @Output() onClosePopup = new EventEmitter();
  @Output() onSentMailSuccess = new EventEmitter();
  width: any = 999;
  height: any = 642;
  _isValidAddress = true;

  isBCC = false;
  isCC = false;
  buttonType = ButtonType;
  buttonColor = ButtonColor;
  isDisableBtnAttach = false;

  emailParameter = new EmailParameter();

  ToRecipients = "";

  CcRecipients = [];

  BccRecipients = [];

  emailSubject = "";

  emailContent = "";

  feedData = [];

  ckeditorFeedsData = [];

  mixedFieldOutside = [];

  isShowSearchPopup = false;

  valueSearchMixField = "";

  searchPopOverData = []

  ckeditorMentionClickContent = "";

  ckeditorMentionClickSubject = "";

  ckObjectName = "";
  groupFieldConfigs = {};
  emailModelType;
  emailModelName: string;
  @ViewChild('importTemplateDoc') importTemplateDoc: ElementRef;
  attachments = [];
  //#region popup notify
  visibleNotify: boolean = false;
  // nội dung xóa trong popup vị trí công việc
  contentNotify = "";
  typeNotify = "Notify";
  //#endregion

  //#region tagbox
  @ViewChild("tagBox") tagBox;
  timeout;
  listCandidateSelected = [];
  dataSource: any = []; //  Danh sách ứng viên để thao tác với các selectbox
  dataSourceBCC: any = []; //  Danh sách ứng viên để thao tác với các selectbox
  dataSourceCC: any = []; //  Danh sách ứng viên để thao tác với các selectbox
  listFilter;
  //unknow
  selectbox;
  _tempSearchValue;
  //loading
  _isLoaded = false;
  //load xong
  _isLoadDone = true;
  //lần đầu nhấn control
  _firstTime = true;
  //load lại
  _isReloadData = false;
  dataPath;
  previousSelected = [];
  isSearching = false;
  //unknow
  //#endregion

  //#region popup-create-doc
  isVisiblePopupDocument = false;
  visibleCreateDocumentForm = false;
  profileHasMadeDocument;
  //#endregion
  _documentType = DocumentType;
  heightCKE = '230px';

  ngOnInit(): void {
    this.initData();
    this.getMixField(1).subscribe();
    this.getAllCandidateInRecruitment();

    this.groupFieldConfigs = {
      GroupFieldConfig: {
        DisplayField: "TemplateName",
        DisplayFieldSource: "TemplateName",
        FieldName: "TemplateID",
        FieldNameSource: "TemplateID",
        CustomConfig: JSON.stringify({
          IsDynamicCombobox: true,
          PopupType: 4
        }),
        SubsystemCode: "Email",
        TableName: "template"
      }
    }
  }

  /**
   * Khởi tạo dữ liệu ban đầu
   *
   * @memberof PopupSendMailComponent
   * CREATED: PTSY 6/5/2020
   */
  initData() {
    this.emailParameter.EmailSubject = "";
    this.emailParameter.EmailContent = "";
    this.emailParameter.ToRecipients = [];
    this.emailParameter.CcRecipients = [];
    this.emailParameter.BccRecipients = [];
    this.listCandidateSelected = this.employees;
    this.profileHasMadeDocument = this.employees;
    this.employees = this.employees.map(x => x.EmployeeID);
  }

  /**
    * Lấy trường trộn theo templateID
    *
    * @param {any} templateID
    * @returns {Observable<any>}
    * @memberof DocumentViewOrUpdateComponent
    * CREATED: PTSY 6/5/2020
    */
  getMixField(templateID): Observable<any> {
    return new Observable(subscriber => {
      this.templateTypeSV.getMixField(templateID).subscribe(data => {
        if (data?.Success) {
          this.feedData = data.Data;
          this.ckeditorFeedsData = this.feedData.map(v => "#" + v.Caption + "#");
          this.mixedFieldOutside = this.feedData.filter(e => {
            return e.FieldName.includes("VocativeOB") || e.FieldName.includes("VocativeAC") ||
              e.FieldName.includes("EmployeeCode") || e.FieldName.includes("FullName") ||
              e.FieldName.includes("JobPositionName") || e.FieldName.includes("OrganizationUnitName") || e.FieldName.includes("JobTitleName");
          });
          subscriber.next(data);
        }
      });
    })

  }

  /**
   * Hàm xử lí khi thay đổi tiêu đề email
   * created by: hgvinh 02/07/2020
   */
  ckeditorOnHeaderChange(event) {
    this.emailSubject = event;
  }
  /**
   * Hàm xử lí khi thay đổi nội dung email
   * created by: ptsy 01/07/2020
   */
  ckeditorOnContentChange(event) {
    this.emailContent = event;
  }

  /**
  * Hàm xử lý show search popup
  * CreatedBy: PDXuan(21/11/2019)
  */
  showSearchPoupHandler() {
    this.isShowSearchPopup = !this.isShowSearchPopup;
    this.valueSearchMixField = "";
    this.searchPopOverData = this.feedData;

  }


  /**
   * Xử lí tìm kiếm trường trộn trên popover
   *
   * @param {any} e
   * @memberof HrmSettingDocumentSampleCreateComponent
   * CREATED: PTSY 6/5/2020
   */
  onSearchHandler(e) {
    if (e) {
      this.searchPopOverData = this.feedData?.filter(item => {
        return convertVNtoENToLower(item.Caption?.toLocaleLowerCase()).trim().includes(
          convertVNtoENToLower(this.valueSearchMixField?.toLocaleLowerCase()).trim()
        );
      });

      if (e.which === 13) {
        $(".search-item.active").click();
      } else if (e.which === 40) {
        const temp = $(".search-item.active");
        temp?.removeClass("active");
        temp?.next().addClass("active");
        if (temp?.next().length === 0) {
          $(".search-item:first-child").addClass("active");
        }

      } else if (e.which === 38) {
        const temp = $(".search-item.active");
        temp?.removeClass("active");
        temp?.prev().addClass("active");
        if (temp?.prev().length === 0) {
          $(".search-item:last-child").addClass("active");
        }
      }
    }
  }

  /**
   * Bắt sự kiện click ẩn popover
   *
   * @param {any} event
   * @memberof HrmSettingDocumentSampleCreateComponent
   */
  @HostListener("click", ["$event"])
  clickEvent(event) {
    if (event && event.target) {
      const element = event.target;
      if (!element?.classList.contains("icon-optional-more") && !element?.closest(".wrap-search-popover")) {
        this.isShowSearchPopup = false;
      }
    }
  }

  setCkObject(e) {
    this.ckObjectName = e;
  }

  /**
   * Sự kiện click vào trường trộn
   *
   * @param {any} mixFieldSelected
   * @memberof HrmSettingDocumentSampleCreateComponent
   */
  selectMixFieldHandler(mixFieldSelected) {
    this.insertMixFieldHandler(mixFieldSelected);
  }

  /**
   * Xử lí khi click vào mix field chèn vào html editor
   *
   * @param {any} item
   * @memberof HrmSettingDocumentSampleCreateComponent
   * CREATED: PTSY 6/5/2020
   */
  insertMixFieldHandler(item) {
    if (this.ckObjectName === "ckContent")
      this.ckeditorMentionClickContent = "#" + item.Caption + "#";
    else
      this.ckeditorMentionClickSubject = "#" + item.Caption + "#";
  }

  /**
   * Đóng popup
   *
   * @memberof PopupSendMailComponent
   * CREATED: PTSY 6/5/2020
   */
  closePopupAction() {
    this.visiblePopup = false;
    this.onClosePopup.emit(false);
  }

  /**
     Sự kiện khi show popup
   *
   * @memberof PopupSendMailComponent
   * CREATED: PTSY 6/5/2020
   */
  onShown() {
    setTimeout(() => {

      this.width++;
    }, 200);
  }

  cancel() {

  }

  /**
   * Tiền xử lí send email
   *
   * @memberof PopupSendMailComponent
   * CREATED: PTSY 6/5/2020
   */
  beforeSendMail() {
    if (!this.emailSubject) {
      this.typeNotify = "Confirm";
      this.showPopupNotify(this.amisTranslateSV.getValueByKey("POPUP_SEND_MAIL_WARNING_TITLE_EMPTY"));
    } else {
      this.typeNotify = "Notify";
      this.sendMail();
    }
  }



  /**
   * send email
   *
   * @memberof PopupSendMailComponent
   * CREATED: PTSY 6/5/2020
   */
  sendMail() {
    // this.listCandidateSelected = this.tagBox.instance.option("selectedItems");
    // this.listCandidateSelected = !this.listCandidateSelected.length ? this.employees : this.listCandidateSelected;
    this.emailParameter.EmailContent = this.emailContent.trim();
    this.emailParameter.EmailSubject = this.emailSubject;
    this.attachments = this.attachments.map(item => {
      return { FileName: item.FileID, FileContent: null }
    })
    this.emailParameter.EmailAttachments = this.attachments;
    const employeeIDs = [];
    this.listCandidateSelected.forEach(e => {
      const emailRecipientItem = new EmailRecipientItem();
      emailRecipientItem.DisplayName = e.FullName ? e.FullName : "";
      emailRecipientItem.Email = e.OfficeEmail ? e.OfficeEmail : "";
      this.emailParameter.ToRecipients.push(emailRecipientItem);
      employeeIDs.push(e.EmployeeID);
    })
    this.BccRecipients.forEach(e => {
      const emailRecipientItem = new EmailRecipientItem();
      emailRecipientItem.DisplayName = e.FullName ? e.FullName : "";
      emailRecipientItem.Email = e.OfficeEmail ? e.OfficeEmail : "";
      this.emailParameter.BccRecipients.push(emailRecipientItem);
      employeeIDs.push(e.EmployeeID);
    })
    this.CcRecipients.forEach(e => {
      const emailRecipientItem = new EmailRecipientItem();
      emailRecipientItem.DisplayName = e.FullName ? e.FullName : "";
      emailRecipientItem.Email = e.OfficeEmail ? e.OfficeEmail : "";
      this.emailParameter.CcRecipients.push(emailRecipientItem);
    })
    this.employeeSV.sendMail(this.emailParameter, employeeIDs.join(";")).subscribe(data => {
      if (data?.Success) {
        this.amisTransferSV.showSuccessToast(this.amisTranslateSV.getValueByKey("POPUP_SEND_MAIL_SUCCESS"));
        this.visiblePopup = false;
        this.onClosePopup.emit(false);
        this.onSentMailSuccess.emit();
      }
      else if (data.SubCode) {
        if (data.SubCode === 404)
          this.showPopupNotify(this.amisTranslateSV.getValueByKey("POPUP_SEND_MAIL_WARNING_NOT_EVER_CONFIG"));
        else if (data.SubCode === 501)
          this.showPopupNotify(this.amisTranslateSV.getValueByKey("POPUP_SEND_MAIL_WARNING_INVALID_CONFIG"));
      }
      else {
        this.amisTransferSV.showErrorToast(this.amisTranslateSV.getValueByKey("POPUP_SEND_MAIL_FAIL"));
      }
    });
  }


  /**
   * Hàm xử lý lấy chữ cái đầu của Email để hiển thị lên image
   * CreatedBy: dtnam1(2/7/2020)
   */
  getStandForEmail(email) {
    if (email)
      return email.substring(0, 1).toUpperCase();
  }

  /**
   * Hàm xử lý lấy chữ cái đầu của Email để hiển thị lên image
   * CreatedBy: dtnam1(2/7/2020)
   */
  onEmailTypeChange(event) {
    this.emailContent = event?.itemData?.Content;
    this.emailSubject = event?.itemData?.Title;
  }

  /**
   * Hàm xử lý lấy chữ cái đầu của Email để hiển thị lên image
   * CreatedBy: dtnam1(2/7/2020)
   */
  importAttachment() {
    this.importTemplateDoc?.nativeElement?.click();
  }



  //#region popup Notify

  /**
   * Xử lý đóng popup
   */
  cancelPopupNotify() {
    this.visibleNotify = false;
  }

  /**
   * hiện popup thông báo
   * @param message nội dung thông báo
   */
  showPopupNotify(message) {
    this.visibleNotify = true;
    this.contentNotify = message;
  }

  //#endregion

  validateFile(files): number {
    for (let index = 0; index < files.length; index++) {
      let extensionFile = files[index].name.split('.')[files[index].name.split('.').length - 1];
      // if (!['doc', 'docx', 'rtf', 'txt', 'odt'].includes(extensionFile)) {
      //   return ValidateFileEnum.ExtensionInvalid;
      // } else
      // if (files[index].size > Math.pow(1024, 2) * 10) {
      //   return ValidateFileEnum.OverSize;
      // }
    }
    return ValidateFileEnum.Valid;
  }

  removeAttachment(id) {
    this.attachments = this.attachments.filter(x => x.FileID !== id);
  }

  onFileChange(e) {
    if (e?.target?.files?.length > 0) {
      let files = e.target.files;
      let valueValidate = this.validateFile(files);
      if (valueValidate === ValidateFileEnum.Valid) {
        this.amisTransferSV.showLoading("", "loading-attachment");
        this.isDisableBtnAttach = true;
        this.uploadeSV.uploadMultiFileToTemp(files, UploadTypeEnum.EmployeeAttachment).subscribe(res => {
          if (res?.Success) {
            this.attachments.push(...res.Data);
            this.amisTransferSV.showSuccessToast(this.amisTranslateSV.getValueByKey("IMPORT_FILE_SUCCESS"));
          }
          else if (res?.ValidateInfo && res?.ValidateInfo.length > 0) {
            this.showPopupNotify(res.ValidateInfo[0].ErrorMessage);
          }
          else {
            this.amisTransferSV.showErrorToast(this.amisTranslateSV.getValueByKey("IMPORT_FILE_FAIL"));
          }
          this.amisTransferSV.hideLoading();
          this.isDisableBtnAttach = false;
        }, err => {
          this.amisTransferSV.showErrorToast(this.amisTranslateSV.getValueByKey("ERROR_HAPPENED"));
        })
        // } else if (valueValidate === ValidateFileEnum.ExtensionInvalid) {
        //   this.showPopupNotify(this.amisTranslateSV.getValueByKey("POPUP_INFOR_FILE_EXTENSION_INVALID"));
      } else if (valueValidate === ValidateFileEnum.OverSize) {
        this.showPopupNotify(this.amisTranslateSV.getValueByKey("POPUP_INFOR_FILE_OVERSIZE"));
      }
    }
  }
  //#region human-tagbox

  /**
   * hàm lấy danh sách ứng viên thuộc tin tuyển dụng
   *
   * @memberof PopupSendEmailComponent
   * dtnam1(2/7/2020)
   */
  getAllCandidateInRecruitment() {
    let me = this;
    let params = { "GroupFieldConfig": { "GroupFieldConfigID": 1308, "LayoutConfigID": 9, "GroupConfigID": 101, "SubsystemCode": "Contract", "RowIndex": 8, "ColumnIndex": 2, "FieldName": "OnBehalfOfEmployerID", "DisplayField": "OnBehalfOfEmployerName", "Caption": "Người đại diện công ty ký", "DataType": 8, "TypeControl": 20, "IsRequire": false, "IsVisible": false, "IsReadOnly": null, "Tooltip": null, "IsShowTooltip": false, "IsSystem": true, "CustomConfig": "{\"IsFilterServer\": true, \"ListFieldChange\": [{\"FieldName\": \"JobTitleID\", \"FieldSetValue\": \"JobTitleID\", \"FieldSetValueText\": \"JobTitleName\"}]}", "IsUnique": false, "DefaultValue": null, "IsCustom": false, "ID": 338, "Value": null, "ValueText": null, "TableName": "contract", "FieldNameSource": "EmployeeID", "DisplayFieldSource": "FullName", "SortOrder": 0, "IsImport": true, "UserID": null, "IsUse": true, "IsMergeField": false, "ListFileTemp": null, "TenantID": "00000000-0000-0000-0000-000000000000", "CreatedDate": "2020-07-01T16:33:14.355+07:00", "CreatedBy": null, "ModifiedDate": "2020-07-01T16:33:14.355+07:00", "ModifiedBy": null, "EditVersion": null, "State": 0, "OldData": null, "PassWarningCode": null, "DataCustomConfig": { "IsFilterServer": true, "ListFieldChange": [{ "FieldName": "JobTitleID", "FieldSetValue": "JobTitleID", "FieldSetValueText": "JobTitleName" }] }, "ValidateMethod": [] }, "Columns": "EmployeeID,JobPositionName,OrganizationUnitName,FullName,OfficeEmail,EmployeeCode,UserID,EditVersion" };
    return me.httpBase
      .getDataByURL("Data", "Dictionary", params, true, false, false)
      .toPromise()
      .then((data: any) => {
        let result = {
          data: [],
          totalCount: 0
        };
        me._isLoadDone = true;
        // me._tempSearchValue = loadOptions["searchValue"];
        me._isLoaded = false;
        me._firstTime = false;
        if (data.Data) {
          if (me.dataPath) {
            result.data = data.Data;
            result.totalCount = data.Data.length;
          } else if (data.Data?.length) {
            result.data = data.Data;
            result.totalCount = data.Data.length;
          }
        }
        if (result.data?.length > 0) {
          result.data.forEach(item => {
            const date = new Date(item.EditVersion);
            const time = date.getTime();
            item.Avatar = me.avatarSV.getAvatarDefault(item.UserID, time);
          });
        }
        // this.dataReturn.push(...result.data);
        // return result.data;
        this.dataSource = AmisCommonUtils.cloneDataArray(result.data);
        this.dataSourceBCC = AmisCommonUtils.cloneDataArray(result.data);
        this.dataSourceCC = AmisCommonUtils.cloneDataArray(result.data);

        this.listFilter = result.data;
      })
      .catch(error => {
        console.log('Data Loading Error: ' + error);
      });
  }

  /**
   * Sự kiện hiển thị popover search trường trộn
   *
   * @param {any} event
   * @memberof PopupSendMailComponent
   * CREATED: PTSY 31/8/2020
   */
  onShownPopover(event) {
    setTimeout(() => {
      $(".wrap-search-popover input").focus();
    }, 100);
  }

  /**
   * hàm xác định trạng thái button gửi
   */
  isDisableBtnSend(): boolean {
    if ((this.listCandidateSelected.length || this.CcRecipients.length || this.BccRecipients.length) && this.emailContent)
      return false;
    return true;
  }
  //#endregion
  //#region popup-create-doc
  PickTemplate() {
    this.isVisiblePopupDocument = true;
  }
  openPopupImport() { }
  onSelectEmailTemplate(e) {
    if (e?.length) {
      this.emailModelType = e[0];
      e[0].Content = !e[0].Content ? "" : e[0].Content;
      e[0].Title = !e[0].Title ? "" : e[0].Title;
      this.emailContent = e[0].Content;
      this.emailSubject = e[0].Title;
    }
  }
  //#endregion
  onZoom(e) {
    this.heightCKE = e ? '440px' : '230px';
  }

}

import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ButtonType } from '../../enum/common/button-type.enum';
import { ButtonColor } from '../../enum/common/button-color.enum';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { UploadService } from 'src/app/services/base/upload.service';
import { UploadTypeEnum } from 'src/app/shared/enum/uploadType/upload-type.enum';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { Template } from 'src/app/shared/models/template/template';
import { TemplateService } from 'src/app/services/template/template.service';
import { ValidateFileEnum } from 'src/app/shared/enum/validate-file/validate-file.enum';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { BaseComponent } from 'src/common/components/base-component';
import { Attachment } from '../../models/attachment/attachment';
import { TypeControl } from '../../enum/common/type-control.enum';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { EmployeeMySelfService } from 'src/app/services/employee-myself/employee-myself.service';

@Component({
  selector: 'amis-popup-import-document-sample',
  templateUrl: './popup-import-document-sample.component.html',
  styleUrls: ['./popup-import-document-sample.component.scss']
})
export class PopupImportDocumentSampleComponent extends BaseComponent implements OnInit {

  //#region popup edit
  visiblePopupEdit: boolean = false;
  //#endregion

  //#region popup notify
  visibleNotify: boolean = false;
  // nội dung xóa trong popup vị trí công việc
  contentNotify = "";
  //#endregion

  @ViewChild('importTemplateDoc') importTemplateDoc: ElementRef;

  @Input()
  visiblePopup = false;

  //cho phép sửa trên table hay k
  @Input()
  isEdit = false;

  // gọi từ app employee
  @Input()
  isCallFromEmployee: boolean = false;

  // title pop
  @Input()
  title = 'Tải lên mẫu văn bản';

  // upload file có cần sửa dữ liệu trong file để lưu db hay k, VD mẫu văn bản isEditContentFile=true
  @Input()
  isEditContentFile = false;

  // button lưu
  @Input()
  btnSave = 'Lưu';

  // title pop
  @Input() set inputColumns(data) {
    if (data) {
      this.columns = data;
    }
  }
  //cột grid
  columns: any = [
    {
      Caption: this.translateSV.getValueByKey("IMPORT_TEMPLATE_HEADER_FILENAME"),
      DataType: 0,
      FieldName: "FileName",
      IsSystem: true,
      IsVisible: true,
      MinWidth: 150,
      SortOrder: 1,
      State: 0,
      Tooltip: this.translateSV.getValueByKey("IMPORT_TEMPLATE_HEADER_FILENAME"),
      Width: 145,
    },
    {
      Caption: this.translateSV.getValueByKey("IMPORT_TEMPLATE_HEADER_FILESIZE"),
      DataType: 0,
      FieldName: "FileSize",
      TextAlign: "Right",
      IsSystem: true,
      IsVisible: true,
      MinWidth: 150,
      SortOrder: 2,
      State: 0,
      Tooltip: this.translateSV.getValueByKey("IMPORT_TEMPLATE_HEADER_FILESIZE"),
      Width: 110,
    },
    {
      Caption: this.translateSV.getValueByKey("IMPORT_TEMPLATE_HEADER_TEMPLATENAME"),
      DataType: 0,
      FieldName: "TemplateName",
      IsSystem: true,
      IsVisible: true,
      MinWidth: 150,
      SortOrder: 3,
      State: 0,
      Tooltip: this.translateSV.getValueByKey("IMPORT_TEMPLATE_HEADER_TEMPLATENAME"),
      Width: 215,
      isEditting: true
    },
    {
      Caption: this.translateSV.getValueByKey("IMPORT_TEMPLATE_HEADER_TEMPLATETYPE"),
      DataType: 0,
      FieldName: "TemplateTypeID",
      DisplayFieldName: "TemplateTypeName",
      IsSystem: true,
      IsVisible: true,
      MinWidth: 220,
      SortOrder: 4,
      State: 0,
      Tooltip: this.translateSV.getValueByKey("IMPORT_TEMPLATE_HEADER_TEMPLATETYPE"),
      Width: 200,
      TypeControl: TypeControl.Combobox,
      Lookup: {
        dataSource: [],
        displayExpr: "PickListValue",
        valueExpr: "PickListID"
      },
      InfoLookup: {
        controller: "Dictionary",
        url: "data",
        params: {
          GroupFieldConfig: {
            LayoutConfigID: 4,
            SubsystemCode: "Template",
            TableName: "template",
            FieldName: "TemplateTypeID"
          }
        }

      },
      isEditting: true

    },
    {
      Caption: this.translateSV.getValueByKey("IMPORT_TEMPLATE_HEADER_NOTE"),
      DataType: 0,
      FieldName: "Description",
      IsSystem: true,
      IsVisible: true,
      MinWidth: 150,
      SortOrder: 5,
      State: 0,
      Tooltip: this.translateSV.getValueByKey("IMPORT_TEMPLATE_HEADER_NOTE"),
      Width: 200,
      isEditting: true
    }
  ];

  // list loại file chấp nhận import
  @Input() set typeAccept(data) {
    if (data) {
      this._typeAccept = data;
      var listAcceptExtension = data.split(',');
      var lastEle = listAcceptExtension[listAcceptExtension.length - 1];
      listAcceptExtension.pop();
      var listAcceptExtensionStr = listAcceptExtension.join(", ") + " và " + lastEle;
      this.notifyFileAccept = this.translateSV.getValueByKey("IMPORT_TEMPLATE_ACCEPT_FILE", { ListAcceptExtension: listAcceptExtensionStr });
    }
  }
  _typeAccept = "";
  _acceptFileExtension = '.doc,.xls,.ppt,.docx,.xlsx,.pptx,.odt,.ods,.odp,.pdf,.rtf,.xmind,.mmap,.zip,.7z,.rar,.png,.jpg,.jpeg,.gif,.html,.htm,.dwg,.dwf,.edb,.e2k';
  // list loại file chấp nhận import
  notifyFileAccept = "";

  //subsystemCode
  @Input() subsystemCode: string;
  //masterValue
  @Input() masterValue: any;
  //formMode
  @Input() formMode = FormMode.Insert;

  // Output hủy
  @Output()
  outputCancel: EventEmitter<any> = new EventEmitter<any>();

  // Output reload lại grid ở component cha
  @Output()
  reloadTemplateGrid: EventEmitter<any> = new EventEmitter<any>();

  //output dataSource
  @Output()
  ouputDataSource: EventEmitter<any> = new EventEmitter<any>();

  buttonType = ButtonType;
  buttonColor = ButtonColor;
  //số lượng/trang
  currentPageSize = 500;
  //template đang được chọn
  currentTemplate = new Template();

  //dữ liệu đổ lên grid
  dataSource: Array<Attachment> = [];
  //dữ liệu đã filter
  dataFilter: Array<Attachment> = [];

  //Tên trường sắp xếp danh sách
  @Input() sortName = "AttachmentTypeName";

  dataOfChild;
  isDisableBtnSave: boolean = true;
  //value tìm kiếm
  filterValue: string;
  //có phải xử lý xóa ở gỉd hay k
  isDeleteOngrid: boolean = false;
  //loại view thêm sửa xóa
  jobRoleTypeAddEdit = FormMode;
  //context menu
  listOption = [
    {
      Key: FormMode.Delete,
      Value: this.translateSV.getValueByKey("DELETE"),
      Icon: 'icon-close-red',
      Text: this.translateSV.getValueByKey("DELETE")
    }
  ]
  //thời gian setTimeout
  timeSearch: any;
  visibleGrid: boolean = true;
  visibleImport: boolean = true;

  //lưu dữ liệu grid
  isSubmit = { isSubmit: false };

  isSaveGrid = { isSaveGrid: false };

  //ktra load xong combobox grid hay chưa
  isLoaded = false;
  //data upload
  dataUpload: any;

  constructor(private uploadSV: UploadService,
    private amisTransferSV: AmisTransferDataService,
    private translateSV: AmisTranslationService,
    private templateSV: TemplateService,
    private cdr: ChangeDetectorRef,
    public amisDataSV: AmisDataService,
    private attachmentService: AttachmentService,
    private employeeMySelfService: EmployeeMySelfService

  ) {
    super();
  }
  ngOnInit(): void {
    this.initColumn();
    this.getLookup();
  }

  /**
   * Khởi tọa columns
   * Created by PVTHONG 08/07/2020
   */
  initColumn() {
    this.columns.forEach(element => {
      if (element.isEditting && element.IsRequire) {
        let index = element.Caption.indexOf("*");
        if (index < 0) {
          element.Caption += " *";
        }
      }
    });
  }

  /**
   * Lấy danh sách selectbox khi sửa thông tin trên table
   * Created by: pvthong 06-07-2020
   */
  getLookup() {
    let dictionaryController = "";
    let dictionaryUrl = "";
    if (this.isCallFromEmployee) {
      dictionaryController = "EmployeeMySelf";
      dictionaryUrl = "dictionary-data";
    }
    if (this.isEdit || true) {
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
            this.amisDataSV.getDataByURL(dictionaryUrl ? dictionaryUrl : element.InfoLookup.url, dictionaryController ? dictionaryController : element.InfoLookup.controller, element.InfoLookup.params, true).subscribe(res => {
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

  //#region popup base
  /**
   * đóng popup
   */
  closePopup() {
    this.cancel();
  }
  /**
   * Xử lý đóng popup
   */
  cancel() {
    this.outputCancel.emit(true);
  }

  /**
   * bắt sk click button save và thêm mới mẫu văn bản vào db
   * modifiedBy PVTHONG 07/07/2020
   */
  save() {
    this.isSubmit = AmisCommonUtils.cloneData({ isSubmit: true });
  }

  /**
   * Lưu mẫu văn bản
   * Created PVTHONG 07/07/2020
   */
  submitSaveData(data) {
    this.dataSource = data;
    let checkSave = false;
    if (this.formMode === FormMode.Insert) {
      this.ouputDataSource.forEach(element => {
        element.State = FormMode.Insert;
      });
      checkSave = true;
      this.ouputDataSource.emit(this.dataSource);

    } else if (this.formMode === FormMode.Update || this.formMode === FormMode.View) {
      data.forEach(element => {
        element.MasterID = this.masterValue;
        element.MasterType = this.subsystemCode;
        element.State = FormMode.Insert;
        element.FileTypeStorage = UploadTypeEnum.EmployeeAttachment;
      });
      if (this.isCallFromEmployee) {
        this.ouputDataSource.emit(data);
        checkSave = true;
        return;
      } else {
        this.attachmentService.saveList(data).subscribe(res => {
          if (res?.Success) {
            this.ouputDataSource.emit(res.Data);
            checkSave = true;
            return;
          }
          checkSave = true;
          this.amisTransferSV.showErrorToast();
        }, error => {
          checkSave = true;
          this.amisTransferSV.showErrorToast();
        });
      }

    }
    const interval = setInterval(() => {
      if (checkSave) {
        this.visiblePopup = false;
        this.cdr.detectChanges();
        clearInterval(interval);
      }
    }, 0);

  }

  //#endregion

  //#region popup edit
  /**
   * Xử lý đóng popup
   */
  cancelPopupEdit() {
    this.visiblePopupEdit = false;
  }
  updateTemplate(e) {
    this.dataFilter = AmisCommonUtils.cloneData(this.dataSource);
  }
  //#endregion

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



  /**
   * Xử lý chức năng context menu trên từng màn hình danh sách (sửa , xóa)
   */
  contextMenuExecuteAction(e) {
    if (e?.Key) {
      const key = e.Key;
      if (key === FormMode.Delete) {
        this.dataSource = this.dataSource.filter(d => d.AttachmentID !== e.Data.FileID);
        this.dataFilter = AmisCommonUtils.cloneData(this.dataSource);
        if (this.dataFilter.length === 0) {
          this.isDisableBtnSave = true;
        }
        // this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("IMPORT_FILE_DELETE_SUCCESS"));
      }
    }
  }

  /**
   * Bắt sk import file
   */
  importFile() {
    this.importTemplateDoc?.nativeElement?.click();
  }

  /**
   * Xử lý data (bỏ extension và tính lại dung lượng file)
   * @param data data
   */
  handleData(data) {
    if (data) {
      data.forEach(element => {
        let temp = element?.FileName.split('.');
        temp.pop();
        let templateName = temp.join('.')
        element.TemplateName = templateName;
        element.FileSize = Math.ceil((element?.FileSize / 1))
      });
      return data;
    }
  }

  /**
   * bắt sk kéo thả file
   */
  onFileDropped(listFiles) {
    if (listFiles) {
      let event = { target: { files: listFiles } };
      this.onFileChange(event);
    }
  }

  /**
   * Bắt sự kiên file change
   * @param e event
   */
  onFileChange(e) {
    if (e?.target?.files?.length > 0) {
      let files = e.target.files;
      let sizeFiles = 0;
      for (let index = 0; index < e.target.files.length; index++) {
        sizeFiles += e.target.files[index].size;
      }
      sizeFiles = sizeFiles / 1024 / 1024;
      if (sizeFiles > 10) {
        this.amisTransferSV.showErrorToast(
          this.translateSV.getValueByKey("TOAST_UPLOAD_ERROR_MAX_SIZE")
        );
        return;
      }
      let valueValidate = this.validateFile(files);
      if (valueValidate === ValidateFileEnum.Valid) {
        this.amisTransferSV.showLoading("", "import-document-same");
        if (this.isEditContentFile) {
          this.templateSV.uploadFileHandleMultiple(files, UploadTypeEnum.EmployeeAttachment).subscribe(res => {
            this.handleUploadResponse(res);
          }, err => {
            this.handleErrorResponse();
          });
        }
        else {
          if (this.isCallFromEmployee) {
            this.employeeMySelfService.uploadMultiFileToTemp(files, UploadTypeEnum.EmployeeAttachment).subscribe(res => {
              this.handleUploadResponse(res);
            }, err => {
              this.handleErrorResponse();
            });
          } else {
            this.uploadSV.uploadMultiFileToTemp(files, UploadTypeEnum.EmployeeAttachment).subscribe(res => {
              this.handleUploadResponse(res);
            }, err => {
              this.handleErrorResponse();
            });
          }
        }
      } else if (valueValidate === ValidateFileEnum.ExtensionInvalid) {
        this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("IMPORT_ERROR_FILE"));
      }
    }
  }

  /**
   * Xử lý response trả về
   * nmduy 04/10/2020
   */
  handleUploadResponse(res) {
    if (res?.Success) {
      this.handlUploadFile(res.Data);
    }
    else if (res?.ValidateInfo && res?.ValidateInfo.length > 0) {
      this.showPopupNotify(res.ValidateInfo[0].ErrorMessage);
    }
    else {
      this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("IMPORT_FILE_FAIL"));
    }
    this.amisTransferSV.hideLoading();
  }

  /**
   * Xử lý phản hồi lỗi
   * nmduy 04/10/2020
   */
  handleErrorResponse() {
    this.amisTransferSV.hideLoading();
    this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("ERROR_HAPPENED"));
  }

  /**
   * hàm xử lí khi upload file
   * @param e
   */
  handlUploadFile(resData) {
    if (this.visibleImport) {
      this.visibleImport = false;
    }
    this.isDisableBtnSave = false;

    this.columns.forEach(field => {
      resData.forEach(eleData => {
        if (field.FieldName == "AttachmentTypeName") {
          const name = eleData.FileName;
          const lastDot = name.lastIndexOf(".");
          eleData.AttachmentTypeName = name.substring(0, lastDot);
        }
        else if (field.FieldName == "AttachmentTypeID") {
          const name = eleData.FileName;
          const lastDot = name.lastIndexOf(".");
          let tempName = name.substring(0, lastDot);
          if (field.TypeControl == TypeControl.Combobox) {
            let tempField = field.Lookup.dataSource.find(x => x.PickListValue == tempName);
            if (tempField && field?.Lookup?.valueExpr) {
              eleData.AttachmentTypeID = tempField[field?.Lookup?.valueExpr];
            }
          }
          eleData.AttachmentTypeName = tempName;
        }

        eleData.AttachmentID = eleData.FileID;
        eleData.AttachmentName = eleData.FileName;
        eleData.AttachmentFileSize = eleData.FileSize;
        eleData.AttachmentExtension = eleData.FileType;
        //gán những trường trong columns có mà dataSource k có
        if (!eleData[field.FieldName]) {
          eleData[field.FieldName] = null;
        }
      });
    });

    this.dataSource.push(...this.handleData(resData));
    //sắp xếp danh sách tài liệu
    this.dataSource.sort(this.dynamicSort(this.sortName));

    this.dataFilter = AmisCommonUtils.cloneData(this.dataSource);
    this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("IMPORT_FILE_SUCCESS"));
  }

  /**
   * hàm xử lí khi thay đổi giá trị search
   * @param e
   */
  onSearchControl(e) {
    this.isSaveGrid = { isSaveGrid: true };
    if (e?.element?.querySelector('.dx-texteditor-input')?.value) {
      clearTimeout(this.timeSearch);
      this.timeSearch = setTimeout(() => {
        this.dataFilter.forEach(element => {
          let temp = this.dataSource.find(x => x.AttachmentID == element.AttachmentID);
          if (temp) {
            temp = element;
          }
        });
        let searchText = e.element.querySelector('.dx-texteditor-input').value;
        this.filterValue = searchText;
        searchText = AmisStringUtils.convertVNtoENToLower(searchText).trim();
        this.dataFilter = this.dataSource.filter(f => AmisStringUtils.convertVNtoENToLower(f.AttachmentName).includes(searchText));
      }, 400)
    } else {
      this.dataFilter = AmisCommonUtils.cloneData(this.dataSource);
    }
  }

  /**
   * hàm xử lí khi thay đổi giá trị search
   * @param e
   */
  onValueChangedSearch(e) {
    this.isSaveGrid = { isSaveGrid: true };
    if (e?.element?.querySelector('.dx-texteditor-input')?.value) {
      this.dataFilter.forEach(element => {
        let temp = this.dataSource.find(x => x.AttachmentID == element.AttachmentID);
        if (temp) {
          temp = element;
        }
      });
      let searchText = e.element.querySelector('.dx-texteditor-input').value;
      this.filterValue = searchText?.trim();
      searchText = AmisStringUtils.convertVNtoENToLower(searchText).trim();
      this.dataFilter = this.dataSource.filter(f => AmisStringUtils.convertVNtoENToLower(f.AttachmentTypeName).includes(searchText));
    } else {
      this.dataFilter = AmisCommonUtils.cloneData(this.dataSource);
    }
  }

  //#region grid base
  /**
   * Bắt sự kiện click nút ba chấm
   * @param e
   */
  onClickViewMoreRow(e) {
    if (e?.SelectedRow?.data) {
      this.dataOfChild = this.dataSource.find(data => data.AttachmentID === e.SelectedRow.data.FileID);
    }
    if (e?.ContextMenu?.Key) {
      const key = e.ContextMenu.Key;
      if (key === FormMode.Delete) {
        this.dataSource = this.dataSource.filter(d => d.AttachmentID !== e.SelectedRow.data.FileID);
        this.dataFilter = AmisCommonUtils.cloneData(this.dataSource);
        if (this.dataFilter.length === 0) {
          this.isDisableBtnSave = true;
        }
        // this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("IMPORT_FILE_DELETE_SUCCESS"));
      }
    }
  }

  /**
   * Bắt sự kiện click dòng
   * @param e
   */
  onClickRow(e) {
    if (e?.data) {
      this.dataOfChild = this.dataSource.find(data => data.AttachmentID === e.data.FileID);
      this.contextMenuExecuteAction({ Key: 2 });
    }
  }

  /**
   * validate đuôi và dung lượng file
   */
  validateFile(files): number {
    // if (!this.typeAccept) {
    //   return ValidateFileEnum.Valid;
    // }

    for (let index = 0; index < files.length; index++) {
      let extensionFile = "." + files[index].name.split('.')[files[index].name.split('.').length - 1];
      // nếu không nằm trong các loại type truyền vào
      if (this._typeAccept) {
        let exten = this._typeAccept?.split(',');
        if (!exten?.includes(extensionFile)) {
          return ValidateFileEnum.ExtensionInvalid;
        }
      }
      // nếu không nằm trong các loại type mặc định của hệ thống
      else {
        let exten = this._acceptFileExtension?.split(',');
        if (!exten?.includes(extensionFile.toLowerCase())) {
          return ValidateFileEnum.ExtensionInvalid;
        }
      }

    }
    return ValidateFileEnum.Valid;
  }

  /**
   * ouput dataSource khi thay đổi
   * Created By PVTHONG 07/07/2020
   */
  outputDataSource(data) {
    if (data) {
      this.dataSource = data;
    }
  }
  //#endregion

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
      var res = 1;
      if (a[property] && b[property]) {

        let aName = AmisStringUtils.convertVNtoENToLower(a[property])?.toUpperCase();
        let bName = AmisStringUtils.convertVNtoENToLower(b[property])?.toUpperCase();
        res = (aName < bName) ? -1 : (aName > bName) ? 1 : 0;
      }
      return res * sortOrder;
    }
  }

}

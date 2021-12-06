import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from 'src/common/components/base-component';
import { FormMode } from 'src/common/enum/form-mode.enum';
import { UploadService } from 'src/app/services/base/upload.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { ValidateFileEnum } from '../../enum/validate-file/validate-file.enum';
import { UploadTypeEnum } from '../../enum/uploadType/upload-type.enum';
import { AmisStringUtils } from 'src/common/fn/string-utils';
import { TypeControl } from '../../enum/common/type-control.enum';
import { AttachmentService } from 'src/app/services/attachment/attachment.service';
import { TypeSeparate } from '../../enum/import-document/type-separate.enum';
import { AvatarService } from 'src/app/services/user/avatar.service';
import { DownloadService } from 'src/app/services/base/download.service';
import { TransferDataService } from 'src/app/services/base/transfer-data.service';

@Component({
  selector: 'amis-popup-import-document-series',
  templateUrl: './popup-import-document-series.component.html',
  styleUrls: ['./popup-import-document-series.component.scss']
})

export class PopupImportDocumentSeriesComponent extends BaseComponent implements OnInit {

  //#region popup notify
  visibleNotify: boolean = false;
  visibleImportSuccess: boolean = false;
  // nội dung xóa trong popup vị trí công việc
  contentNotify = "";
  //#endregion

  @ViewChild('importTemplateDoc') importTemplateDoc: ElementRef;

  @Input()
  visiblePopup = false;

  //cho phép sửa trên table hay k
  @Input()
  isEdit = false;

  // title pop
  @Input()
  title = 'Tải tài liệu hàng loạt';

  // button lưu
  @Input()
  btnSave = 'Tải lên';

  // masterType
  @Input()
  masterType = 'Employee';

  // title pop
  @Input() set inputColumns(data) {
    if (data) {
      this.columns = data;
    }
  }
  //cột grid
  columns: any = [
    {
      Caption: "Tệp đính kèm",
      DataType: 0,
      FieldName: "AttachmentName",
      IsSystem: true,
      IsVisible: true,
      MinWidth: 150,
      SortOrder: 1,
      State: 0,
      Tooltip: "Tệp đính kèm",
      Width: 145,
    },
    {
      Caption: "Tên tệp",
      DataType: 0,
      FieldName: "AttachmentTypeName",
      IsSystem: true,
      IsVisible: true,
      MinWidth: 150,
      SortOrder: 3,
      State: 0,
      Tooltip: "Tên tệp",
      Width: 215,
      isEditting: true,
      IsRequire: true
    },
    {
      Caption: "Dung lượng (KB)",
      DataType: 0,
      FieldName: "AttachmentFileSize",
      TextAlign: "Right",
      IsSystem: true,
      IsVisible: true,
      MinWidth: 150,
      SortOrder: 2,
      State: 0,
      Tooltip: "Dung lượng (KB)",
      Width: 110,
      TypeControl: TypeControl.FileSize
    },
    {
      Caption: "Kết quả",
      DataType: 0,
      FieldName: "Result",
      IsSystem: true,
      IsVisible: true,
      MinWidth: 150,
      SortOrder: 5,
      State: 0,
      Tooltip: "Kết quả",
      Width: 200,
    }
  ];

  _acceptFileExtension = '.doc,.xls,.ppt,.docx,.xlsx,.pptx,.odt,.ods,.odp,.pdf,.rtf,.xmind,.mmap,.zip,.7z,.rar,.png,.jpg,.jpeg,.gif,.html,.htm,.dwg,.dwf,.edb,.e2k';
  // list loại file chấp nhận import
  notifyFileAccept = "";

  // Output hủy
  @Output()
  outputCancel: EventEmitter<any> = new EventEmitter<any>();


  //số lượng/trang
  currentPageSize = 500;
  //template đang được chọn

  //dữ liệu đổ lên grid
  dataSource = [];
  //dữ liệu đã filter
  dataFilter = [];
  //danh sách tài liệu hợp lệ
  dataSourceSuccess = [];

  isDisableBtnSave: boolean = true;
  //value tìm kiếm
  filterValue: string;
  //có phải xử lý xóa ở gỉd hay k
  isDeleteOngrid: boolean = false;

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

  //kiểm tra ở form import hay thiết lập từ điển ghép cột
  isImport = true;

  //danh sách cột dữ liệu mapping
  listMappingKeyword = [];

  //kiểm tra dữ liệu thiết lập tự động
  isNodataSetting = false;

  //loại phân cách tên tài liệuTên tệp được đặt theo định dạng: MãNhânViên_MãTàiLiệu (vd:NV0001_SYLL)
  typeSeparate = TypeSeparate.Underscore;

  //thông báo định dạng file
  notifyFormat = "";

  //danh sách nhân viên tải tài liệu thành công
  listEmployee = [];

  //danh sách kết quả
  listResult = [];

  constructor(private uploadSV: UploadService,
    private amisTransferSV: AmisTransferDataService,
    private translateSV: AmisTranslationService,
    public amisDataSV: AmisDataService,
    private attachmentSV: AttachmentService,
    private avatarService: AvatarService,
    private downloadSV: DownloadService,
    private transferDataSV: TransferDataService,

  ) {
    super();
  }
  ngOnInit(): void {
    // this.initColumn();
    this.getFileStructure();
  }

  /**
   * Khởi tọa columns
   * Created by PVTHONG 04/08/2020
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
   * lấy config thiết lập tùy chỉnh
   * Created by PVTHONG 10/08/2020
   */
  getFileStructure() {
    this.typeSeparate = this.currentUserInfo?.UserOptions?.TypeSeparate == TypeSeparate.Dash ? TypeSeparate.Dash : TypeSeparate.Underscore;
    this.notifyFormat = this.translateSV.getValueByKey("POPUP_IMPORT_ATTACHMENT_NOTIFY_FORMAT", { fomat: this.typeSeparate == TypeSeparate.Underscore ? "_" : "-" });
  }

  /**
   * Validate tài liệu
   * Created by PVTHONG 04/08/2020
   */
  getDataValidate(data) {
    // if(!this.visibleImport){
    //   this.amisTransferSV.showLoading("grid-template-loading");
    // }
    this.attachmentSV.getDataValidate(data).subscribe(res => {
      if (res?.Success) {
        let data = res.Data;
        data.forEach(element => {
          let index = this.dataSource.findIndex(x => x.AttachmentID == element.Data.AttachmentID);
          if (index >= 0) {
            if (element.Success) {
              let employee = this.listEmployee?.find(x => x.EmployeeID == element.Employee.EmployeeID);
              if (!employee) {
                this.listEmployee.push(element.Employee);
              }
              this.dataSource[index] = element.Data;
              this.dataSource[index].FileName = element.AttachmentTypeName;

              this.dataSource[index].listFieldSuccess = ["Result"];
              this.dataSource[index].listFieldError = [];
            }
            else {
              this.dataSource[index].listFieldSuccess = [];
              this.dataSource[index].listFieldError = ["Result"];
            }
            this.dataSource[index].Success = element.Success;
            this.dataSource[index].Result = element.Success ? this.translateSV.getValueByKey("IMPORT_VALID_TEXT") : element.Error;
          }
        });
        let check = this.dataSource.find(x => x.Success);
        this.isDisableBtnSave = check ? false : true;
        this.visibleImport = false;
        this.amisTransferSV.hideLoading();
        this.dataFilter = AmisCommonUtils.cloneDataArray(this.dataSource);
      }
      else {
        this.visibleImport = false;
        this.amisTransferSV.hideLoading();
        this.amisTransferSV.showErrorToast();
      }
    }, err => {
      this.visibleImport = false;
      this.amisTransferSV.hideLoading();
      this.amisTransferSV.showErrorToast();
    })
  }

  /**
   * Bắt sự kiện click nút ba chấm
   * @param e
   */
  onClickViewMoreRow(e) {

    if (e?.ContextMenu?.Key) {
      const key = e.ContextMenu.Key;
      if (key === FormMode.Delete) {
        this.dataSource = this.dataSource.filter(d => d.AttachmentID !== e.SelectedRow.data.AttachmentID);
        this.dataFilter = this.dataFilter.filter(d => d.AttachmentID !== e.SelectedRow.data.AttachmentID);
        let check = this.dataSource.find(x => x.Success);
        this.isDisableBtnSave = check ? false : true;
        // this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("IMPORT_FILE_DELETE_SUCCESS"));
      }
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
    this.dataSourceSuccess = [];
    this.dataSource.forEach(element => {
      if (element.Success) {
        element.State = FormMode.Insert;
        element.AttachmentTypeName = element.FileName;
        element.MasterType = this.masterType;
        this.dataSourceSuccess.push(element);
      }
    });
    if (!this.dataSourceSuccess.length) {
      return;
    }
    this.createResult();
    this.attachmentSV.saveList(this.dataSourceSuccess).subscribe(res => {
      if (res?.Success) {
        this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("POPUP_IMPORT_ATTACHMENT_TOTAL_ATTACHMENT", { total: this.dataSourceSuccess.length }));
        this.visibleImportSuccess = true;
        // this.visiblePopup = false;
      }
      else {
        this.amisTransferSV.showErrorToast();
      }
    }, err => {
      this.amisTransferSV.showErrorToast();
    })
  }

  /**
   * Tạo obj kết quả
   * Created 06/08/2020
   */
  createResult() {
    this.listEmployee.forEach(element => {
      element.srcAvatar = this.avatarService.getAvatar(element.UserID, element.EditVersion, true, 30, 30);
      let attach = this.dataSourceSuccess.filter(x => x.MasterID == element.EmployeeID);
      let objResult = {
        Employee: element,
        Attactments: attach
      };
      if(attach.length){
        this.listResult.push(objResult);
      }
    });

  }

  //#endregion

  //#region popup Notify

  /**
   * Xử lý đóng popup
   */
  cancelPopupImportSuccess() {
    this.visibleImportSuccess = false;
  }

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
        this.amisTransferSV.showLoading("", "import-document-series");
        this.uploadSV.uploadMultiFileToTemp(files, UploadTypeEnum.EmployeeAttachment).subscribe(res => {
          if (res?.Success) {
            this.handlUploadFile(res.Data);
          }
          else if (res?.ValidateInfo && res?.ValidateInfo.length > 0) {
            this.amisTransferSV.hideLoading();
            this.showPopupNotify(res.ValidateInfo[0].ErrorMessage);
          }
          else {
            this.amisTransferSV.hideLoading();
            this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("IMPORT_FILE_FAIL"));
          }
        }, err => {
          this.amisTransferSV.hideLoading();
          this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("ERROR_HAPPENED"));
        })
      } else if (valueValidate === ValidateFileEnum.ExtensionInvalid) {
        this.amisTransferSV.hideLoading();
        this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("IMPORT_ERROR_FILE"));
      }
    }
  }

  /**
   * hàm xử lí khi upload file
   * @param e
   */
  handlUploadFile(resData) {
    // if (this.visibleImport) {
    //   this.visibleImport = false;
    // }
    this.isDisableBtnSave = false;
    this.dataSource.push(...this.handleData(resData));

    this.columns.forEach(field => {
      resData.forEach(eleData => {
        if (field.FieldName == "AttachmentTypeName") {
          const name = eleData.FileName;
          const lastDot = name.lastIndexOf(".");
          eleData.AttachmentTypeName = name.substring(0, lastDot);
        }
        eleData.AttachmentID = eleData.FileID;
        eleData.AttachmentName = eleData.FileName;
        eleData.AttachmentFileSize = eleData.FileSize;
        eleData.AttachmentExtension = eleData.FileType;
        eleData.TypeSeparate = this.typeSeparate;
        //gán những trường trong columns có mà dataSource k có
        if (!eleData[field.FieldName]) {
          eleData[field.FieldName] = null;
        }
      });
    });

    this.getDataValidate(resData);
    this.filterValue = "";
    // this.dataFilter = AmisCommonUtils.cloneData(this.dataSource);
    // setTimeout(()=>{
    //   this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("IMPORT_FILE_SUCCESS"));
    // })
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
        this.dataFilter = this.dataSource.filter(f => (AmisStringUtils.convertVNtoENToLower(f.AttachmentTypeName).includes(searchText) || AmisStringUtils.convertVNtoENToLower(f.AttachmentName).includes(searchText)));
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
      this.filterValue = searchText;
      searchText = AmisStringUtils.convertVNtoENToLower(searchText).trim();
      this.dataFilter = this.dataSource.filter(f => (AmisStringUtils.convertVNtoENToLower(f.AttachmentTypeName).includes(searchText) || AmisStringUtils.convertVNtoENToLower(f.AttachmentName).includes(searchText)));
    } else {
      this.dataFilter = AmisCommonUtils.cloneData(this.dataSource);
    }
  }

  //#region grid base

  /**
   * validate đuôi và dung lượng file
   * Created by pvthong- 04/08/2020
   */
  validateFile(files): number {
    for (let index = 0; index < files.length; index++) {
      let extensionFile = "." + files[index].name.split('.')[files[index].name.split('.').length - 1];

      let exten = this._acceptFileExtension?.split(',');
      if (!exten?.includes(extensionFile)) {
        return ValidateFileEnum.ExtensionInvalid;
      }

    }
    return ValidateFileEnum.Valid;
  }

  /**
   * ouput dataSource khi thay đổi
   * Created by pvthong- 04/08/2020
   */
  outputDataSource(data) {
    if (data) {
      this.dataSource = data;
      this.getDataValidate(this.dataSource);
    }
  }

  /**
   * ouput dataSource loại phân cách tài liệu
   * Created by pvthong- 04/08/2020
   */
  outputTypeSeparate(data) {
    this.typeSeparate = data;
    this.notifyFormat = this.translateSV.getValueByKey("POPUP_IMPORT_ATTACHMENT_NOTIFY_FORMAT", { fomat: this.typeSeparate == TypeSeparate.Underscore ? "_" : "-" });
    if (this.dataSource?.length) {
      this.dataSource.forEach(element => {
        element.TypeSeparate = this.typeSeparate;
      });
      this.getDataValidate(this.dataSource);
    }
  }

  /**
   * download file
   * Created by pvthong- 04/08/2020
   */
  downloadAttach(attachmentID) {
    this.downloadSV.getTokenFile(attachmentID, UploadTypeEnum.EmployeeAttachment).subscribe(res => {
      if (res && res.Success && res.Data) {
        window.open(this.downloadSV.downloadFile(res.Data), '_blank');
      } else {
        this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("TOAST_DOWNLOAD_RECORD_FAIL"));
      }
    }, error => {
      this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("ERROR_HAPPENED"));
    });
  }

  /**
   * view detail
   * @memberof HrmSidebarProfileComponent
   * CREATED BY PVTHONG - 13/05/2020
   */
  viewEmployeeDetail(data) {
    let param = {
      EmployeeID: data
    }
    this.cancel();
    this.transferDataSV.openViewProfile(param);
  }
  //#endregion

}

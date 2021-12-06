import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { BaseControl } from '../base-control';
import { AmisDataService } from 'src/common/services/amis-data.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { UploadService } from 'src/app/services/base/upload.service';
import { UploadTypeEnum } from 'src/app/shared/enum/uploadType/upload-type.enum';
import { DownloadService } from 'src/app/services/base/download.service';
import { max } from 'date-fns';
import { EmployeeMySelfService } from 'src/app/services/employee-myself/employee-myself.service';

@Component({
  selector: 'amis-amis-control-upload-file',
  templateUrl: './amis-control-upload-file.component.html',
  styleUrls: ['./amis-control-upload-file.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmisControlUploadFileComponent),
      multi: true
    }
  ]
})
export class AmisControlUploadFileComponent extends BaseControl
  implements OnInit, ControlValueAccessor {
  @ViewChild('fileInput', { static: false })
  inputUpload: ElementRef;

  @ViewChild('input') input: ElementRef;

  @Input() isCallFromEmployeeApp: boolean = false;

  /**
   * những file được phép upload .jpg,.png mặc định là tất cả
   *
   * @type {string}
   * @memberof AmisControlUploadFileComponent
   */
  _storageType = UploadTypeEnum.EmployeeAttachment;
  @Input()
  get storageType() {
    return this._storageType;
  }
  set storageType(val) {
    this._storageType = val;
  }

  /**
   * những file được phép upload .jpg,.png mặc định là tất cả
   *
   * @type {string}
   * @memberof AmisControlUploadFileComponent
   */
  _acceptFileExtension = '.doc, .xls, .ppt, .docx, .xlsx, .pptx, .odt, .ods, .odp, .pdf, .rtf, .xmind, .mmap, .zip, .7z, .rar, .png, .jpg, .jpeg, .gif, .html, .htm, .dwg, .dwf, .edb, .e2k';
  @Input()
  get acceptFileExtension() {
    return this._acceptFileExtension;
  }
  set acceptFileExtension(val) {
    this._acceptFileExtension = val;
  }

  _apiDownload = "";

  isloadFirst = true;
  isLoadingUpload = false;
  // file upload
  fileUpload: any;
  // link file
  srcFile: any;

  isValidFile = true;
  constructor(
    public httpBase: AmisDataService,
    public amisTransferSV: AmisTransferDataService,
    public amisTranslateSV: AmisTranslationService,
    private uploadSV: UploadService,
    private downloadSV: DownloadService,
    private employeeMyselfService: EmployeeMySelfService
  ) {
    super(amisTransferSV, amisTranslateSV);
  }

  ngOnInit(): void {
  }
  loadDataInit() {
    if (!!this.data.ValueText && !!this.data.Value) {
      this.isloadFirst = false;
      this.displayValue = this.data.ValueText;
      this.value = this.data.Value;
    }
  }


  writeValue(obj: any): void {
    const me = this;
    if (this.isloadFirst) {
      this.loadDataInit();
    }
    if (typeof obj !== "undefined" && obj != null && obj !== me._value) {
      me._value = obj;
      this.onChange(this.value);
    }
  }

  /**
   * click mở upload
   *
   * @memberof AmisControlUploadFileComponent
   */
  uploadFile() {
    this.inputUpload.nativeElement.click();
  }
  /**
   * hàm xóa file đã chọn
   *
   * @memberof AmisControlUploadFileComponent
   * vbcong 01/06/2020
   */
  removeFile() {
    this.value = '';
    this.displayValue = '';
    this.data.ValueText = this.displayValue;
    this.data.AttachmentFileSize = 0;
    this.fileUpload = null;
    this.srcFile = null;
    if (this.listFieldChanged?.length) {
      this.listFieldChanged.forEach(e => {
        if (e.IsUseNotFieldSetValue) {
          // to do
        } else {
          e.Value = null;
        }
      })
      this.valueChangedWithFieldAndValue.emit(this.listFieldChanged);
    }
    const data = {
      File: this.fileUpload,
      FileUrl: this.srcFile
    };
    this.valueChanged.emit(data);
  }
  /**
   * chọn file
   * Created By vbcong 01/06/2020
   */
  onFileChanged(event) {
    if (!event ||
      !event.target ||
      !event.target.files ||
      event.target.files.length === 0) {
      return;
    }
    this.fileUpload = event.target.files[0];

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.srcFile = e.target.result;
        const data = {
          File: this.fileUpload,
          FileUrl: this.srcFile
        };
        // this.valueChanged.emit(data);
      };
    }
    const maxSize = 10485760;
    if (this.fileUpload) {
      const sizeFile = this.fileUpload.size;
      this.validateFileExtension();
      if (sizeFile < maxSize && this.isValidFile) {
        this.uploadFileStorage();
        super.onValueChanged(event);
      } else {
        if (!this.isValidFile) {
          this.amisTransferSV.showErrorToast(this.amisTranslateSV.getValueByKey('IMPORT_ERROR_FILE'));
        }
        if (sizeFile > maxSize) {

          this.amisTransferSV.showErrorToast(this.amisTranslateSV.getValueByKey('TOAST_UPLOAD_ERROR_MAX_SIZE'));
        }
      }
    }
    event.target.value = null;
  }

  /**
   * upload avtar
   * Created By vbcong 01/06/2020
   */
  uploadFileStorage() {
    this.isLoadingUpload = true;
    if (this.isCallFromEmployeeApp) { // nếu gọi từ app nhân viên
      this.employeeMyselfService.uploadFile(this.fileUpload, this.storageType).subscribe(res => {
        this.handleResponse(res);
      }, err => {
        this.isLoadingUpload = false;
        this.amisTransferSV.showErrorToast();
      });
    } else {
      this.uploadSV.uploadFileTemp(this.fileUpload, this.storageType).subscribe(res => {
        this.handleResponse(res);
      }, err => {
        this.isLoadingUpload = false;
        this.amisTransferSV.showErrorToast();
      });
    }
  }



  /**
   * Xử lỹ dữ liệu trả về
   * nmduy 04/10/2020
   */
  handleResponse(res) {
    this.isLoadingUpload = false;
    if (res?.Success && res?.Data) {
      const listFileTemp = [];
      if (res.Data.length > 0) {
        const fileTemp = res.Data[0];
        fileTemp.FileTypeStorage = this.storageType;
        const name = res.Data[0].FileName;
        const lastDot = name.lastIndexOf(".");
        fileTemp.AttachmentTypeName = name.substring(0, lastDot);
        this.value = res.Data[0].FileID;
        this.displayValue = res.Data[0].FileName;
        this.data.Value = this.value;
        this.data.ValueText = this.displayValue;
        this.data.AttachmentFileSize = res.Data[0].FileSize;
        listFileTemp.push(fileTemp);
        if (this.listFieldChanged?.length) {
          this.listFieldChanged.forEach(e => {
            if (e.IsUseNotFieldSetValue) {
              // to do
            } else {
              e.Value = fileTemp[e.FieldSetValue];
            }
          });
          this.valueChangedWithFieldAndValue.emit(this.listFieldChanged);

        }
        this.valueChanged.emit(listFileTemp);
      }
      this.data.ListFileTemp = listFileTemp;
    } else {
      if (!!res?.UserMessage) {
        this.amisTransferSV.showErrorToast(res.UserMessage);
      } else {
        this.amisTransferSV.showErrorToast(this.amisTranslateSV.getValueByKey('ERROR_HAPPENED'));
      }
    }
  }






  /**
   * hàm download file
   *
   * @param {any} fileName
   * @memberof AmisControlUploadFileComponent
   * vbcong 08/06/2020
   */
  downLoadAttachment(fileName) {
    if (!this.isCallFromEmployeeApp) {
      this.downloadSV.getTokenFile(fileName, this.storageType).subscribe(res => {
        if (res && res.Success && res.Data) {
          if (!!this._apiDownload) {
            window.open(this.downloadSV.downloadCustomeFile(res.Data, this._apiDownload), '_blank');
          } else {
            window.open(this.downloadSV.downloadFile(res.Data), '_blank');
          }
        } else {
          this.amisTransferSV.showErrorToast();
        }
      }, error => {
        this.amisTransferSV.showErrorToast();
      });
    }
  }

  /**
   *
   *
   * @memberof AmisControlUploadFileComponent
   */
  setCustomConfigInField(cusConfig) {

    if (cusConfig.AcceptFileExtension) {
      this._acceptFileExtension = cusConfig.AcceptFileExtension;
    }
    this._apiDownload = cusConfig.ApiDownload ? cusConfig.ApiDownload : this._apiDownload;

  }

  validateFileExtension() {
    const namefile = this.fileUpload?.name;
    if (namefile) {

      const extension = namefile.substring(namefile.lastIndexOf("."), namefile.length);
      if (this._acceptFileExtension.includes(extension)) {
        this.isValidFile = true;
      }
      else {
        this.isValidFile = false;
      }
    }
  }

}

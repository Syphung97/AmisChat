import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/common/components/base-component';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { UploadTypeEnum } from '../../enum/uploadType/upload-type.enum';
import { FileTypeEnum } from 'src/common/models/export/file-type.enum';
import { typeFiles } from '../../constant/typeFile/type-file';
import { ExtractCvService } from 'src/app/services/extract-cv/extract-cv.service';
import { Gender } from '../../constant';
import { DownloadService } from 'src/app/services/base/download.service';
import { NotifyProcessType } from '../../enum/import-process/import-process.enum';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { HrmProfileCreateComponent } from 'src/app/components/hrm-profile/hrm-profile-create/hrm-profile-create.component';

@Component({
  selector: 'amis-popup-identified-employee',
  templateUrl: './popup-identified-employee.component.html',
  styleUrls: ['./popup-identified-employee.component.scss']
})
export class PopupIdentifiedEmployeeComponent extends BaseComponent implements OnInit {

  // Input hiển thị popup
  @Input() visiblePopup: boolean = false;

  @Input() set position(data) {
    if (data) {
      this.getPos(data);
      return;
    }
    this.positionLoad = {
      left: "0px",
      top: "0px",
      bottom: "0px",
      right: "0px",
    }
  };

  // Output đóng popup
  @Output() outputCancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() outputSaveSuccess: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('importAttach') importAttach: ElementRef;
  @ViewChild("profileCreate") profileCreate: HrmProfileCreateComponent;

  //biến check đang ở trang thái import file hay đã import rồi
  visibleImport: boolean = true;

  //danh sách đuôi file chấp thuận
  _typeAccept = ".doc,.docx,.pdf";
  //danh sách đuôi file hệ thống chấp thuận
  _acceptFileExtension = '.doc,.xls,.ppt,.docx,.xlsx,.pptx,.odt,.ods,.odp,.pdf,.rtf,.xmind,.mmap,.zip,.7z,.rar,.png,.jpg,.jpeg,.gif,.html,.htm,.dwg,.dwf,.edb,.e2k';

  //loại file
  enumFileType = FileTypeEnum;

  //danh sách type file
  fileType = typeFiles;

  //file upload
  file: any;
  //tên file
  fileName = "";
  //lỗi khi upload file
  errorUpload = "";
  //kiểm tra lỗi upload 
  isValidate = true;

  //data truyền vào thêm hồ sơ
  paramLayout: any;
  //form tải liệu hay thêm mới
  isCreateEmployee = false;

  // object lấy position
  positionLoad = {
    left: "0px",
    top: "0px",
    bottom: "0px",
    right: "0px",
  }

  //trang thái đang nhận diện
  isIdentifieding = false;

  avatarID = "";

  // Hiển thị popup thông báo
  visiblePopupNotify: boolean = false;

  // Hiển thị popup thông báo
  popupNotifyContent: string = "Hệ thống không đọc được thông tin trên tệp hồ sơ này. Bạn có muốn chọn lại tệp khác không?";

  constructor(
    private amisTransferSV: AmisTransferDataService,
    private employeeService: EmployeeService,
    private translateSV: AmisTranslationService,
    private extractCvSV: ExtractCvService,
    private downloadService: DownloadService,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  /**
   * bắt sk kéo thả file
   * Created By PVTHONG 07/08/2020
   */
  onFileDropped(listFiles) {
    if (listFiles) {
      let event = { target: { files: listFiles } };
      this.onFileChange(event);
    }
  }

  /**
   * Bắt sk import file
   * Created By PVTHONG 07/08/2020
   */
  importFile() {
    this.importAttach?.nativeElement?.click();
  }

  /**
   * Bắt sự kiên file change
   * Created By PVTHONG 07/08/2020
   */
  onFileChange(e) {
    if (e?.target?.files?.length > 0) {
      this.file = e.target.files[0];
      this.fileName = this.file.name;
      let sizeFiles = 0;
      for (let index = 0; index < e.target.files.length; index++) {
        sizeFiles += e.target.files[index].size;
      }
      sizeFiles = sizeFiles / 1024 / 1024;
      if (sizeFiles > 15) {
        this.visibleImport = false;
        this.isValidate = false;
        this.errorUpload = "Dung lượng vượt quá 15MB, vui lòng chọn lại tệp khác.";
        // this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("OVER_CAPACITY"));
        return;
      } else {
        this.isValidate = true;
      }
      this.visibleImport = false;
      this.validateFile([this.file]);
      // if (valueValidate) {
      //   this.visibleImport = false;
      // }
      // else {
      //   this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("IMPORT_ERROR_FILE"));
      // }
    }
  }

  /**
   * validate đuôi và dung lượng file
   * Created by pvthong- 04/08/2020
   */
  validateFile(files) {
    for (let index = 0; index < files.length; index++) {
      let extensionFile = "." + files[index].name.split('.')[files[index].name.split('.').length - 1];

      // nếu không nằm trong các loại type truyền vào
      if (this._typeAccept) {
        let exten = this._typeAccept?.split(',');
        if (!exten?.includes(extensionFile)) {
          this.isValidate = false;
          this.errorUpload = "Định dạng file không hợp lệ. Chấp nhận file .doc, .docx và .pdf.";
          return false;
        }
      }
      else {
        let exten = this._acceptFileExtension?.split(',');
        if (!exten?.includes(extensionFile.toLowerCase())) {
          this.isValidate = false;
          this.errorUpload = "Định dạng file không hợp lệ. Chấp nhận file .doc, .docx và .pdf.";
          return false;
        }
      }

    }
    this.isValidate = true;
    return true;
  }

  /**
   * click nhận diện
   * Created by pvthong- 12/08/2020
   */
  identified() {
    if (!this.file) {
      return;
    }
    this.isIdentifieding = true;
    let param = {
      typeNotify: NotifyProcessType.IDENTIFIED,
      title: "Trạng thái nhận diện hồ sơ",
      contentNotify: "Đang thực hiện đọc thông tin hồ sơ. Vui lòng chờ trong giây lát",
      iconNotify: "icon-identified-big",
      isDisplayFileName: false
    }
    this.amisTransferSV.StatusImport(param);

    this.extractCvSV.extracCvHandler(this.file).subscribe(res => {

      if (res?.Success) {
        let param = {
          isVisibleStatus: false
        }

        let data = res.Data;
        //gán ngày sinh
        if (!!data?.Birthday) {
          let temp = data.Birthday.split("/");
          data.Birthday = (new Date(temp[2], temp[1]-1, temp[0]));
        }
        //gán giới tính
        if (!!data?.Gender) {
          data.GenderID = data.Gender;
          data.GenderName = data.GenderID == Gender.Male ? "Nam" : "Nữ";
        }
        //gán tên
        if (data?.FullName) {
          let index = data.FullName.lastIndexOf(' ');
          if (index >= 0) {
            data.FirstName = data.FullName.substring(0, index);
            data.LastName = data.FullName.substring(index + 1);
          }
        }
        this.avatarID = res.Data?.AvatarID;
        // data.UserID = res.Data?.AvatarID;
        let checkAvatar = false;
        //gán avatar
        this.downloadService.getTokenFile(data.AvatarID, UploadTypeEnum.Avatar).subscribe(res => {
          if (res) {
            data.Avatar = this.downloadService.downloadFile(res.Data);
            checkAvatar = true;
          }
          else {
            checkAvatar = true;
          }
        }, err => {
          checkAvatar = true;
        })

        const interval = setInterval(() => {
          if (checkAvatar) {
            this.paramLayout = {
              MasterData: data,
              IsUseMasterData: true
            }
            this.amisTransferSV.showSuccessToast("Nhận diện hồ sơ thành công");
            this.isIdentifieding = false;
            this.amisTransferSV.StatusImport(param);
            this.amisTransferSV.hideLoading();
            this.isCreateEmployee = true;
            clearInterval(interval);
          }
        }, 0);


      }
      else {
        let param = {
          isVisibleStatus: false
        }
        this.visiblePopupNotify = true;
        this.amisTransferSV.StatusImport(param);
      }

    }, err => {
      let param = {
        isVisibleStatus: false
      }
      this.isIdentifieding = false;
      this.amisTransferSV.StatusImport(param);
      this.amisTransferSV.showErrorToast();
    });
  }

  /**
   * lưu hồ sơ thành công
   * Created By PVTHONG 07/08/2020
   */
  afterSaveSuccess(e) {
    if (this.profileCreate.fileUpload) {
      this.outputSaveSuccess.emit(true);
    }
    else {
      //cập nhật avatar
      let param = {
        ModelName: "Employee",
        FieldKey: "EmployeeID",
        ValueKey: e.Data?.EmployeeID,
        FieldNameAndValue: {
          UserID: this.avatarID
        }
      }
      this.employeeService.updateEmployeeField(param).subscribe(res => {
        this.outputSaveSuccess.emit(true);
      }, err => {
        this.outputSaveSuccess.emit(true);
      });
    }

  }

  /**
   * Xử lý đóng popup
   * Created By PVTHONG 07/08/2020
   */
  closePopup() {
    this.visiblePopup = false;
    this.amisTransferSV.hideLoading();
    setTimeout(() => {
      this.outputCancel.emit(true);
    }, 100)
  }

  /**
   * Lấy vị trí của ID truyền vào
   * Created by PVTHONG 31/07/2020
   */
  getPos(data) {
    let obj: any = {};
    const pos = document.querySelector(`#${data}`)?.getBoundingClientRect();
    if (pos) {
      obj["left"] = `${pos.left}px`;
      obj["top"] = `${pos.top}px`;
      obj["right"] = `${pos.right - (pos.width + pos.left)}px`;
      obj["bottom"] = `${pos.bottom - (pos.height + pos.top)}px`;
    }
    this.positionLoad = obj;
  }

  /**
   * Nhấn confirm trên popup notify
   * created by PVTHONG 31/07/2020
   */
  onConfirm() {
    this.visiblePopupNotify = false;
    this.isIdentifieding = false;
    setTimeout(()=>{
      this.importAttach?.nativeElement?.click();
    })
    
  }
}

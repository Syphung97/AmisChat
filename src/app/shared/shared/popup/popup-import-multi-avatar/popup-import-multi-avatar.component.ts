import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { UploadService } from 'src/app/services/base/upload.service';
import { AmisTransferDataService } from 'src/common/services/amis-transfer-data.service';
import { AmisTranslationService } from 'src/common/services/amis-translation.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { BaseComponent } from 'src/common/components/base-component';
import { ValidateFileEnum } from 'src/app/shared/enum/validate-file/validate-file.enum';
import { Observable } from 'rxjs';
import { AmisCommonUtils } from 'src/common/fn/common-utils';
import { UploadTypeEnum } from '../../enum/uploadType/upload-type.enum';
import { NotifyProcessType } from '../../enum/import-process/import-process.enum';

@Component({
  selector: 'amis-popup-import-multi-avatar',
  templateUrl: './popup-import-multi-avatar.component.html',
  styleUrls: ['./popup-import-multi-avatar.component.scss']
})

export class PopupImportMultiAvatarComponent extends BaseComponent implements OnInit {

  //#region popup base
  @Input()
  visiblePopup = false;

  // Output hủy
  @Output()
  outputCancel: EventEmitter<any> = new EventEmitter<any>();

  //#endregion

  //#region popup notify
  visibleNotify: boolean = false;
  // nội dung xóa trong popup vị trí công việc
  contentNotify = "";
  isPopupWarning: boolean = false;
  //hành động khởi nguồn cảnh báo
  warningTarget;
  //#endregion

  //#region tooltip-popover
  visiblePopover: boolean = false;
  // vị trí hiện tooltip
  tooltipTarget: any;
  //nội dung tooltip
  tooltipContent: string;
  //#endregion

  //#region tải lên file
  isDisableBtnSave: boolean = true;
  visibleImport: boolean = true;
  //#endregion

  //#region danh ảnh tải lên
  @ViewChild('importTemplateDoc') importTemplateDoc: ElementRef;
  //ds ảnh để render lên html
  listAvatar: Avatar[] = [];
  //ds ảnh để upload
  listAvatarUpload: Avatar[] = [];
  //số lượng ảnh tối đa tải lên trong 1 lần
  maxximumUpload: number = AvatarProperty.MaxNumber;
  //giới hạn dung lượng file tải lên (MB)
  maxximumFileSize: number = AvatarProperty.MaxSize;
  //đang làm việc (tính từ lúc ng dùng sửa tên ảnh đến khi cập nhật xong hoặc chọn lại toàn bộ ảnh)
  isWorking = false;
  currentAvatar: Avatar = new Avatar();
  //#endregion

  //trạng thái upload
  state = State;

  // đã chỉnh sửa
  isEdited = false;
  isDisableBtnChoose = false;
  @Output() afterSaveSuccess: EventEmitter<any> = new EventEmitter();

  constructor(private uploadSV: UploadService,
    private amisTransferSV: AmisTransferDataService,
    private translateSV: AmisTranslationService,
    private employeeSV: EmployeeService) {
    super();
  }

  ngOnInit(): void {
  }

  //#region popup base
  /**
   * Xử lý đóng popup
   * dtnam1 17/06/2020
   * 
   */
  cancel() {
    if (this.isEdited || this.isWorking) {
      this.warningTarget = WaringType.Cancel;
      this.showPopupWarning(this.translateSV.getValueByKey("IMPORT_MULTI_AVATAR_WARNING_CANCEL"));
    }
    else {
      this.closePopup();
    }
  }

  closePopup() {
    this.visiblePopup = false;
    this.outputCancel.emit();
  }

  /**
   * bắt sk click button save
   * dtnam1 17/06/2020
   */
  saveFile() {
    this.isWorking = true;
    this.isDisableBtnSave = true;

    this.listAvatarUpload = this.listAvatar.filter(x =>
      x.State != State.Success && x.Uploaded && !x.Errors?.length);
    this.handleLoadingForAvatar(true, this.listAvatarUpload);
    if (this.listAvatarUpload.length){
      this.getUserIDWithEmployeeCode(this.listAvatarUpload).subscribe(() => {
  
        this.validateBeforeUpload(this.listAvatarUpload);
  
        this.listAvatarUpload = this.listAvatarUpload.filter(x =>
          !x.Errors?.length);
  
        if (this.listAvatarUpload.length) {
          this.updateUserIDForAvatar(this.listAvatarUpload);
        }
        else{
          this.isWorking = false;
          this.isDisableBtnSave = false;
        }
      })
    }
  }
  //#endregion

  //#region popup notify
  /**
   * Xử lý đóng popup
   * dtnam1 17/06/2020
   */
  cancelPopupNotify() {
    this.visibleNotify = false;
  }

  /**
   * xác nhận popup thông báo
   * dtnam1 17/06/2020
   */
  acceptPopupNotify() {
    if (this.warningTarget === WaringType.Cancel) {
      this.closePopup();
    }
    if (this.warningTarget === WaringType.Choose) {
      this.importTemplateDoc?.nativeElement?.click();
    }
    if (this.warningTarget === WaringType.Delete) {
      this.deleteAvatar(this.currentAvatar);
    }
    this.isEdited = false;
    this.cancelPopupNotify();
  }

  /**
   * hiện popup thông báo
   * @param message nội dung thông báo
   * dtnam1 17/06/2020
   */
  showPopupNotify(message) {
    this.isPopupWarning = false;
    this.visibleNotify = true;
    this.contentNotify = message;
  }

  /**
   * hiện popup cảnh báo
   * @param message nội dung
   * dtnam1 17/06/2020
   */
  showPopupWarning(message) {
    this.isPopupWarning = true;
    this.visibleNotify = true;
    this.contentNotify = message;
  }

  //#endregion

  //#region tooltip-popover

  /**
   * Hiện tooltip thông báo
   * dtnam1 17/06/2020
   * @param e 
   * @param item 
   */
  showToolTip(e, item: Avatar) {
    this.tooltipTarget = e?.target;
    if (item.NotifyMessage) this.tooltipContent = item.NotifyMessage;
    else if (item?.Errors?.includes(ValidateTypeEnum.Empty)) this.tooltipContent = this.translateSV.getValueByKey("IMPORT_MULTI_AVATAR_VALIDATE_EMPTY");
    else if (item?.Errors?.includes(ValidateTypeEnum.Duplicate)) this.tooltipContent = this.translateSV.getValueByKey("IMPORT_MULTI_AVATAR_VALIDATE_DUPLICATE");
    else if (item?.Errors?.includes(ValidateTypeEnum.NotMatchEmployeeCode)) this.tooltipContent = this.translateSV.getValueByKey("IMPORT_MULTI_AVATAR_NOT_MATCH");
    else if (item?.Errors?.includes(ValidateTypeEnum.OutnerOrg)) this.tooltipContent = this.translateSV.getValueByKey("IMPORT_MULTI_AVATAR_OUTNER_ORG");
    else if (item?.Errors?.includes(ValidateTypeEnum.Deleted)) this.tooltipContent = this.translateSV.getValueByKey("DELETED_EMPLOYEE_NOTIFY");

    this.visiblePopover = true;
  }

  /**
   * gán thông báo cho ảnh
   * @param message thong báo
   * @param listAvatar ds ảnh
   * @param isUploadType loại lỗi (true: lỗi tải ảnh lên, false: lỗi merge id cho ảnh)
   * dtnam1 17/06/2020
   */
  showErrorNotifyToolTip(message, listAvatar: Avatar[], isUploadType = false) {
    listAvatar.forEach(element => {
      if (isUploadType) {
        element.Uploaded = false;
        element.State = State.Success;
      }
      else {
        element.State = State.Fail;
      }
      element.NotifyMessage = message;
    });
    this.handleLoadingForAvatar(false, listAvatar);
  }
  //#endregion

  //#region tải file lên client
  /**
   * Bắt sk import file
   * dtnam1 17/06/2020
   */
  importFile() {
    if (this.isWorking) {
      this.warningTarget = WaringType.Choose;
      this.showPopupWarning(this.translateSV.getValueByKey("IMPORT_MULTI_AVATAR_PICK_IMAGE"));
    } else
      this.importTemplateDoc?.nativeElement?.click();
  }

  /**
   * bắt sk kéo thả file
   * dtnam1 17/06/2020
   */
  onFileDropped(listFiles) {
    if (listFiles) {
      let event = { target: { files: listFiles } };
      this.onFileChange(event);
    }
  }

  /**
   * xử lý kích cỡ ảnh
   * @param e response của event onload
   * @param pointer con trỏ (this)
   * dtnam1 17/06/2020
   */
  handleAvatarSize(img, pointer) {
    // Resize the image
    let imgSize = pointer.resizeAvatar(img.width, img.height);
    img.width = imgSize.Width;
    img.height = imgSize.Height;

    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    var dataUrl = canvas.toDataURL('image/jpeg');
    return pointer.dataURLToBlob(dataUrl, img.imageName);
  }

  /**
   * thay đổi kích thước ảnh
   * @param width 
   * @param height
   * dtnam1 17/06/2020
   */
  resizeAvatar(width, height) {
    let maxWidth = AvatarProperty.MaxWidth, maxHeight = AvatarProperty.MaxHeight;
    if (width > height) {
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }
    }
    return {
      Width: width,
      Height: height
    }
  }

  /**
   * chuyển dataUrl của file về object file
   * @param dataURL 
   * @param fileName
   * dtnam1 17/06/2020
   */
  dataURLToBlob(dataURL, fileName) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = parts[1];
      return new File([raw], fileName, { type: contentType });
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw: any = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    let file: any = new File([uInt8Array], fileName, { type: contentType });
    return <File>file;
  }

  /**
   * Bắt sự kiên file change
   * dtnam1 17/06/2020
   * @param e event
   */
  onFileChange(e) {
    if (e?.target?.files?.length > 0) {
      let files = e.target.files;
      let valueValidate = this.validateChooseFile(files);
      if (valueValidate === ValidateFileEnum.Valid) {
        if (this.visibleImport)
          this.visibleImport = false;
        if (typeof FileReader !== 'undefined') {

          // this.isWorking = true;
          this.isDisableBtnChoose = true;
          this.isDisableBtnSave = false;

          let newListAvatar = [];
          for (let i = 0; i < files.length; i++) {
            let element = new Avatar();
            element.Employee.EmployeeCode = this.removeExtensionFile(files[i].name);
            const reader: any = new FileReader();
            reader.readAsDataURL(files[i]);
            let me = this;
            reader.onload = (e: any) => {
              element.IMGData = e.target.result;
              var image = new Image();
              image.src = e.target.result;
              image.onload = (img: any) => {
                img.target.imageName = files[i].name;
                element.File = this.handleAvatarSize(img.target, me);
                if (!this.listAvatar.find(x => !x.File)) {
                  this.onUpload();
                }
              }
            }
            this.listAvatar.push(element);
            newListAvatar.push(element);
          }

          this.handleLoadingForAvatar(true, newListAvatar);
        }
        // this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("TOAST_IMPORT_IMAGE_SUCCESS"));
      } else if (valueValidate === ValidateFileEnum.ExtensionInvalid) {
        this.showPopupNotify(this.translateSV.getValueByKey("POPUP_INFOR_FILE_EXTENSION_INVALID"));
      } else if (valueValidate === ValidateFileEnum.OverSize) {
        this.showPopupNotify(this.translateSV.getValueByKey("POPUP_INFOR_FILE_OVERSIZE", { FileSize: this.maxximumFileSize }));
      } else if (valueValidate === ValidateFileEnum.Exsist) {
        this.showPopupNotify(this.translateSV.getValueByKey("POPUP_INFOR_FILE_EXSIST"));
      } else if (valueValidate === ValidateFileEnum.OverNumber) {
        this.showPopupNotify(this.translateSV.getValueByKey("IMPORT_MULTI_AVATAR_NOTIFY_OVERNUMBER", { MaxximumUpload: this.maxximumUpload }));
      }
    }
  }

  /**
   *
   * dtnam1 17/06/2020
   */
  onUpload() {

    this.listAvatarUpload = this.listAvatar.filter(x => !x.Uploaded);
    this.handleUpload(this.listAvatarUpload);
  }

  /**
   * upload ảnh lên temp
   * @param avatars
   * dtnam1 17/06/2020
   */
  handleUpload(avatars) {
    if (!avatars.length) {
      if (!this.listAvatar.find(x => !x.Uploaded)) {
        // this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("TOAST_IMPORT_IMAGE_SUCCESS"));
      }
      // this.isWorking = false;
      // this.isDisableBtnSave = false;
      this.isDisableBtnChoose = false;
      return;
    }
    let avatarUpdates = [];
    let remainAvatars = AmisCommonUtils.cloneDataArray(avatars);
    let sum = 0;
    for (let i = 0; i < avatars.length; i++) {
      const element = avatars[i];
      sum += 1;
      if (sum <= 5) {
        avatarUpdates.push(element);
        remainAvatars.shift();
      } else {
        break;
      }
    }
    if (avatarUpdates.length) {
      this.uploadAvatars(avatarUpdates, remainAvatars);
    }
  }

  /**
   * upload ảnh
   * dtnam1 17/06/2020
   */
  uploadAvatars(listAvatar: Avatar[], remainAvatars) {
    let files = listAvatar.map(x => x.File);
    this.uploadSV.uploadFileHandleMultiple(files, UploadTypeEnum.Avatar, true).subscribe(res => {
      if (res?.Success && res.Data) {
        res.Data.forEach((d, index) => {
          let av = this.listAvatar.find(x => x.Employee.EmployeeCode === listAvatar[index].Employee.EmployeeCode);
          av.File.FileID = d.FileID;
          av.Uploaded = true;
        });
        this.handleLoadingForAvatar(false, listAvatar);
      }
      else {
        this.showErrorNotifyToolTip(this.translateSV.getValueByKey("TOAST_UPDATE_IMAGE_FAIL"), listAvatar, true);
        this.handleLoadingForAvatar(false, listAvatar);
      }
      this.handleUpload(remainAvatars);
    }, err => {
      this.showErrorNotifyToolTip(this.translateSV.getValueByKey("ERROR_HAPPENED"), listAvatar, true);
      this.handleUpload(remainAvatars);
    });
  }

  /**
   * Loại bỏ đuôi trong tên file
   * @param fileName
   * dtnam1 17/06/2020
   */
  removeExtensionFile(fileName) {
    return fileName?.split('.').slice(0, -1).join('.');
  }

  /**
   * validate khi chọn file
   * dtnam1 17/06/2020
   */
  validateChooseFile(files): number {
    if (files) {
      for (let index = 0; index < files.length; index++) {
        let fileName = files[index]?.name;
        if (fileName) {
          let extensionFile = fileName.split('.')[fileName.split('.').length - 1]?.toLowerCase();
          if (!['png', 'jpg', 'gif', 'tiff', 'bmp'].includes(extensionFile)) {
            return ValidateFileEnum.ExtensionInvalid;
          } else if (files[index].size > Math.pow(1024, 2) * this.maxximumFileSize) {
            return ValidateFileEnum.OverSize;
          } else if (this.listAvatar.length + files.length > this.maxximumUpload) {
            return ValidateFileEnum.OverNumber;
          } else if (this.listAvatar.find(avatar => avatar.Employee.EmployeeCode === this.removeExtensionFile(fileName))) {
            return ValidateFileEnum.Exsist;
          }
        }
      }
      return ValidateFileEnum.Valid;
    }
  }
  //#endregion

  //#region xử lý ds ảnh vs cập nhật lên server

  /**
   * bật/tắt loading cho ảnh
   * dtnam1 17/06/2020
   * @param turnOnLoading true: bật, false: tắt 
   * @param listAvatar ds ảnh
   */
  handleLoadingForAvatar(turnOnLoading: boolean, listAvatar: Avatar[]) {
    if (listAvatar.length) {
      listAvatar.forEach(element => {
        element.Loading.startCall = turnOnLoading;
        element.Loading.finishCall = !turnOnLoading;
      });
    }
  }

  /**
   * hàm hiện loading khi xuất khẩu
   * dtnam1 01/09/2020
   */
  // handleLoadingUpload(isLoad) {
  //   let param = {
  //     typeNotify: NotifyProcessType.IDENTIFIED,
  //     title: "Trạng thái tải lên",
  //     contentNotify: "Đang tải ảnh lên máy chủ",
  //     iconNotify: "icon-upload-big-black",
  //     isDisplayFileName: false,
  //     isVisibleStatus: isLoad
  //   }
  //   this.amisTransferSV.StatusImport(param);
  // }

  /**
   * thay đổi trang thái button save khi trong ds ảnh có phần tử không hợp lệ
   * dtnam1 17/06/2020
   */
  changeButtonSaveState() {
    let listInvalid = this.listAvatar.filter(f => f?.Errors?.length);
    let listUpdateSuccess = this.listAvatar.filter(f => f?.State === State.Success);
    if (listInvalid?.length > 0 ||
      !this.listAvatar.length ||
      listUpdateSuccess?.length === this.listAvatar.length
    ) {
      this.isDisableBtnSave = true;
    }
    else if (!this.isWorking) {
      this.isDisableBtnSave = false;
    }
  }


  /**
   * show popup confirm xóa
   * dtnam1 17/06/2020
   */
  beforeDeleteAvatar(item: Avatar) {
    this.currentAvatar = item;
    this.warningTarget = WaringType.Delete;
    this.showPopupWarning(this.translateSV.getValueByKey("IMPORT_MULTI_AVATAR_QUESTION_DELETE"));
  }

  /**
   * xóa 1 ảnh
   * dtnam1 17/06/2020
   * @param employeeCode 
   */
  deleteAvatar(item: Avatar) {
    this.listAvatar = this.listAvatar.filter(avatar => avatar.File.name !== item.File.name);
    let listDuplicate = this.listAvatar.filter(avatar => avatar.Employee.EmployeeCode.toLowerCase().trim() === item.Employee.EmployeeCode.toLowerCase().trim());

    if (!this.listAvatar.length){
      this.isDisableBtnSave = true;
    }
    if (listDuplicate.length === 1) {
      listDuplicate[0].Errors = listDuplicate[0].Errors.filter(x => x !== ValidateTypeEnum.Duplicate);
    }
    // this.changeButtonSaveState();
    // this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("TOAST_DELETE_IMAGE_SUCCESS"));
  }

  /**
   * lây ds nhân viên bằng EmployeeCode
   * dtnam1 17/06/2020
   */
  getUserIDWithEmployeeCode(listAvatar: Avatar[]): Observable<any> {
    return new Observable(subscriber => {
      let listEmployeeCode = listAvatar.map(element => element.Employee.EmployeeCode);
      this.employeeSV.GetEmployeesByEmployeeCode(listEmployeeCode).subscribe(res => {
        if (res?.Success && res.Data) {
          this.listAvatar.forEach(avatar => {
            let avatarMapping = res.Data.find(f =>
              f.EmployeeCode.toLowerCase().trim() === avatar.Employee.EmployeeCode.toLowerCase().trim());

            avatar.Employee.UserID = avatarMapping?.UserID;
            avatar.Employee.EmployeeID = avatarMapping?.EmployeeID;
            avatar.Deleted = avatarMapping?.IsDeleted;
            avatar.HasRight = !avatarMapping?.IsOutnerOrg;
          });
          subscriber.next();
        }
        else if (res?.ValidateInfo?.length > 0) {
          this.showErrorNotifyToolTip(res.ValidateInfo[0].ErrorMessage, listAvatar);
          this.isDisableBtnSave = false;
        }
        else {
          this.showErrorNotifyToolTip(this.translateSV.getValueByKey("TOAST_UPDATE_IMAGE_FAIL"), listAvatar);
          this.isDisableBtnSave = false;
        }
      }, err => {
        this.showErrorNotifyToolTip(this.translateSV.getValueByKey("ERROR_HAPPENED"), listAvatar);
        this.isDisableBtnSave = false;
      });
    })
  }

  /**
   * khi thay đổi giá trị mã nhân viên thì validate
   * @param avatar
   * dtnam1 17/06/2020
   */
  validateText(e, item: Avatar) {
    this.isEdited = true;
    item.Errors = [];
    item.NotifyMessage = null;
    if(this.listAvatar.filter(x => !x.Employee.EmployeeCode).length > 0){
      this.isDisableBtnSave = true;
    }
    else{
      this.isDisableBtnSave = false;
    }

    if (item?.State !== State.Success) {
      let avatar = this.listAvatar.find(element =>
        item.File.name === element.File.name
      );
      if (!item.Employee.EmployeeCode) {
        avatar?.Errors?.push(ValidateTypeEnum.Empty);
      } else {
        let duplicate = this.listAvatar.filter(f => f.Employee.EmployeeCode.toLowerCase().trim() === item.Employee.EmployeeCode.toLowerCase().trim());
        if (e) {
          let preDuplicate = this.listAvatar.filter(f => f.Employee.EmployeeCode.toLowerCase().trim() === e.previousValue.toLowerCase().trim());
          if (preDuplicate.length === 1) {
            preDuplicate[0].Errors = preDuplicate[0].Errors.filter(x => x !== ValidateTypeEnum.Duplicate);
          }
        }
        if (duplicate?.length > 1) {
          avatar?.Errors.push(ValidateTypeEnum.Duplicate);
        }
      }

      // this.changeButtonSaveState();
    }
  }

  /**
   * cập nhật userid cho ảnh
   * dtnam1 17/06/2020
   */
  updateUserIDForAvatar(listAvatar: Avatar[]) {
    let param = [];
    listAvatar.forEach(av => {
      param.push({
        FileType: UploadTypeEnum.Avatar,
        FileId: av.File.FileID,
        FileIdDest: av.Employee.UserID,
        IsTempSource: true,
        IsTempDestination: false,
        Employee: av.Employee
      })
    });
    this.uploadSV.updateUserIDForAvatar(param).subscribe(res => {
      if (res.Success && res?.Data) {
        res.Data.forEach(d => {
          let av = listAvatar.find(x => x.File.FileID === d.Data);
          av.State = d.Success ? State.Success : State.Fail;
          if (!d.Success) {
            av.NotifyMessage = this.translateSV.getValueByKey("TOAST_UPDATE_IMAGE_FAIL");
          }
          if (!this.listAvatar.find(x => x.State !== State.Success)){
            this.amisTransferSV.showSuccessToast(this.translateSV.getValueByKey("TOAST_UPDATE_IMAGE_SUCCESS"));
            this.closePopup();
          }
          this.handleLoadingForAvatar(false, [this.listAvatar.find(x => x.File.FileID === d.Data)]);
        });
      }
      else {
        this.showErrorNotifyToolTip(this.translateSV.getValueByKey("TOAST_UPDATE_IMAGE_FAIL"), listAvatar);
        this.handleLoadingForAvatar(false, listAvatar);
      }
      this.afterSaveSuccess.emit();
      this.isWorking = false;
      this.isDisableBtnSave = false;
    }, err => {
      this.showErrorNotifyToolTip(this.translateSV.getValueByKey("ERROR_HAPPENED"), listAvatar);
      this.handleLoadingForAvatar(false, listAvatar);
      this.afterSaveSuccess.emit();
      this.isWorking = false;
      this.isDisableBtnSave = false;
    });
  }

  /**
   * validateBeforeUpload
   * dtnam1 17/06/2020
   */
  validateBeforeUpload(listAvatar: Avatar[]) {
    //validate tên ảnh với mã nhân viên
    listAvatar.forEach(avatar => {
      //nếu không tìm đc userid tương ứng
      if (!avatar?.Employee.UserID) {
        avatar.Errors.push(ValidateTypeEnum.NotMatchEmployeeCode);
      }
      //nếu hồ sơ đang ở trong thùng rác
      else if (avatar.Deleted) {
        avatar.Errors.push(ValidateTypeEnum.Deleted);
      }
      //nếu hồ sơ không nằm trong  phạm vi quyền hạn
      else if (!avatar.HasRight) {
        avatar.Errors.push(ValidateTypeEnum.OutnerOrg);
      }
      if (!avatar?.Employee.UserID || avatar.Deleted || !avatar.HasRight) {
        avatar.State = State.Fail;
        this.handleLoadingForAvatar(false, [avatar]);
      }
    });
  }

}
export class Avatar {
  /**
   * data của ảnh
   */
  IMGData: string = null
  /**
   * file ảnh
   */
  File: any = null
  /**
   * dữ liệu nhân viên
   */
  Employee: any = {}
  /**
   * ds lỗi
   */
  Errors: number[] = []
  /**
   * trạng thái cập nhật ảnh
   */
  State: State = State.None
  /**
   * trạng thái upload của file lên temp
   */
  Uploaded: boolean = false
  /**
   * trạng thái hồ sơ (true: bị xóa vào thùng rác)
   */
  Deleted: boolean = false
  /**
   * trạng thái quyền cập nhật ảnh (true: có quyền)
   */
  HasRight: boolean = true
  /**
   * các dữ liệu loading
   */
  Loading: any = {}
  /**
   * câu thông báo lỗi
   */
  NotifyMessage: string = null

  constructor() {
  }
}

export enum ValidateTypeEnum {
  // trống
  Empty = 1,
  // trùng
  Duplicate = 2,
  // không khớp vs mã nhân viên
  NotMatchEmployeeCode = 3,
  // đang ở trong thùng rác
  Deleted = 4,
  // không nằm trong  phạm vi quyền hạn
  OutnerOrg = 5
}
export enum State {
  // upload ảnh thành công
  Success = 1,
  // upload ảnh thất bại
  Fail = 2,
  // chưa upload ảnh
  None = 2,
}
export enum WaringType {
  // cảnh báo hủy
  Cancel = 1,
  //cảnh báo chọn file
  Choose = 2,
  //cảnh báo xóa
  Delete = 3
}
export enum AvatarProperty {
  // số ảnh tối đa tải lên
  MaxNumber = 50,
  // dung lượng tối đa một ảnh (MB)
  MaxSize = 10,
  // chiều rộng tối đa
  MaxWidth = 1366,
  // chiều cao tối đa
  MaxHeight = 768
}
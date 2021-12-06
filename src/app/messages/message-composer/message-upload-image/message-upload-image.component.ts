import { Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AmisTranslationService } from 'src/app/core/services/amis-translation-service.service';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { UploadService } from 'src/app/core/services/upload.service';
import { UploadTypeEnum } from 'src/app/shared/enum/upload-type.enum';
import { ValidateFileEnum } from 'src/app/shared/enum/validate-file.enum';

@Component({
  selector: 'amis-message-upload-image',
  templateUrl: './message-upload-image.component.html',
  styleUrls: ['./message-upload-image.component.scss']
})
export class MessageUploadImageComponent implements OnInit {

  @ViewChild('importTemplateDoc', { static: false }) importTemplateDoc!: ElementRef;

  // tslint:disable-next-line:variable-name
  _typeAccept = [".png", ".jpg", ".jpeg", ".gif", ".tiff", ".jfif"];

  // tslint:disable-next-line:variable-name
  _acceptFileExtension: any = ".png, .jpg, .jpeg, .gif, .tiff, .jfif";

  // tslint:disable-next-line:variable-name
  _isVisible: any;
  @Input() set isVisible(data) {
    if (data) {
      this._isVisible = data;
      setTimeout(() => {
        this.importTemplateDoc?.nativeElement?.click();
      }, 1000);
    }

  }

  @Output() onUploadDone = new EventEmitter();
  loadingID: any;

  constructor(
    private nzMessage: NzMessageService,
    private uploadSV: UploadService,
    private translateSV: AmisTranslationService
  ) { }

  ngOnInit(): void {
  }

  onFileChange(e): void {
    const files = e?.target?.files;
    let sizeFiles = 0;
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < e.target.files.length; index++) {
      sizeFiles += e.target.files[index].size;
    }
    sizeFiles = sizeFiles / 1024 / 1024;
    if (sizeFiles > AppConfigService.settings.maxSizeFile) {
      this.translateSV.getValueByKey("OVER_FILE_SIZE").subscribe(data => {
        this.nzMessage.info(data);
      });
      return;
    }
    const valueValidate = this.validateFile(files);
    this.loadingID = this.nzMessage.loading("");
    if (valueValidate == ValidateFileEnum.Valid) {

      this.uploadSV.uploadFileHandleMultiple(files, UploadTypeEnum.MessengerImageAttachment, true).subscribe(res => {
        if (res.Success) {
          this.nzMessage.remove(this.loadingID.messageId);
          this.onUploadDone.emit(res);
        }
        else {
          this.nzMessage.error(res.UserMessage);
        }
      }, err => {
        this.translateSV.getValueByKey("ERROR_HAPPEN").subscribe(data => {
          this.nzMessage.error(data);
        });
      });
    }
    else {
      // this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("TOAST_UPLOAD_ERROR_EXTENSION"));
    }
  }

  validateFile(files): number {

    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < files.length; index++) {
      const extensionFile = files[index].name.substring(files[index].name.lastIndexOf("."), files[index].name.length);

      const exten = this._acceptFileExtension?.split(',')?.map(e => e.trim());
      if (!exten?.includes(extensionFile.toLowerCase())) {
        this.translateSV.getValueByKey("ERROR_FILE_TYPE").subscribe(data => {
          this.nzMessage.info(data);
        });
        return ValidateFileEnum.ExtensionInvalid;
      }


    }

    return ValidateFileEnum.Valid;
  }
}

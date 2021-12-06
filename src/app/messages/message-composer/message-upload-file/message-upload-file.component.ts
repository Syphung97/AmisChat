import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AmisTranslationService } from 'src/app/core/services/amis-translation-service.service';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { UploadService } from 'src/app/core/services/upload.service';
import { UploadTypeEnum } from 'src/app/shared/enum/upload-type.enum';
import { ValidateFileEnum } from 'src/app/shared/enum/validate-file.enum';

@Component({
  selector: 'amis-message-upload-file',
  templateUrl: './message-upload-file.component.html',
  styleUrls: ['./message-upload-file.component.scss'],
})
export class MessageUploadFileComponent implements OnInit {
  @ViewChild('importTemplateDoc', { static: false })
  importTemplateDoc!: ElementRef;

  // tslint:disable-next-line:variable-name
  _isVisible = false;
  @Input() set isVisible(data) {
    if (data != null && data != undefined) {
      this._isVisible = data;
      if (data) {
        setTimeout(() => {
          this.importTemplateDoc?.nativeElement?.click();
        }, 1000);
      }
    }
  }

  // tslint:disable-next-line:variable-name
  _typeAccept = [];

  // tslint:disable-next-line:variable-name
  _acceptFileExtension = UploadService.fileAccept;
  @Output() onCancle = new EventEmitter();

  @Output() onUploadDone = new EventEmitter();

  loadingID: any;
  constructor(
    private uploadSV: UploadService,
    private nzMessage: NzMessageService,
    private translateSV: AmisTranslationService
  ) {}

  ngOnInit(): void {}

  handleCancel(): void {
    this.onCancle.emit();
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
      // this.amisTransferSV.showErrorToast(
      //   this.translateSV.getValueByKey("TOAST_UPLOAD_ERROR_MAX_SIZE")
      // );
      this.nzMessage.error('Dung lượng tải lên vượt quá 10Mb');
      return;
    }
    this.loadingID = this.nzMessage.loading('');
    const valueValidate = this.validateFile(files);

    if (valueValidate == ValidateFileEnum.Valid) {
      this.uploadSV
        .uploadFileHandleMultiple(
          files,
          UploadTypeEnum.MessengerFileAttachment,
          true
        )
        .subscribe(
          (res) => {
            if (res.Success) {
              this.nzMessage.remove(this.loadingID.messageId);
              this.handleAfterUpload(res);
            } else {
              this.nzMessage.error(res.UserMessage);
            }
          },
          (err) => {
            this.translateSV.getValueByKey("ERROR_HAPPEN").subscribe(data => {
              this.nzMessage.error(data);
            });
          }
        );
    } else {
      // this.amisTransferSV.showErrorToast(this.translateSV.getValueByKey("TOAST_UPLOAD_ERROR_EXTENSION"));
    }
  }

  validateFile(files): number {
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < files.length; index++) {
      const extensionFile = files[index].name.substring(
        files[index].name.lastIndexOf('.'),
        files[index].name.length
      );

      const exten = this._acceptFileExtension?.split(',').map((e) => e.trim());
      if (!exten?.includes(extensionFile.toLowerCase())) {
        this.nzMessage.error('Định dạng không cho phép');
        return ValidateFileEnum.ExtensionInvalid;
      }
    }

    return ValidateFileEnum.Valid;
  }

  onFileDropped(listFiles): void {
    if (listFiles) {
      const event = { target: { files: listFiles } };
      this.onFileChange(event);
    }
  }

  importFile(): void {
    this.importTemplateDoc?.nativeElement?.click();
  }

  handleAfterUpload(data): void {
    this.onUploadDone.emit(data);
  }
}

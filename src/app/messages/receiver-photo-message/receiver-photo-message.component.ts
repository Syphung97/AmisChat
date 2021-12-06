import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzImageService } from 'ng-zorro-antd/image';
import { BaseComponent } from 'src/app/core/base.component';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { ImageService } from 'src/app/core/services/image.service';
import { UserService } from 'src/app/core/services/users/user.service';
import { MessageType } from 'src/app/shared/enum/message-type.enum';
import { UploadTypeEnum } from 'src/app/shared/enum/upload-type.enum';
import { Message } from '../models/Message';

@Component({
  selector: 'amis-receiver-photo-message',
  templateUrl: './receiver-photo-message.component.html',
  styleUrls: ['./receiver-photo-message.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiverPhotoMessageComponent extends BaseComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  _msg!: Message;
  @Input() set msg(data) {


    this._msg = data;
    this.handleLinkPreviewImage();
  }
  // tslint:disable-next-line:variable-name
  _conv: any;
  @Input() set conv(data) {
    this._conv = data;


    this.getReceiverUser();

    // this.handleIcon();
  }

  @Output() actionGenerate = new EventEmitter();
  visibleOptionActionPopover = false;

  visibleActionPopover = false;

  receiverUser: any;

  messageType = MessageType;
  constructor(
    private imageSV: ImageService,
    private nzImageService: NzImageService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  getReceiverUser(): void {
    try {
      if (!this._conv?.isGroup) {
        this.receiverUser = this._conv?.participants?.find(e => e.userId != UserService.UserInfo.StringeeUserID);
      }
      else if (this._conv?.isGroup) {
        this.receiverUser = this._conv?.participants?.find(e => e.userId == this._msg.sender);
      }
    } catch (error) {
      CommonFn.logger(error);
    }

  }

  actionOptionHandler(): void {
    this.visibleActionPopover = !this.visibleActionPopover;
  }

  handleAction(e): void {
    this.actionGenerate.emit(e);
    this.visibleOptionActionPopover = false;
    this.visibleActionPopover = false;
  }

  openAction(): void {
    this.visibleOptionActionPopover = !this.visibleOptionActionPopover;
  }

  handleLinkPreviewImage(): void {
    const width = this._msg?.content?.metadata?.ListFile.length == 1 ? 170 : 90;
    const height = this._msg?.content?.metadata?.ListFile.length == 1 ? 240 : 90;
    this._msg?.content?.metadata?.ListFile.forEach(e => {
      if (this._msg?.content?.metadata?.ListFile.length == 1) {
        e.PreviewUrl = this.imageSV.getImage(UploadTypeEnum.MessengerImageAttachment, e.FileID, "", true);
      }
      else {
        e.PreviewUrl = this.imageSV.getImage(UploadTypeEnum.MessengerImageAttachment, e.FileID, "", false, height, width);

      }
    });
  }

  preview(i): void {
    const images = this._msg?.content?.metadata?.ListFile.map(e => {
      return {
        src: this.imageSV.getImage(UploadTypeEnum.MessengerImageAttachment, e.FileID, "", true)

      };
    });

    const imagesSorted = new Array<any>();
    for (let index = 0; index < images.length; index++) {
      if (index >= i) {

        imagesSorted.push(images[index]);
      }
    }
    for (let index = 0; index < images.length; index++) {
      if (index < i) {

        imagesSorted.push(images[index]);
      }
    }

    this.nzImageService.preview(imagesSorted, { nzZoom: 1, nzRotate: 0, });
  }
}

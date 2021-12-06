import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { DownloadService } from 'src/app/core/services/download.service';
import { UserService } from 'src/app/core/services/users/user.service';
import { MessageType } from 'src/app/shared/enum/message-type.enum';
import { UploadTypeEnum } from 'src/app/shared/enum/upload-type.enum';
import { Message } from '../models/Message';

@Component({
  selector: 'amis-receiver-file-message',
  templateUrl: './receiver-file-message.component.html',
  styleUrls: ['./receiver-file-message.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiverFileMessageComponent extends BaseComponent implements OnInit {
  // tslint:disable-next-line:variable-name
  _msg!: Message;
  @Input() set msg(data) {



    this._msg = data;

  }
  // tslint:disable-next-line:variable-name
  _conv: any;
  @Input() set conv(data) {
    this._conv = data;
    this.getReceiverUser();
  }

  visibleOptionActionPopover = false;

  visibleActionPopover = false;

  receiverUser;

  @Output() actionGenerate = new EventEmitter();

  messageType = MessageType;
  constructor(
    private downloadSV: DownloadService
  ) {
    super();
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

  ngOnInit(): void {
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

  downloadFile(item): void {
    this.downloadSV.getTokenFile(item.FileID, UploadTypeEnum.MessengerFileAttachment, false).subscribe(data => {
      item.UrlDownload = this.downloadSV.downloadFile(data.Data);
      window.open(item.UrlDownload, '_blank');
    });
  }

}

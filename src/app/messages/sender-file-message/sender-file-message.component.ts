import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { DownloadService } from 'src/app/core/services/download.service';
import { UserService } from 'src/app/core/services/users/user.service';
import { MessageType } from 'src/app/shared/enum/message-type.enum';
import { UploadTypeEnum } from 'src/app/shared/enum/upload-type.enum';
import { Message } from '../models/Message';

@Component({
  selector: 'amis-sender-file-message',
  templateUrl: './sender-file-message.component.html',
  styleUrls: ['./sender-file-message.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SenderFileMessageComponent extends BaseComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  _msg!: Message;
  @Input() set msg(data) {


    this._msg = data;
  }
  // tslint:disable-next-line:variable-name
  _conv: any;
  @Input() set conv(data) {
    this._conv = data;
    setTimeout(() => {

      this.getReceiverUser();
    }, 0);
    // this.handleIcon();
  }

  @Output() actionGenerate = new EventEmitter();
  visibleOptionActionPopover = false;

  visibleActionPopover = false;

  receiverUer;

  messageType = MessageType;

  constructor(
    private downloadSV: DownloadService
  ) {
    super();
  }

  ngOnInit(): void {
  }

  openAction(): void {
    this.visibleOptionActionPopover = !this.visibleOptionActionPopover;
  }

  getReceiverUser(): void {
    try {
      if (!this._conv?.isGroup) {
        this.receiverUer = this._conv?.participants?.find(e => e.userId != UserService.UserInfo.StringeeUserID);
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

  downloadFile(item): void {
    this.downloadSV.getTokenFile(item.FileID, UploadTypeEnum.MessengerFileAttachment, false).subscribe(data => {
      item.UrlDownload = this.downloadSV.downloadFile(data.Data);
      window.open(item.UrlDownload, '_blank');
    });
  }
}

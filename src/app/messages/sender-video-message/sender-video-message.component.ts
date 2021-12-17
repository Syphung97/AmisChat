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
  selector: 'amis-sender-video-message',
  templateUrl: './sender-video-message.component.html',
  styleUrls: ['./sender-video-message.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SenderVideoMessageComponent extends BaseComponent implements OnInit {

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

  // this.handleIcon();
}

@Output() actionGenerate = new EventEmitter();
visibleOptionActionPopover = false;

visibleActionPopover = false;

receiverUser: any;

messageType = MessageType;
constructor(

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



}

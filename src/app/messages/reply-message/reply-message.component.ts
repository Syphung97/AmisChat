import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { ImageService } from 'src/app/core/services/image.service';
import { UserService } from 'src/app/core/services/users/user.service';
import { MessageType } from 'src/app/shared/enum/message-type.enum';
import { UploadTypeEnum } from 'src/app/shared/enum/upload-type.enum';
import { Message } from '../models/Message';

@Component({
  selector: 'amis-reply-message',
  templateUrl: './reply-message.component.html',
  styleUrls: ['./reply-message.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReplyMessageComponent extends BaseComponent implements OnInit {
  messageType = MessageType;
  // tslint:disable-next-line:variable-name
  _msg!: Message;

  @Input() type;
  @Input() set msg(data) {
    if (data) {
      this.getSenderName(data);
      this.checkReplyMe(data);
      this._msg = data;
      this.handleLinkPreviewImage();
    }
  }
  constructor(private imageSV: ImageService) {
    super();
  }

  ngOnInit(): void {}

  getSenderName(data): void {
    data.senderName = CommonFn.getUserByStringeeID(data.sender)?.DisplayName;
    if (data.sender == UserService.UserInfo.StringeeUserID) {
      data.senderName = 'Bạn';
      if (
        data.content?.metadata?.Reference?.sender ==
        UserService.UserInfo.StringeeUserID
      ) {
        data.content.metadata.Reference.senderName = "chính mình"
      }
    }
    else {
      if (
        data.content?.metadata?.Reference?.sender ==
        UserService.UserInfo.StringeeUserID
      ) {
        data.content.metadata.Reference.senderName = "bạn";
      }
    }
  }

  checkReplyMe(data): void {
    if (
      data?.content?.metadata?.Reference.sender ==
      UserService.UserInfo.StringeeUserID
    ) {
      data.isReplyMe = true;
    }
  }

  handleLinkPreviewImage(): void {
    if (this._msg?.content?.metadata?.Reference?.type == MessageType.Photo) {
      this._msg?.content?.metadata?.Reference?.content.metadata?.ListFile?.forEach(
        (e) => {
          e.PreviewUrl = this.imageSV.getImage(
            UploadTypeEnum.MessengerImageAttachment,
            e.FileID,
            '',
            true,
            80,
            80
          );
        }
      );
    }
  }
}

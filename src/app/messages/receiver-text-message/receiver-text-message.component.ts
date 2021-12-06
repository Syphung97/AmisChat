import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from 'src/app/core/base.component';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { UserService } from 'src/app/core/services/users/user.service';
import { MessageType } from 'src/app/shared/enum/message-type.enum';
import { Message } from '../models/Message';
declare const APEmojiMart: any;
@Component({
  selector: 'amis-receiver-text-message',
  templateUrl: './receiver-text-message.component.html',
  styleUrls: ['./receiver-text-message.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReceiverTextMessageComponent
  extends BaseComponent
  implements OnInit {
  // tslint:disable-next-line:variable-name
  _msg!: Message;
  @Input() set msg(data) {
    this.encodeHTML(data);
    this.urlify(data);
    this.handleSticker(data);
    this.replateBreakLine(data);
    // this.replaceEmoIcon(data);
    this.enCodeEmoji(data);

    this._msg = data;
    this.checkIsOnlyEmoji();
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
  constructor() {
    super();
  }

  getReceiverUser(): void {
    try {
      if (!this._conv?.isGroup) {
        this.receiverUser = this._conv?.participants?.find(
          (e) => e.userId != UserService.UserInfo.StringeeUserID
        );
      } else if (this._conv?.isGroup) {
        this.receiverUser = this._conv?.participants?.find(
          (e) => e.userId == this._msg.sender
        );
      }
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  ngOnInit(): void {}

  actionOptionHandler(): void {
    this.visibleActionPopover = !this.visibleActionPopover;
  }

  checkIsOnlyEmoji(): void {
    try {
      if (!this._msg.content.metadata) {
        const messageContent = this._msg.content.content;
        if (
          !/\w+|à|á|ã|ạ|ả|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ể|ễ|ệ|đ|ì|í|ĩ|ỉ|ị|ò|ó|õ|ọ|ỏ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ|ù|ú|ũ|ụ|ủ|ư|ứ|ừ|ử|ữ|ự|ỳ|ỵ|ỷ|ỹ|ý|À|Á|Ã|Ạ|Ả|Ă|Ắ|Ằ|Ẳ|Ẵ|Ặ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ|È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ể|Ễ|Ệ|Đ|Ì|Í|Ĩ|Ỉ|Ị|Ò|Ó|Õ|Ọ|Ỏ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ|Ù|Ú|Ũ|Ụ|Ủ|Ư|Ứ|Ừ|Ử|Ữ|Ự|Ỳ|Ỵ|Ỷ|Ỹ|:|=|\(|\)/g.test(
            messageContent
          )
        ) {
          this._msg.isOnlyEmoji = true;
        }
      }
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  handleAction(e): void {
    this.actionGenerate.emit(e);
    this.visibleOptionActionPopover = false;
    this.visibleActionPopover = false;
  }

  replateBreakLine(data): void {
    data.content.content = data.content.content.replace(
      /(?:\r\n|\r|\n)/g,
      '<br>'
    );
  }

  replaceEmoIcon(data): void {
    const map = {
      '&lt;3': '\u2764\uFE0F',
      '&lt;/3': '\uD83D\uDC94',
      ':D': '\uD83D\uDE00',
      ':)': '\uD83D\uDE03',
      ';)': '\uD83D\uDE09',
      ':(': '\uD83D\uDE12',
      ':p': '\uD83D\uDE1B',
      ';p': '\uD83D\uDE1C',
      ":'(": '\uD83D\uDE22',
      ":')": '\uD83D\uDE22',
    };
    // tslint:disable-next-line:typedef
    function escapeSpecialChars(regex) {
      return regex.replace(/([()[{*+.$^\\|?])/g, '\\$1');
    }

    // this.inputValue = this.composer.nativeElement.innerHTML;

    // tslint:disable-next-line:forin
    for (let i in map) {
      const regex = new RegExp(escapeSpecialChars(i), 'gim');
      data.content.content = data.content.content.replace(regex, map[i]);
    }
  }

  urlify(data): void {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    data.content.content = data.content.content.replace(urlRegex, (url) => {
      return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
  }

  handleSticker(data): void {
    if (data.type == MessageType.Sticker) {
      let sticker = data.content.sticker;
      if (!sticker) {
        sticker = data.content.metadata;
      }

      const name = sticker?.name;
      const cate = sticker?.cate;
      if (name) {
        data.content.content = `<i class="img-sticker sticker" st="${name}">`;
      }
    }
  }

  openAction(): void {
    this.visibleOptionActionPopover = !this.visibleOptionActionPopover;
  }

  encodeHTML(data): void {
    // let t = data.content.content;
    const txt = document.createElement('textarea');
    txt.innerHTML = data.content.content;
    data.content.content = txt.innerHTML;
  }

  enCodeEmoji(data): void {
    try {
      data.content.contentBefore = data.content.content;
      if (APEmojiMart.isEmoji(data.content.content)) {
        data.content.content = APEmojiMart.encode(
          data.content.content,
          APEmojiMart.EmojiType.Apple,
          '40px'
        );
        data.isOnlyEmoji = true;
      } else {
        data.content.content = APEmojiMart.encode(
          data.content.content,
          APEmojiMart.EmojiType.Apple,
          '20px'
        );
      }
    } catch (error) {}
  }
  handleMouseOutMessage(): void {
    this.visibleOptionActionPopover = false;
  }
}

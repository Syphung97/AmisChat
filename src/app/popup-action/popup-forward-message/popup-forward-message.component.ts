import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, Pipe } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ConversationService } from 'src/app/conversation/services/conversation.service';
import { BaseComponent } from 'src/app/core/base.component';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { PagingRequest } from 'src/app/core/models/PagingRequest';
import { StringeeService } from 'src/app/core/services/stringee.service';
import { UserService } from 'src/app/core/services/users/user.service';
import { Message } from 'src/app/messages/models/Message';
import { MessageType } from 'src/app/shared/enum/message-type.enum';
import { MessageContent, MessageData } from 'src/app/shared/models/stringee-model/MessageContent';

@Component({
  selector: 'amis-popup-forward-message',
  templateUrl: './popup-forward-message.component.html',
  styleUrls: ['./popup-forward-message.component.scss'],
})
export class PopupForwardMessageComponent extends BaseComponent implements OnInit {

  senderName = "";
  messageType = MessageType;
  // tslint:disable-next-line:variable-name
  _msg!: Message;
  @Input() set msg(data) {
    this._msg = data;
    this.getSenderName();
    this.getPlatformConversation();
  }
  // tslint:disable-next-line:variable-name
  _conv: any;
  @Input() set conv(data) {
    this._conv = data;
    // this.handleIcon();
  }

  // tslint:disable-next-line:variable-name
  _valueSearch = "";

  timeoutSearch!: any;

  convPagingRequest = new PagingRequest();

  listConversations!: any;

  isLoading = false;

  @Output() onHidden = new EventEmitter();
  constructor(
    private conversationSV: ConversationService,
    private stringeeService: StringeeService
  ) {
    super();
  }

  @Input() isVisible = false;

  ngOnInit(): void {
  }

  hide(e): void {
    this.onHidden.emit(false);
  }

  getSenderName(): void {
    this._msg.senderName = CommonFn.getUserByStringeeID(
      this._msg.sender
    )?.DisplayName;
  }

  onSearch(): void {
    clearTimeout(this.timeoutSearch);
    this.timeoutSearch = setTimeout(() => {
      this.getPlatformConversation();
    }, 500);

  }

  //#region  Conversation
  /**
   * Lấy dữ liệu cuộc trò chuyện từ platform
   *
   * @memberof ConversationListComponent
   */
  getPlatformConversation(): void {
    try {
      this.isLoading = true;
      this.convPagingRequest.Filter = window.btoa(
        `[["ConversationName","contains","${this._valueSearch.trim()}"]]`
      );
      this.convPagingRequest.PageIndex = 1;
      this.convPagingRequest.PageSize = -1;
      this.convPagingRequest.CustomParam = {
        StringeeUserID: UserService.UserInfo.StringeeUserID,
      };
      this.convPagingRequest.Sort = window.btoa(
        `[{"selector":"ConversationName","desc":"false"}]`
      );
      this.conversationSV
        .getPagingPlatformConversation(this.convPagingRequest)
        .subscribe((data) => {

          if (data?.Success) {
            this.stringeeService.getLastConversation(
              1000,
              false,
              (status, code, message, convs) => {
                this.isLoading = false;
                const flatformConv = data.Data.PageData;
                const convFilter = convs?.filter((el) => {
                  return flatformConv
                    .map((v) => v.ConversationID)
                    .includes(el.id);
                });
                this.listConversations = convFilter;

              }
            );
          }
        });
    } catch (error) {
      this.isLoading = false;
    }
  }

  handleForward(conv): void {

    const msgs = new MessageData();
    msgs.content = this._msg.content.content;
    msgs.metadata = this._msg.content.metadata;
    msgs.video = this._msg.content.video;
    const messageContent = new MessageContent();
    messageContent.message = msgs;
    messageContent.type = this._msg.type;
    messageContent.convId = conv.id;
    this.stringeeService.sendMessage(messageContent, (status, code, message, msg) => {
      if (msg) {
        conv.IsSent = true;
      }
    });
  }

  trackByConver(index, item): any {
    return item.id;
  }
}

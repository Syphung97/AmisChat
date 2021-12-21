import {
  Component,
  ElementRef,
  Injector,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AmisTranslationService } from 'src/app/core/services/amis-translation-service.service';
import { LazyLoadService } from '../services/lazy-load.service';
import { StringeeService } from 'src/app/core/services/stringee.service';
import { UserService } from 'src/app/core/services/users/user.service';
import { BaseComponent } from 'src/app/core/base.component';
import { map, takeUntil } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

import { User } from 'src/app/core/models/User';
import { MessageActionConst } from 'src/app/messages/constants/message-action';
import { MessageComposerComponent } from 'src/app/messages/message-composer/message-composer.component';
import {
  StringeeObjectChange,
  StringeeTypeChange,
} from 'src/app/shared/enum/stringee-object-change.enum';
import { MessageContent } from 'src/app/shared/models/stringee-model/MessageContent';
import { LodashUtils } from 'src/app/core/functions/lodash-util';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { MessageType } from 'src/app/shared/enum/message-type.enum';
import { AmisTranferDataService } from 'src/app/core/services/amis-tranfer-data.service';
import { ConversationService } from '../services/conversation.service';
import { PlatformConversation } from '../models/PlatformConversation';
import { FormMode } from 'src/app/core/models/FormMode';
import { MessageAction } from 'src/app/messages/models/MessageAction';

@Component({
  selector: 'amis-conversation-box',
  templateUrl: './conversation-box.component.html',
  styleUrls: ['./conversation-box.component.less'],
})
export class ConversationBoxComponent extends BaseComponent implements OnInit {
  @ViewChild('headerContainer', { read: ViewContainerRef, static: true })
  headerContainer!: ViewContainerRef;

  @ViewChild('messageComposer', { static: true })
  messageComposer!: MessageComposerComponent;

  @Input() message!: string;

  conversation: any;

  user!: User;

  isNewConversation = false;

  // ID cuộc trò chuyện
  conversationID!: string;

  // List Message
  listMessage: any;

  // Danh sách userID chọn từ selectbox
  listUser = new Array<any>();

  // Object đang nhập tin nhắn
  typingIndicatorObject: any;

  messageComing!: object;

  actionObject!: MessageAction;

  constructor(
    private activatedRoute: ActivatedRoute,
    private translateSV: AmisTranslationService,
    private lazyloadSV: LazyLoadService,
    private injector: Injector,
    private stringeeService: StringeeService,
    private router: Router,
    private nzMessage: NzMessageService,
    private tranferSV: AmisTranferDataService,
    private conversationSV: ConversationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subScribeParam();

    this.stringeeService.stringeeObjectChange
      .pipe(takeUntil(this._onDestroySub))
      .subscribe((data) => {
        this.handleRealTimeUpdate(data);
      });

    this.stringeeService.stringeeRevokeMessage
      .pipe(takeUntil(this._onDestroySub))
      .subscribe((data) => { });
  }

  subScribeParam(): void {
    try {
      this.activatedRoute.params.subscribe((params) => {
        console.log(params);

        this.clearBox();
        if (params.id === 'new') {
          this.isNewConversation = true;
          this.initHeader();
        } else {
          this.isNewConversation = false;
          this.conversationID = params.id;

          this.stringeeService.getConversationById(
            params.id,
            (status, code, message, conv) => {
              this.initHeader();
              this.bindingConversationName(conv);
              this.conversation = conv;
            }
          );

          this.getLastMessage();

          setTimeout(() => {
            this.messageComposer.autoFocusInput();
          }, 1000);
        }
      });
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  async initHeader(): Promise<void> {
    try {
      this.headerContainer.clear();
      const factory = await this.lazyloadSV.loadHeaderConversation(
        this.isNewConversation
      );
      const headerInstance = this.headerContainer.createComponent(
        factory,
        undefined,
        this.injector
      );
      headerInstance.location.nativeElement.style.width = '100%';
      this.createHeader(headerInstance.instance);
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  createHeader(componentInstance: any): void {
    try {
      if (this.isNewConversation) {
        componentInstance.onSelectUser
          .pipe(takeUntil(this._onDestroySub))
          .subscribe((data) => {
            this.listUser = data;
          });
      } else {
        componentInstance.conversation = this.conversation;
        componentInstance.messageSV = this.nzMessage;
      }
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  clearBox(): void {
    this.listMessage = [];
    this.messageComposer.inputValue = '';
  }

  /**
   * Xử lí khi có người khác nhắn tin
   *
   * @param {*} data
   * @memberof ConversationBoxComponent
   */
  handleRealTimeUpdate(data: any): void {
    try {
      // Nếu objet change là message
      if (data.objectType == StringeeObjectChange.MessageChangge) {
        if (data.changeType == StringeeTypeChange.Update) {
          if (
            data.objectChanges[0]?.conversationId == this.conversationID &&
            (data.objectChanges[0]?.state == 2 ||
              (data.objectChanges[0]?.state == 3 &&
                data.objectChanges[0].sender !=
                UserService.UserInfo.StringeeUserID))
          ) {
            // this.getLastMessage();
            this.listMessage.push(...data.objectChanges);
            if (
              data.objectChanges[0].type == MessageType.File ||
              data.objectChanges[0].type == MessageType.Photo
            ) {
              this.tranferSV.sendFile(data.objectChanges[0].type);
            }
            this.messageComing = LodashUtils.cloneDeepData({ coming: true });
            // if (data.objectChanges[0]?.state == 3) {
            //   this.markConversationAsRead(this.conversationID);
            // }
          }
        } else {
          console.log(
            'Box else MessageChange' + data + 'convID' + this.conversationID
          );
          if (
            data.objectChanges[0]?.conversationId == this.conversationID &&
            data.objectChanges[0]?.state == 3
          ) {
            this.getLastMessage();
          }
        }
      } else if (data.objectType == StringeeObjectChange.ConvChange) {
        if (data.changeType == StringeeTypeChange.Update) {
          const objectChange = data.objectChanges[0];

          if (objectChange.id == this.conversationID) {
            Object.keys(objectChange).forEach((key) => {
              this.conversation[key] = objectChange[key];
            });

            this.conversation = LodashUtils.cloneDeepData(this.conversation);
          }
        }
      }
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  getLastMessage(): void {
    try {
      this.stringeeService.getLastMessages(
        this.conversationID,
        30,
        true,
        (status, code, message, msgs) => {
          this.listMessage = msgs;
        }
      );
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  getMessageBefore(): void {
    try {
      const lastSequence = this.listMessage[0];
      if (lastSequence?.sequence > 1) {
        this.stringeeService.getMessagesBefore(
          this.conversationID,
          lastSequence.sequence,
          20,
          true,
          (status, code, message, msgs) => {
            msgs.forEach((e) => {
              e.isLastMessage = true;
            });

            for (let index = msgs.length - 1; index > 0; index--) {
              if (
                msgs[index]?.sender == msgs[index - 1]?.sender &&
                msgs[index].type != MessageType.Notification &&
                msgs[index].type != MessageType.Creation &&
                !this.isDateDifferent(
                  msgs[index - 1].createdAt,
                  msgs[index].createdAt
                )
                && !msgs[index - 1].content?.metadata?.Reference
              ) {
                msgs[index - 1].isLastMessage = false;
              }
            }
            for (let index = msgs.length - 1; index > 0; index--) {
              if (
                msgs[index].sender != msgs[index - 1].sender ||
                msgs[index - 1].type == MessageType.Notification ||
                msgs[index - 1].type == MessageType.Creation || this.isDateDifferent(
                  msgs[index - 1].createdAt,
                  msgs[index].createdAt
                ) ||
                msgs[index - 1].content?.metadata?.Reference
              ) {
                msgs[index].isFirstMessage = true;
              }
            }
            this.listMessage.unshift(...msgs);
            // this.listMessage = LodashUtils.cloneDeepData(this.listMessage);
          }
        );
      }
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  onSendMessage(value): void {
    try {
      if (value) {
        // Nếu là cuộc trò chuyện mới
        if (this.isNewConversation) {
          this.createNewConversation(value);
        } else {
          this.sendMessage(value);
        }
      }
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  createNewConversation(messageContent: MessageContent): void {
    try {
      if (this.listUser?.length && this.isNewConversation) {
        // update tên cho cuộc trò chuyện khi rơi vào case select user
        const listName = this.listUser.map((e) => e.FullName).join(', ');

        const option = {
          name: listName,
          isDistinct: true,
          isGroup: this.listUser?.length > 1 ? true : false,
        };
        const listUserID = this.listUser.map((e) => e.StringeeUserID);
        this.stringeeService.createConversation(
          listUserID,
          option,
          (status, code, message, conv) => {
            console.log(`${status} ${code} ${message}`);
            this.getAvatar(conv);
            this.conversation = conv;
            this.conversationID = conv?.id;
            const param = this.buildFlatformConversationObject(conv, this.listUser);
            this.conversationSV.save(param).subscribe((data) => {
              if (data?.Success) {
                console.log(data);
              }
            });
            messageContent.convId = this.conversationID;
            this.stringeeService.sendMessage(
              messageContent,
              (s, c, me, msg) => {
                this.router.navigate(['m', conv?.id], {
                  // thêm bắn conversation sang header
                  state: {
                    con: this.conversation,
                  },
                });
              }
            );
          }
        );
      } else {
        this.sendMessage(messageContent);
      }
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  sendMessage(messageContent: MessageContent): void {
    try {
      messageContent.convId = this.conversationID;

      this.stringeeService.sendMessage(
        messageContent,
        (status, code, message, msg) => {

        }
      );
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  handleActionMessage(e: MessageAction): void {
    switch (e.type) {
      case MessageActionConst.Delete:
        this.stringeeService.deleteMessage(
          e.payload.conversationId,
          e.payload.id,
          (status, code, message) => { }
        );
        break;
      case MessageActionConst.Revoke:
        this.stringeeService.revokeMessage(
          e.payload.conversationId,
          e.payload.id,
          (status, code, message) => {
            this.handleAfterRevokeMessage(
              e.payload.conversationId,
              e.payload.id
            );
          }
        );
        break;
      case MessageActionConst.Reply:
        this.actionObject = e;
        break;
      case MessageActionConst.Copy:
        this.copyMessage(e.payload.content.content);
        break;
    }
  }

  handleAfterRevokeMessage(convID: string, messageID: string): void {
    const index = this.listMessage.findIndex((e) => {
      return e.id == messageID;
    });
    this.listMessage.splice(index, 1);
    this.getLastMessage();
  }

  copyMessage(content: string): void {
    const selBox = document.createElement('textarea');
    selBox.value = content.replace(/<[^>]*>?/gm, '');
    selBox.value = content.replace(/<br>/gm, '\n');
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.nzMessage.info('Sao chép thành công');
  }

  onReachTop(): void {
    this.getMessageBefore();
  }

  getAvatar(conv: any): void {
    this.listUser.forEach((user) => {
      conv.avatar = user.Avatar;
    });
  }

  bindingConversationName(e): void {
    try {
      if (e) {
        const listParticipant = e.participants;
        if (!e.isGroup) {
          // nếu trùng user đang đăng nhập thì gán tên hội thoại name
          if (e.creator == UserService.UserInfo.StringeeUserID) {
            listParticipant.forEach((part) => {
              if (e.creator != part.userId) {
                e.name = part.name;
                e.avatar = part.avatar;
                this.checkConversationOnline(e, part);
              }
            });
          }
          // nếu ko trùng user đang đăng nhâp thì gán bằng người tạo
          else if (e.creator != UserService.UserInfo.StringeeUserID) {
            listParticipant.forEach((part) => {
              if (e.creator == part.userId) {
                e.name = part.name;
                e.avatar = part.avatar;
                this.checkConversationOnline(e, part);
              }
            });
          }
        }
        // check hội thoại nhóm
        else if (e.isGroup) {
          e.name = this.getNameGroupChat(e);
          listParticipant.forEach((part) => {
            this.checkConversationOnlineForGroup(e, part);
          });
        }
      }
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  /**
   * gom nhóm tên, tạo nhóm group
   * DVQuang2 18/05/2021
   */
  getNameGroupChat(conv: any): string {
    try {
      if (conv.name == '' || conv.name == null) {
        if (conv.participants.userId != UserService.UserInfo.StringeeUserID) {
          return conv.participants.map((e) => e.name).join(', ');
        }
      }
      return conv.name;
      // return conv?.name ?? conv.content?.groupName ?? conv.participants.map(e => e.name).join(", ")
    } catch (error) {
      return '';
    }
  }

  /**
   * kiểm tra người đang online trong hội thoại
   * @param conv conversation
   * @param part người tham gia hội thoại
   * dvquang2
   */
  checkConversationOnline(conv: any, part: any): void {
    try {
      UserService.UserOnline?.forEach((you: any) => {
        if (part.userId == you.userId) {
          conv.status = 1;
        }
      });
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  /**
   * xử lí tạm cho check userOnline khi cuộc trò chuyện là group
   * @param conv
   * @param part
   * dvquang2 27/05/2021
   */
  checkConversationOnlineForGroup(conv: any, part: any): void {
    try {
      const listUserOnlineGroup = UserService.UserOnline?.filter(
        (obj) => obj.userId != UserService.UserInfo.StringeeUserID
      );
      listUserOnlineGroup?.forEach((you: any) => {
        if (part.userId == you.userId) {
          conv.status = 1;
        }
      });
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  /**
   * chuyển trạng thái đã đọc cho cuộc trò chuyện
   * @param conversationId id cuộc trò chuyện
   */
  markConversationAsRead(conversationId: any): void {
    this.stringeeService.markConversationAsRead(conversationId, (res) => {
      console.log('chuyển trạng thái đã đọc cho: ' + conversationId + res);
    });
  }

  buildFlatformConversationObject(conv: any, users): PlatformConversation {
    const platformConv = new PlatformConversation();
    platformConv.ConversationID = conv.id;
    platformConv.ConversationName = conv.name;
    platformConv.Participants = conv.participants
      .map((e) => e.userId)
      .join(';');
    platformConv.IsGroup = conv.isGroup;
    platformConv.Creator = conv.creator;
    platformConv.State = FormMode.Insert;
    platformConv.ListParticipant = users;
    return platformConv;
  }

  /**
   * Compares two dates and sets Date on a a new day
   */
  isDateDifferent(firstDate, secondDate): boolean | undefined {
    try {
      // tslint:disable-next-line:one-variable-per-declaration
      let firstDateObj: Date, secondDateObj: Date;
      firstDateObj = new Date(firstDate);
      secondDateObj = new Date(secondDate);
      if (
        firstDateObj.getDate() === secondDateObj.getDate() &&
        firstDateObj.getMonth() === secondDateObj.getMonth() &&
        firstDateObj.getFullYear() === secondDateObj.getFullYear()
      ) {
        return false;
      }
      return true;
    } catch (error) {
      return;
    }
  }


  openPopupForward(): void {

  }

}

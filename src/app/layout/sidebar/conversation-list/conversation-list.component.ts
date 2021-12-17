import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { StringeeService } from 'src/app/core/services/stringee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/core/base.component';
import { UserService } from 'src/app/core/services/users/user.service';
import { MessageType } from 'src/app/shared/enum/message-type.enum';
import { AmisTranferDataService } from 'src/app/core/services/amis-tranfer-data.service';
import {
  StringeeObjectChange,
  StringeeTypeChange,
} from 'src/app/shared/enum/stringee-object-change.enum';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { NotificationDesktop } from 'src/app/shared/notification/notification-desktop';
import { LodashUtils } from 'src/app/core/functions/lodash-util';
import { ConversationActionMessage } from 'src/app/messages/enums/conversation-action-message.enum';
import { PagingRequest } from 'src/app/core/models/PagingRequest';
import { ConversationService } from 'src/app/conversation/services/conversation.service';
import { AmisStateService } from 'src/app/core/services/state.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'amis-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss'],
})
export class ConversationListComponent extends BaseComponent implements OnInit {
  listConversations: any;
  count = 20;
  currentUser: any;
  listUserOnline!: any;
  isLoading = false;

  // dùng cho active class
  conversationActive;

  //today: any = Date.now();

  messageType = MessageType;

  // tslint:disable-next-line:variable-name
  _valueSearch = '';
  @Input() set valueSearch(data) {
    if (data != null && data != undefined) {
      // this._valueSearch = CommonFn.convertVNtoENToLower(data);
      // this._valueSearch = encodeURI(data.trim());
      // if (this._valueSearch) {
      //   this.getPlatformConversation();
      // } else {
      //   this.getUserOnline();
      // }
    }
  }

  pagingRequest = new PagingRequest();

  unreadTotal = 0;

  @Output() clearSearch = new EventEmitter();

  @Output() noConvData = new EventEmitter();
  constructor(
    private stringeeService: StringeeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tranferSV: AmisTranferDataService,
    private route: ActivatedRoute,
    private stringeeUserSV: UserService,
    private conversationSV: ConversationService,
    private titleSV: Title
  ) {
    super();
  }

  ngOnInit(): void {
    try {
      this.currentUser = UserService.UserInfo;
      this.isLoading = true;
      this.getUserOnline();
      this.subScription();
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  subScription(): void {
    this.stringeeService.stringeeObjectChange
      .pipe(takeUntil(this._onDestroySub))
      .subscribe((data) => {
        this.handleRealTimeUpdate(data);
      });

    this.tranferSV.afterDeleteConversation
      .pipe(takeUntil(this._onDestroySub))
      .subscribe((id) => {
        // Nếu là cuộc trò chuyện đầu tiên
        if (this.listConversations[0].id == id) {
          this.listConversations.splice(0, 1);
        }
        this.bindingFirstConversation();
      });

    this.stringeeService.stringeeRemoveParticipantFromServer
      .pipe(takeUntil(this._onDestroySub))
      .subscribe((data) => {
        this.removeConversationFromServer(data);
      });

    this.activatedRoute.children[0]?.params?.subscribe((params) => {
      if (params.id != 'new') {
        this.conversationActive = params.id;
      }
    });

    this.activatedRoute.params?.subscribe((params) => { });
  }

  /**
   * lấy dữ liệu user online
   * dvquang2 18/05/2021
   */
  getUserOnline(): void {
    this.stringeeUserSV.getUserOnline().subscribe((data) => {
      if (data.Success) {
        const dataMap = data.Data.Users.map((e) => {
          const userOnline = {
            userId: e.UserId,
            canCallout: e.CanCallout,
            chatCustomer: e.ChatCustomer,
            loginTime: e.LoginTime,
          };
          return userOnline;
        });
        this.getLastConversation(20);
        UserService.UserOnline = dataMap;
        this.listUserOnline = dataMap;
        this.isLoading = false;
      }
    });
  }

  /**
   * Xử lí realtime update
   *
   * @param {any} data
   * @memberof ConversationListComponent
   */
  handleRealTimeUpdate(data): void {
    try {
      if (data.objectType == StringeeObjectChange.ConvChange) {

        this.getLastConversation(this.count);



      } else if (data.objectType == StringeeObjectChange.MessageChangge) {
        // Case tin nhắn mới
        if (data.changeType != StringeeTypeChange.Update) {
          data.objectChanges.forEach((msg) => {
            let existConv = false;
            this.listConversations.forEach((conv) => {
              if (conv.id == msg.conversationId) {
                existConv = true;
                conv.lastMessage = LodashUtils.cloneDeepData(msg);
                this.encodeHTML(conv.lastMessage);
                conv.lastMessage.content.content = CommonFn.replaceEmoIcon(
                  conv.lastMessage.content.content
                );
                conv.lastMessage.content.content = CommonFn.urlify(
                  conv.lastMessage.content.content
                );
                this.handleDisplayLastMessage(conv);

                if (msg?.sender != this.currentUser.StringeeUserID) {
                  this.sendNotificationToDesktop(conv, msg);
                  if (!AmisStateService.BrowserVisited) {
                    this.tranferSV.newMessameCome(true);
                  }

                }
              }
            });

            // if (!existConv) {
            //   this.getLastConversation(this.count);
            // }
          });
        }
      }
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  /**
   * Đếm số cuộc trò chuyện chưa được đọc
   *
   * @memberof ConversationListComponent
   */
  calculateUnreadConv(): void {
    let unreadConv = 0;
    this.listConversations.forEach((e) => {
      if (e.unreadCount) {
        unreadConv++;
      }
    });
    console.log(unreadConv);

    if (unreadConv) {
      this.titleSV.setTitle(`(${unreadConv}) AMIS Chat`);
    } else {
      this.titleSV.setTitle(`AMIS Chat`);
    }
  }

  encodeHTML(data): void {
    // let t = data.content.content;
    const txt = document.createElement('textarea');
    txt.innerHTML = data.content.content;
    data.content.content = txt.innerHTML;
  }

  sendNotificationToDesktop(conv, msg): void {
    let title;
    let content = conv.lastMessage.content.content;

    const receiver = conv.participants.find((e) => e.userId != msg?.sender);

    const sender = conv.participants.find((e) => e.userId == msg?.sender);

    if (
      conv.lastMessage.content.metadata &&
      conv.lastMessage.type == this.messageType.Sticker
    ) {
      content = sender?.name + ' đã gửi 1 nhãn dán';
    } else if (conv.lastMessage.type == this.messageType.File) {
      const fileCount = conv.lastMessage.content.metadata.ListFile.length;
      content = sender?.name + ' đã gửi ' + fileCount + ' tệp đính kèm';
    }
    if (conv.isGroup) {
      title = sender?.name + ' đến ' + conv.name;
    } else {
      title = sender?.name + ' đến ' + receiver.name;
    }
    content = content.replace(/<[^>]*>?/gm, '');
    content = content.replace(/<br>/gm, '\n');
    NotificationDesktop.notifyMe(title, content, conv);
  }

  /**
   *
   * @param count truyền vào khi bắt sự kiện scroll
   * DVQuang2 18/05/2021
   */
  getLastConversation(count): void {
    try {
      this.stringeeService.getLastConversation(
        this.count,
        false,
        (status, code, message, convs) => {
          if (!convs?.length && !this._valueSearch) {
            this.noConvData.emit();
            this.tranferSV.emitNoConversation(true);
          }
          else {
            this.tranferSV.emitNoConversation(false);
          }

          this.listConversations = convs;

          this.calculateUnreadConv();
          // check tên cuộc hội thoại
          const listConvTmp = this.listConversations;

          listConvTmp?.forEach((e) => {
            this.getLastMessageSenderName(e);

            this.handleDisplayLastMessage(e);
            this.encodeHTML(e.lastMessage);
          });

          this.listConversations = listConvTmp;
          // this.conversationActive = this.activatedRoute.children[0]?.snapshot.params.id;
          this.conversationActive =
            this.conversationActive ?? listConvTmp[0].id;
          if (
            !this.activatedRoute.children ||
            !this.activatedRoute.children[0]?.snapshot.params.id
          ) {
            this.bindingFirstConversation();
          }
        }
      );
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  /**
   * Xử lí hiển thị tin nhắc cuối cùng
   *
   * @param {any} e
   * @memberof ConversationListComponent
   */
  handleDisplayLastMessage(e): void {
    switch (e.lastMessage.type) {
      case MessageType.Creation:
        e.lastMessage.content.content =
          e?.senderName + ' đã tạo cuộc trò chuyện';
        break;
      case MessageType.Notification:
        if (e.lastMessage.content.groupName) {
          if (
            e.lastMessage.content.type == ConversationActionMessage.AddMember
          ) {
            // console.log(e);

            const listMemberNameAdded = e.lastMessage.content.participants.map(
              (d) => {
                return CommonFn.getUserByStringeeID(d.user)?.DisplayName;
              }
            );

            listMemberNameAdded.forEach((d) => {
              e.lastMessage.content.content = `${e.lastMessage.content.addedInfo.displayName} đã thêm ${d} vào cuộc trò chuyện`;
            });
          } else if (
            e.lastMessage.content.type == ConversationActionMessage.RemoveMember
          ) {
            const creator = e.lastMessage.content.removedInfo.displayName;
            // Case xóa khỏi nhóm
            if (
              e.lastMessage.content.removedBy !=
              e.lastMessage.content.participants[0].user
            ) {
              e.lastMessage.content.content = `${creator} đã xóa ${CommonFn.getUserByStringeeID(
                e.lastMessage.content.participants[0].user
              )?.DisplayName
                } khỏi cuộc trò chuyện`;
            }
            // Case tự rời nhóm
            if (
              e.lastMessage.content.removedBy ==
              e.lastMessage.content.participants[0].user
            ) {
              e.lastMessage.content.content = `${e.lastMessage.content.removedInfo.displayName} đã rời khỏi cuộc trò chuyện`;
            }
          } else if (
            e.lastMessage.content.type == ConversationActionMessage.RenameConv
          ) {
            const creator = e.participants.find(
              (x) => x.userId == e.lastMessage.sender
            );
            e.lastMessage.content.content =
              creator?.name +
              ' đã đổi tên cuộc trò chuyện thành ' +
              e.lastMessage.content?.groupName;
          }
        }
        break;
      case MessageType.File:
        const fileCount = e.lastMessage.content.metadata.ListFile.length;
        e.lastMessage.content.content =
          e?.senderName + ' đã gửi ' + fileCount + ' tệp đính kèm';
        break;
      case MessageType.Photo:
        const photoCount = e.lastMessage.content.metadata.ListFile.length;
        e.lastMessage.content.content =
          e?.senderName + ' đã gửi ' + photoCount + ' ảnh';
        break;
      case MessageType.Sticker:
        e.lastMessage.content.content = e?.senderName + ' đã gửi 1 nhãn dán';
        break;
      default:
        e.lastMessage.content.content = CommonFn.replaceEmoIcon(
          e.lastMessage.content.content
        );
        break;
    }
  }

  /**
   * show hội thoại
   * DVQuang2 17/05/2021
   */
  showConverSation(conversation): void {
    try {
      // hội thoại đã đọc thì gán lại bằng 0 để style css
      if (conversation.unreadCount) {
        conversation.unreadCount = 0;
        conversation.unreadCountClone = 0;
        // cập nhật đã đọc lên server stringee
        this.stringeeService.markConversationAsRead(conversation.id, undefined);
        this.calculateUnreadConv();
      }

      this.router.navigate(['m', conversation.id], {
        state: {
          con: conversation,
        },
      });

      this.conversationActive = conversation.id;
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  /**
   *
   * @param event event khi cuộn xuống dưới cùng
   * get thêm dữ liệu danh sách cuộc trò chuyện
   * dvquang2
   */
  onScroll(event): void {
    const scrollheight = event.target.scrollHeight;
    const scrollTop = event.target.scrollTop;
    const height = event.target.offsetHeight;
    if (scrollTop > 0 && scrollTop + height >= scrollheight) {
      this.getLastConversation((this.count += 20));
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
      this.listUserOnline?.forEach((you: any) => {
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
      const listUserOnlineGroup = this.listUserOnline?.filter(
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
   * Lấy tên người gửi mess cuối cùng
   *
   * @param {any} conv
   * @memberof ConversationListComponent
   */
  getLastMessageSenderName(conv): void {
    try {
      const participants = conv.participants;

      const senderName = participants.find(
        (e) => e.userId == conv.lastMessage?.sender
      );

      conv.senderName = senderName?.name;
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  /**
   * Lấy dữ liệu cuộc trò chuyện đầu tiên để hiển thị
   *
   * @memberof ConversationListComponent
   */
  bindingFirstConversation(): void {
    try {
      if (this.listConversations?.length) {
        const conversation = this.listConversations[0];
        this.router.navigate(['m', conversation.id], {
          state: {
            con: conversation,
          },
        });
        this.conversationActive = conversation.id;
      }
      else {
        this.router.navigate(['/'], {
        });
      }
    } catch (error) {
      CommonFn.logger(error);
    }
  }



  /**
   * xóa cuộc trò chuyện khi thành viên bị xóa khỏi nhóm
   * @param data
   */
  removeConversationFromServer(data: any): void {
    try {
      for (let index = 0; index < this.listConversations.length; index++) {
        const element = this.listConversations[index];
        if (element.id == data.groupId) {
          this.listConversations.splice(index, 1);
          break;
        }
      }
      const idUrl = this.route.snapshot.paramMap.get('id');
      // nếu cuộc trò chuyện bị remove lúc đang mở thì quay về cuộc trò chuyện đầu tiên
      if (idUrl == data.groupId) {
        this.bindingFirstConversation();
      }
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  trackByConver(index, item): any {
    return item.id;
  }
}

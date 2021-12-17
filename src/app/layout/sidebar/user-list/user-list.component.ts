import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { UserService } from 'src/app/core/services/users/user.service';
import { AvatarService } from 'src/app/core/services/users/avatar.service';
import { PagingRequest } from 'src/app/core/models/PagingRequest';
import { ActivatedRoute, Router } from '@angular/router';
import { StringeeService } from 'src/app/core/services/stringee.service';

import { CommonFn } from 'src/app/core/functions/commonFn';
import { ConversationService } from 'src/app/conversation/services/conversation.service';
import { PlatformConversation } from 'src/app/conversation/models/PlatformConversation';
import { FormMode } from 'src/app/core/models/FormMode';
import { MessageType } from 'src/app/shared/enum/message-type.enum';
import { ConversationActionMessage } from 'src/app/messages/enums/conversation-action-message.enum';
@Component({
  selector: 'amis-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less'],
})
export class UserListComponent implements OnInit, OnChanges {
  listDirectory: any;
  totalDirectory = 0;
  listUserOnline: any;
  isLoading = false;
  pagingRequest = new PagingRequest();

  convPagingRequest = new PagingRequest();

  visiblePopoverCreateChat = false;

  isLoadMore = false;

  isEmpty = false;
  // dùng cho active class
  isValue = 0;

  listConversations: any;

  // tslint:disable-next-line:variable-name
  _valueSearch = '';
  @Input() set valueSearch(data) {
    if (data != null && data != undefined) {
      // this._valueSearch = CommonFn.convertVNtoENToLower(data);
      this._valueSearch = encodeURI(data.trim());
    }

    this.getPlatformConversation();
    this.getPagingData();
  }

  @Output() clearSearch = new EventEmitter();

  constructor(
    private userSV: UserService,
    private avatarSV: AvatarService,
    private router: Router,
    private stringeeService: StringeeService,
    private conversationSV: ConversationService
  ) { }

  ngOnInit(): void { }

  // tslint:disable-next-line:typedef
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
  }

  getPagingData(): void {
    this.pagingRequest.Filter = window.btoa(
      `[[["FullName","contains","${this._valueSearch}"],"or",["EmployeeCode","contains","${this._valueSearch}"],"or",["Mobile","contains","${this._valueSearch}"],"or",["ContactEmail","contains","${this._valueSearch}"]], "AND", ["Status","=","3"]]`
    );
    this.pagingRequest.PageIndex = 1;
    this.pagingRequest.PageSize = 20;
    this.pagingRequest.Sort = window.btoa(
      `[{"selector":"FullName","desc":"false"}]`
    );
    this.isLoading = true;

    this.getUserFromSystem(undefined);
  }

  getAvatar(
    avatarToken: any,
    userID: any,
    editVersion: any = new Date()
  ): string {
    return this.avatarSV.getAvatar(
      avatarToken,
      userID,
      editVersion,
      true,
      80,
      80
    );
  }

  // tslint:disable-next-line:ban-types
  getUserFromSystem(callback: Function | undefined): void {
    this.userSV.getUserFromSystem(this.pagingRequest).subscribe((data) => {
      this.isLoading = false;

      if (data?.Success) {
        this.totalDirectory = data.Data.Total;
        if (!callback) {
          const pageData = data.Data.PageData;
          pageData.forEach((e) => {
            e.Avatar = this.getAvatar(e.AvatarToken, e.UserID, e.EditVersion);
            if (
              UserService.UserOnline?.find(
                (obj) => obj.userId == e.StringeeUserID
              )
            ) {
              e.status = 1;
            }
          });
          this.listDirectory = pageData;

        } else {
          callback(data);
        }
        this.checkEmpty();
      }
    }, err => {
      this.isLoading = false;
      this.checkEmpty();
    });
  }

  onScroll(event): void {
    const scrollheight = event.target.scrollHeight;
    const scrollTop = event.target.scrollTop;
    const height = event.target.offsetHeight;
    if (scrollTop > 0 && scrollTop + height >= scrollheight - 60 && this.listDirectory.length < this.totalDirectory) {
      this.isLoadMore = true;

      this.pagingRequest.PageIndex++;
      this.getUserFromSystem((res) => {
        this.isLoadMore = false;
        const pageData = res.Data.PageData;
        pageData.forEach((e) => {
          e.Avatar = this.getAvatar(e.AvatarToken, e.UserID, e.EditVersion);
          if (
            UserService.UserOnline?.find(
              (obj) => obj.userId == e.StringeeUserID
            )
          ) {
            e.status = 1;
          }
        });
        this.listDirectory = this.listDirectory.concat(pageData);
      });
    }
  }

  createNewConversation(): void {
    this.router.navigate(['m', 'new']);
    this.visiblePopoverCreateChat = false;
  }

  /**
   *
   * @param item item trong danh bạ
   * @param conv cuộc trò chuyện trả về
   * lấy avatar hệ thống gán lại vào avatar participants khi nhận được conversation trả về
   * dvquang2 20/05/2021
   */
  checkAvatarContact(item: any, conv: any): void {
    item.conversationId = conv.id;
    conv.participants.forEach((part) => {
      if (item.StringeeUserID == part.userId) {
        part.avatar = item.Avatar;
        conv.avatar = part.avatar;
        conv.name = item.FullName;
      }
    });
  }

  /**
   *
   * @param item item trong danh bạ
   * tạo cuộc trò chuyện và chuyển dữ liệu router
   * dvquang2
   */
  showUserConversation(item): void {
    // Clear search
    if (this._valueSearch) {
      this._valueSearch = '';

      this.getPagingData();
    }
    const option = {
      isDistinct: false,
      isGroup: false,
    };

    this.stringeeService.createConversation(
      [item.StringeeUserID],
      option,
      (status, code, message, conv) => {
        this.checkAvatarContact(item, conv);
        const param = this.buildFlatformConversationObject(conv, item);
        this.conversationSV.save(param).subscribe((data) => {
          if (data?.Success) {
          }
        });
        // active class khi click vào item
        this.isValue = item.conversationId;
        this.router.navigate(['m', conv.id], {
          state: {
            user: item,
            con: conv,
          },
        });
        this.clearSearch.emit();
      }
    );
  }

  buildFlatformConversationObject(conv: any, user): PlatformConversation {
    const platformConv = new PlatformConversation();
    platformConv.ConversationID = conv.id;
    platformConv.ConversationName = conv.name;
    platformConv.Participants = conv.participants
      .map((e) => e.userId)
      .join(';');
    platformConv.IsGroup = conv.isGroup;
    platformConv.Creator = conv.creator;
    platformConv.State = FormMode.Insert;
    platformConv.ListParticipant = [user];
    return platformConv;
  }

  //#region  Conversation
  /**
   * Lấy dữ liệu cuộc trò chuyện từ platform
   *
   * @memberof ConversationListComponent
   */
  getPlatformConversation(): void {
    try {
      this.convPagingRequest.Filter = window.btoa(
        `[["ConversationName","contains","${this._valueSearch}"]]`
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
                const flatformConv = data.Data.PageData;
                const convFilter = convs?.filter((el) => {
                  return flatformConv
                    .map((v) => v.ConversationID)
                    .includes(el.id);
                });
                convFilter?.forEach((e) => {
                  this.getLastMessageSenderName(e);

                  this.handleDisplayLastMessage(e);
                  this.encodeHTML(e.lastMessage);
                });
                this.listConversations = convFilter;

              }
            );
          }
          this.checkEmpty();
        });
    } catch (error) {
      this.isLoading = false;
      this.checkEmpty();
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
      case MessageType.Video:
        e.lastMessage.content.content =
          e?.senderName + ' đã gửi ' + ' video';
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

  encodeHTML(data): void {
    // let t = data.content.content;
    const txt = document.createElement('textarea');
    txt.innerHTML = data.content.content;
    data.content.content = txt.innerHTML;
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
        // cập nhật đã đọc lên server stringee
        this.stringeeService.markConversationAsRead(conversation.id, undefined);
      }

      this.router.navigate(['m', conversation.id], {
        state: {
          con: conversation,
        },
      });
      this.clearSearch.emit();
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  trackByConver(index, item): any {
    return item.id;
  }

  checkEmpty(): void {
    if (this.listConversations?.length || this.listDirectory?.length) {
      this.isEmpty = false;
    }
    else {
      this.isEmpty = true;
    }
  }
  //#endregion
}

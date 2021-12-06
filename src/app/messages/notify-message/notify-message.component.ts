import { Component, Input, OnInit } from '@angular/core';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { MessageType } from 'src/app/shared/enum/message-type.enum';
import { ConversationActionMessage } from '../enums/conversation-action-message.enum';
import { Message } from '../models/Message';

@Component({
  selector: 'amis-notify-message',
  templateUrl: './notify-message.component.html',
  styleUrls: ['./notify-message.component.scss']
})
export class NotifyMessageComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  _msg!: Message;
  @Input() set msg(data) {
    this._msg = data;
    setTimeout(() => {
      this.handleMessage();
    }, 0);
  }
  // tslint:disable-next-line:variable-name
  _conv: any;
  @Input() set conv(data) {
    this._conv = data;
  }

  creator: any;

  notifyText = "";
  constructor() { }

  ngOnInit(): void {
  }

  handleMessage(): void {
    try {

      if (this._msg.type == MessageType.Notification) {
        if (this._msg.content.type == ConversationActionMessage.AddMember) {

          // console.log(this._conv);


          const listMemberNameAdded = this._msg.content.participants.map(d => {
            return CommonFn.getUserByStringeeID(d.user)?.DisplayName;
          });

          this.notifyText = "<div>";
          listMemberNameAdded.forEach(e => {

            this.notifyText += `<div>${this._msg.content.addedInfo.displayName} đã thêm ${e} vào cuộc trò chuyện</div>`;
          });
          this.notifyText += "</div>";


        }
        else if (this._msg.content.type == ConversationActionMessage.RemoveMember) {

          const creator = this._msg.content.removedInfo.displayName;
          // Case xóa khỏi nhóm

          if (this._msg.content.removedBy != this._msg.content.participants[0].user) {
            this.notifyText = `${creator} đã xóa ${CommonFn.getUserByStringeeID(this._msg.content.participants[0].user)?.DisplayName} khỏi cuộc trò chuyện`;
          }
          // Case tự rời nhóm
          if (this._msg.content.removedBy == this._msg.content.participants[0].user) {
            this.notifyText = `${this._msg.content.removedInfo.displayName} đã rời khỏi cuộc trò chuyện`;
          }
        }
        else if (this._msg.content.type == ConversationActionMessage.RenameConv) {
          const creator = this._conv.participants?.find(e => e.userId == this._msg.sender);
          this.notifyText = creator?.name + " đã đổi tên cuộc trò chuyện thành " + this._msg.content.groupName;
        }
      }
      else if (MessageType.Creation) {
        const creator = this._conv.participants?.find(e => e.userId == this._msg.content.creator);
        this.notifyText = `${creator.name} đã tạo cuộc trò chuyện`;
      }
    } catch (error) {
      CommonFn.logger(error);
    }


  }
}

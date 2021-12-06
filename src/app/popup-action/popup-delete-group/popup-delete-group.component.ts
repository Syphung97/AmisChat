import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { StringeeService } from 'src/app/core/services/stringee.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AmisTranferDataService } from 'src/app/core/services/amis-tranfer-data.service';
import { UserService } from 'src/app/core/services/users/user.service';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { AmisTranslationService } from 'src/app/core/services/amis-translation-service.service';

@Component({
  selector: 'amis-popup-delete-group',
  templateUrl: './popup-delete-group.component.html',
  styleUrls: ['./popup-delete-group.component.scss']
})
export class PopupDeleteGroupComponent implements OnInit {

  constructor(
    private stringeeService: StringeeService,
    private nzMessage: NzMessageService,
    private tranferSV: AmisTranferDataService,
    private translateSV: AmisTranslationService
  ) { }
  @Input() isVisible!: boolean;
  @Input() conversation: any;
  @Output() isPopupDeleteGroupChat = new EventEmitter();
  currentUser!: any;
  ngOnInit(): void {
    this.currentUser = UserService.UserInfo.StringeeUserID;
  }
  /**
   * đóng popup, bắn event đóng popup sang sider
   */
  close(): void {
    this.isVisible = false;
    this.isPopupDeleteGroupChat.emit(false);
  }
  closePopup(isVisible: any): void {
    this.isVisible = isVisible;
    this.isPopupDeleteGroupChat.emit(false);
  }

  /**
   * xóa cuộc trò chuyện
   * dvquang2 31/05/2021
   */
  async deleteChat() {
    try {
      // check với trường hợp ko là group thì cho xóa luôn
      if (!this.conversation.isGroup) {
        this.stringeeService.deleteConversation(this.conversation.id, async (res) => {
          //console.log('xóa cuộc trò chuyện:' + this.conversation.id + "--" + res);
          if (res) {
            this.isVisible = false;
            this.isPopupDeleteGroupChat.emit(false);
            const deleteConversation = await this.translateSV.getValueByKey("DELETE_CONVERSATION_SUCSSES", undefined).toPromise()
            this.nzMessage.success(deleteConversation);
            this.tranferSV.handleDeleteConversation();
          }
          else {
            const deleteConversationF = await this.translateSV.getValueByKey("DELETE_CONVERSATION_FALSE", undefined).toPromise()
            this.nzMessage.error(deleteConversationF);
          }
        })
      }
    } catch (error) {
      CommonFn.logger(error);
    }
  }
  /**
   * xóa cuộc trò chuyện
   * bổ sung trước khi gọi api xóa thì gọi api rời cuộc trò chuyện
   * DVQuang2 24/05/2021
   */
  async deleteGroup() {
    try {
      const listCurrentUser = new Array();
      listCurrentUser.push(this.currentUser);
      // rời group = xóa chính nó khỏi nhóm
      this.stringeeService.removePaticipants(this.conversation.id, listCurrentUser, async (res) => {
        if (res) {
          this.stringeeService.deleteConversation(this.conversation.id, async (res) => {
            //console.log('xóa cuộc trò chuyện:' + this.conversation.id + "--" + res);
            if (res) {
              this.isVisible = false;
              this.isPopupDeleteGroupChat.emit(false);
              const deleteConversation = await this.translateSV.getValueByKey("", undefined).toPromise()
              this.nzMessage.success(deleteConversation);
              this.tranferSV.handleDeleteConversation();
            }
            else {
              this.nzMessage.error('Xóa cuộc trò chuyện thất bại!');
            }
          })
        }
        else {
          this.nzMessage.error('Xóa cuộc trò chuyện thất bại!');
        }
      });
    } catch (error) {
      CommonFn.logger(error);
    }
  }
}

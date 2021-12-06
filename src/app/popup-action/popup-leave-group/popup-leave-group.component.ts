import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AmisTranferDataService } from 'src/app/core/services/amis-tranfer-data.service';
import { UserService } from 'src/app/core/services/users/user.service';
import { StringeeService } from 'src/app/core/services/stringee.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { AmisTranslationService } from 'src/app/core/services/amis-translation-service.service';
import { ConversationService } from 'src/app/conversation/services/conversation.service';

@Component({
  selector: 'amis-popup-leave-group',
  templateUrl: './popup-leave-group.component.html',
  styleUrls: ['./popup-leave-group.component.scss'],
})
export class PopupLeaveGroupComponent implements OnInit {
  @Input() isVisible!: boolean;
  @Output() isPopupLeaveGroup = new EventEmitter();
  currentUser: any;
  @Input() conversation: any;
  constructor(
    private tranferSV: AmisTranferDataService,
    private stringeeService: StringeeService,
    private nzMessage: NzMessageService,
    private translateSV: AmisTranslationService,
    private conversationSV: ConversationService
  ) {}

  ngOnInit(): void {
    this.currentUser = UserService.UserInfo.StringeeUserID;
  }

  closePopup(event): void {
    this.isVisible = false;
    this.isPopupLeaveGroup.emit(false);
  }

  /**
   * xóa chính mình khỏi nhóm = rời group
   * dvquang2 28/05/2021
   * @param conversation
   */
  async leaveGroup(): Promise<void> {
    try {
      const listUserID = new Array();
      listUserID.push(this.currentUser);

      this.conversationSV
        .removeParticipant(this.conversation.id, this.currentUser)
        .subscribe((data) => {});

      this.stringeeService.removePaticipants(
        this.conversation.id,
        listUserID,
        async (res) => {
          if (res) {
            this.isVisible = false;
            this.isPopupLeaveGroup.emit(false);
            const leaveGroup = await this.translateSV
              .getValueByKey('LEAVE_GROUP_SUCSSES', undefined)
              .toPromise();
            this.nzMessage.success(leaveGroup);
            this.tranferSV.handleDeleteConversation();
          } else {
            const leaveGroupF = await this.translateSV
              .getValueByKey('LEAVE_GROUP_FALSE', undefined)
              .toPromise();
            this.nzMessage.error(leaveGroupF);
          }
        }
      );
    } catch (error) {
      CommonFn.logger(error);
    }
  }
}

import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { StringeeService } from 'src/app/core/services/stringee.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { AmisTranslationService } from 'src/app/core/services/amis-translation-service.service';
import { ConversationService } from 'src/app/conversation/services/conversation.service';
@Component({
  selector: 'amis-popup-delete-member',
  templateUrl: './popup-delete-member.component.html',
  styleUrls: ['./popup-delete-member.component.scss']
})
export class PopupDeleteMemberComponent implements OnInit {


  @Input() isVisible = true;
  // user từ bên popup memeber
  @Input() user: any;
  // conversationt từ popup member
  @Input() conversation: any;

  @Output() isPopupDeleteMember = new EventEmitter();
  // member được xóa
  @Output() isMemberDelete = new EventEmitter();
  constructor(
    private stringeeService: StringeeService,
    private nzMessage: NzMessageService,
    private translateSV: AmisTranslationService,
    private conversationSV: ConversationService
  ) { }

  ngOnInit(): void {
  }
  closePopup(isVisible: any): void {
    this.isVisible = isVisible;
    this.isPopupDeleteMember.emit(false);
  }
  close(): void {
    this.isVisible = false;
    this.isPopupDeleteMember.emit(false);
  }
  /**
   * xóa thành viên khỏi nhóm, chỉ cho người tạo nhóm xóa
   * DVQuang2 28/05/2021
   */
  async deleteMember() {
    try {
      const listUserId = new Array();
      listUserId.push(this.user.StringeeUserID);
      this.conversationSV
      .removeParticipant(this.conversation.id, this.user.StringeeUserID)
      .subscribe((data) => {});
      this.stringeeService.removePaticipants(this.conversation.id, listUserId, async (res) => {
        //console.log('xóa thành viên:' + this.conversation.id + "--" + this.user.StringeeUserID + "---" + res);
        if (res) {
          this.isVisible = false;
          this.isPopupDeleteMember.emit(false);
          const deleteMember = await this.translateSV.getValueByKey("DELETE_MEMBER_SUCSSES", undefined).toPromise();
          this.nzMessage.success(deleteMember);
          this.isMemberDelete.emit(this.user);

        }
        else {
          const deleteMemberF = await this.translateSV.getValueByKey("DELETE_MEMBER_FALSE", undefined).toPromise();
          this.nzMessage.error(deleteMemberF);
        }
      });
    } catch (error) {
      CommonFn.logger(error);
    }
  }
}

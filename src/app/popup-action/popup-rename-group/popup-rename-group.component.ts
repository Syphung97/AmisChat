import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { LodashUtils } from 'src/app/core/functions/lodash-util';
import { StringeeService } from 'src/app/core/services/stringee.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonFn } from 'src/app/core/functions/commonFn';
import { AmisTranslationService } from 'src/app/core/services/amis-translation-service.service';
import { subscribeOn } from 'rxjs/operators';
import { ConversationService } from 'src/app/conversation/services/conversation.service';
import { FieldUpdate } from 'src/app/core/models/FieldUpdate';
@Component({
  selector: 'amis-popup-rename-group',
  templateUrl: './popup-rename-group.component.html',
  styleUrls: ['./popup-rename-group.component.scss'],
})
export class PopupRenameGroupComponent implements OnInit {
  // bắt conversation từ sider truyền sang

  _conversation: any;
  @Input() set conversation(data: any) {
    this._conversation = LodashUtils.cloneDeepData(data);
  }

  @Input() isVisible;
  @Output() isPopupRenameGroup = new EventEmitter();

  groupName!: string;
  constructor(
    private stringeeService: StringeeService,
    private nzMessage: NzMessageService,
    private translateSV: AmisTranslationService,
    private conversationSV: ConversationService
  ) {}

  ngOnInit(): void {}

  close(): void {
    this.isPopupRenameGroup.emit(false);
    this.isVisible = false;
  }
  closePopup(isVisible: any): void {
    this.isVisible = isVisible;
    this.isPopupRenameGroup.emit(false);
  }

  /**
   * đổi tên nhóm
   * dvquang2
   */
  async changeGroupName() {
    try {
      const data = {
        name: this._conversation.name,
      };

      const fieldUpdate = new FieldUpdate();
      fieldUpdate.ModelName = 'Conversation';
      fieldUpdate.FieldKey = 'ConversationID';
      fieldUpdate.ValueKey = this._conversation.id;
      fieldUpdate.FieldNameAndValue = {
        ConversationName: this._conversation.name,
      };
      this.conversationSV.updateField(fieldUpdate).subscribe((res) => {});

      this.stringeeService.updateConversation(
        this._conversation.id,
        data,
        async (res) => {
          if (res) {
            this.isVisible = false;
            this.isPopupRenameGroup.emit(false);
            const renameGroup = await this.translateSV
              .getValueByKey('RENAME_GROUP_SUCSSES', undefined)
              .toPromise();
            this.nzMessage.success(renameGroup);
          } else {
            const renameFalse = await this.translateSV
              .getValueByKey('RENAME_GROUP_FALSE', undefined)
              .toPromise();
            this.nzMessage.error(renameFalse);
          }
        }
      );
    } catch (error) {
      CommonFn.logger(error);
    }
  }

  enterChangeNameGroup(event: any) {
    if (event.key == 'Enter') {
      this.changeGroupName();
    }
  }
}

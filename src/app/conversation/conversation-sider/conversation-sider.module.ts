import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationSiderComponent } from './conversation-sider.component';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';
import { IconModule } from 'src/app/shared/components/icon/icon.module';
import { TranslateModule } from '@ngx-translate/core';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { PopupDeleteGroupModule } from 'src/app/popup-action/popup-delete-group/popup-delete-group.module';
import { PopupRenameGroupModule } from 'src/app/popup-action/popup-rename-group/popup-rename-group.module';
import { PopupAddUserModule } from 'src/app/popup-action/popup-add-user/popup-add-user.module';
import { PopupMemberModule } from 'src/app/popup-action/popup-member/popup-member.module';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { PopupLeaveGroupModule } from 'src/app/popup-action/popup-leave-group/popup-leave-group.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { AvatarGroupModule } from 'src/app/shared/components/avatar-group/avatar-group.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NameConvModule } from 'src/app/core/pipes/name-conv/name-conv.module';
@NgModule({
  declarations: [
    ConversationSiderComponent
  ],
  imports: [
    CommonModule,
    AvatarModule,
    IconModule,
    TranslateModule,
    NzSwitchModule,
    FormsModule,
    NzPopoverModule,
    PopupDeleteGroupModule,
    PopupRenameGroupModule,
    PopupAddUserModule,
    PopupMemberModule,
    NzMessageModule,
    PopupLeaveGroupModule,
    NzDividerModule,
    AvatarGroupModule,
    NzMenuModule,
    NzImageModule,
    NameConvModule
  ],
  exports: [ConversationSiderComponent]
})
export class ConversationSiderModule { }

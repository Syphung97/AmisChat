import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { LayoutModule } from '../layout.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';
import { PopupModule } from 'src/app/shared/components/popup/popup.module';
import { SearchBoxModule } from 'src/app/shared/components/search-box/search-box.module';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from 'src/app/shared/components/icon/icon.module';
import { PopupNewConversationModule } from 'src/app/popup-action/popup-new-conversation/popup-new-conversation.module';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { ConversationListModule } from './conversation-list/conversation-list.module';
import { UserListModule } from './user-list/user-list.module';


@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    NzMenuModule,
    AvatarModule,
    PopupModule,
    SearchBoxModule,
    TranslateModule,
    IconModule,
    PopupNewConversationModule,
    NzPopoverModule,
    NzSkeletonModule,
    ConversationListModule,
    UserListModule
  ],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }

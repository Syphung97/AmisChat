import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationBoxComponent } from './conversation-box.component';
import { ConversationBoxRoutingModule } from './conversation-box-routing.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { IconModule } from 'src/app/shared/components/icon/icon.module';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';
import { TranslateModule } from '@ngx-translate/core';
import { ConversationSiderModule } from '../conversation-sider/conversation-sider.module';
import { ConversationSelectUserModule } from '../conversation-select-user/conversation-select-user.module';
import { FormsModule } from '@angular/forms';
import { MessageListModule } from 'src/app/messages/message-list/message-list.module';
import { MessageComposerModule } from 'src/app/messages/message-composer/message-composer.module';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { TypingIndicatorModule } from 'src/app/shared/components/typing-indicator/typing-indicator.module';


@NgModule({
  declarations: [
    ConversationBoxComponent
  ],
  imports: [
    CommonModule,
    ConversationBoxRoutingModule,
    NzLayoutModule,
    MessageComposerModule,
    ConversationSiderModule,
    ConversationSelectUserModule,
    FormsModule,
    AvatarModule,
    MessageListModule,
    NzMessageModule,
    TypingIndicatorModule
  ]
})
export class ConversationBoxModule { }

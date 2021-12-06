import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationHeaderComponent } from './conversation-header.component';
import { IconModule } from 'src/app/shared/components/icon/icon.module';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarGroupModule } from 'src/app/shared/components/avatar-group/avatar-group.module';
import { CallModule } from 'src/app/call/call.module';
import { NameConvModule } from 'src/app/core/pipes/name-conv/name-conv.module';


@NgModule({
  declarations: [
    ConversationHeaderComponent
  ],
  imports: [
    CommonModule,
    IconModule,
    AvatarModule,
    TranslateModule,
    AvatarGroupModule,
    CallModule,
    NameConvModule
  ],
  exports: [ConversationHeaderComponent]
})
export class ConversationHeaderModule {
  public static component = {
    Component: ConversationHeaderComponent
  };
}

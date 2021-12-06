import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationListComponent } from './conversation-list.component';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { AvatarGroupModule } from 'src/app/shared/components/avatar-group/avatar-group.module';
import { NameConvModule } from 'src/app/core/pipes/name-conv/name-conv.module';
import { ContentInfoModule } from 'src/app/shared/components/content-info/content-info.module';
import { NzPopoverModule } from 'ng-zorro-antd/popover';






@NgModule({
  declarations: [
    ConversationListComponent
  ],
  imports: [
    CommonModule,
    AvatarModule,
    NzSkeletonModule,
    AvatarGroupModule,
    NameConvModule,
    ContentInfoModule,
    NzPopoverModule
  ],
  exports: [ConversationListComponent]
})
export class ConversationListModule {
  public static component = { Component: ConversationListComponent };
}

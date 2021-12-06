import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SenderFileMessageComponent } from './sender-file-message.component';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';
import { MessageActionModule } from '../message-action/message-action.module';
import { NoSantizeModule } from 'src/app/core/pipes/no-santize/no-santize.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { IconModule } from 'src/app/shared/components/icon/icon.module';
import { ReplyMessageModule } from '../reply-message/reply-message.module';



@NgModule({
  declarations: [
    SenderFileMessageComponent
  ],
  imports: [
    CommonModule,
    NzToolTipModule,
    NzPopoverModule,
    MessageActionModule,
    NoSantizeModule,
    IconModule,
    ReplyMessageModule
  ],
  exports: [SenderFileMessageComponent]
})
export class SenderFileMessageModule { }

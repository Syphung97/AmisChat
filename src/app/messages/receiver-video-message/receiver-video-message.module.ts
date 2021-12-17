import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiverVideoMessageComponent } from './receiver-video-message.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { IconModule } from 'src/app/shared/components/icon/icon.module';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';
import { MessageActionModule } from '../message-action/message-action.module';
import { NoSantizeModule } from 'src/app/core/pipes/no-santize/no-santize.module';
import { NzImageModule } from 'ng-zorro-antd/image';
import { ReplyMessageModule } from '../reply-message/reply-message.module';


@NgModule({
  declarations: [
    ReceiverVideoMessageComponent
  ],
  imports: [
    CommonModule,
    NzToolTipModule,
    NzPopoverModule,
    MessageActionModule,
    NoSantizeModule,
    IconModule,
    NzImageModule,
    AvatarModule,
    ReplyMessageModule
  ],
  exports: [
    ReceiverVideoMessageComponent
  ]
})
export class ReceiverVideoMessageModule { }

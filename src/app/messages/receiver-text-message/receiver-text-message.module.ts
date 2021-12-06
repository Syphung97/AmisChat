import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReceiverTextMessageComponent } from './receiver-text-message.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ReadReceiptModule } from '../read-receipt/read-receipt.module';
import { IconModule } from 'src/app/shared/components/icon/icon.module';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';
import { MessageActionModule } from '../message-action/message-action.module';
import { NoSantizeModule } from 'src/app/core/pipes/no-santize/no-santize.module';
import { ReplyMessageModule } from '../reply-message/reply-message.module';


@NgModule({
  declarations: [
    ReceiverTextMessageComponent
  ],
  imports: [
    CommonModule,
    NzToolTipModule,
    ReadReceiptModule,
    IconModule,
    NzPopoverModule,
    AvatarModule,
    MessageActionModule,
    NoSantizeModule,
    ReplyMessageModule
  ],
  exports: [ReceiverTextMessageComponent]
})
export class ReceiverTextMessageModule { }

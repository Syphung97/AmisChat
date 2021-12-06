import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SenderTextMessageComponent } from './sender-text-message.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ReadReceiptModule } from '../read-receipt/read-receipt.module';
import { IconModule } from 'src/app/shared/components/icon/icon.module';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { MessageActionModule } from '../message-action/message-action.module';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { NoSantizeModule } from 'src/app/core/pipes/no-santize/no-santize.module';
import { ReplyMessageModule } from '../reply-message/reply-message.module';

@NgModule({
  declarations: [
    SenderTextMessageComponent
  ],
  imports: [
    CommonModule,
    NzToolTipModule,
    ReadReceiptModule,
    IconModule,
    NzPopoverModule,
    MessageActionModule,
    EmojiModule,
    NoSantizeModule,
    ReplyMessageModule
  ],
  exports: [SenderTextMessageComponent]
})
export class SenderTextMessageModule { }

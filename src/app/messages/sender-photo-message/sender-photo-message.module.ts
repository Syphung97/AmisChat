import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SenderPhotoMessageComponent } from './sender-photo-message.component';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { MessageActionModule } from '../message-action/message-action.module';
import { NoSantizeModule } from 'src/app/core/pipes/no-santize/no-santize.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { IconModule } from 'src/app/shared/components/icon/icon.module';
import { NzImageModule } from 'ng-zorro-antd/image';
import { ReplyMessageModule } from '../reply-message/reply-message.module';




@NgModule({
  declarations: [
    SenderPhotoMessageComponent
  ],
  imports: [
    CommonModule,
    NzToolTipModule,
    NzPopoverModule,
    MessageActionModule,
    NoSantizeModule,
    IconModule,
    NzImageModule,
    ReplyMessageModule
  ],
  exports: [SenderPhotoMessageComponent]
})
export class SenderPhotoMessageModule { }

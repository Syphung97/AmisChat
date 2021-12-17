import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageListComponent } from './message-list.component';
import { SenderTextMessageModule } from '../sender-text-message/sender-text-message.module';
import { ReceiverTextMessageModule } from '../receiver-text-message/receiver-text-message.module';
import { NotifyMessageModule } from '../notify-message/notify-message.module';
import { TypingIndicatorModule } from 'src/app/shared/components/typing-indicator/typing-indicator.module';
import { SenderFileMessageModule } from '../sender-file-message/sender-file-message.module';
import { ReceiverFileMessageModule } from '../receiver-file-message/receiver-file-message.module';
import { SenderPhotoMessageModule } from '../sender-photo-message/sender-photo-message.module';
import { ReceiverPhotoMessageModule } from '../receiver-photo-message/receiver-photo-message.module';
import { SenderVideoMessageModule } from '../sender-video-message/sender-video-message.module';
import { ReceiverVideoMessageModule } from '../receiver-video-message/receiver-video-message.module';



@NgModule({
  declarations: [
    MessageListComponent
  ],
  imports: [
    CommonModule,
    SenderTextMessageModule,
    ReceiverTextMessageModule,
    NotifyMessageModule,
    TypingIndicatorModule,
    SenderFileMessageModule,
    ReceiverFileMessageModule,
    SenderPhotoMessageModule,
    ReceiverPhotoMessageModule,
    SenderVideoMessageModule,
    ReceiverVideoMessageModule
  ],
  exports: [MessageListComponent]
})
export class MessageListModule { }

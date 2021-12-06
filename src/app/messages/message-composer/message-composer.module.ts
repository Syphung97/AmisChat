import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComposerComponent } from './message-composer.component';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from 'src/app/shared/components/icon/icon.module';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { MessageUploadFileComponent } from './message-upload-file/message-upload-file.component';
import { UploadDirectiveModule } from 'src/app/core/directives/upload-directive/upload-directive.module';
import { MessageUploadImageComponent } from './message-upload-image/message-upload-image.component';
import { NzImageModule } from 'ng-zorro-antd/image';
@NgModule({
  declarations: [
    MessageComposerComponent,
    MessageUploadFileComponent,
    MessageUploadImageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AvatarModule,
    TranslateModule,
    IconModule,
    PickerModule,
    EmojiModule,
    NzModalModule,
    UploadDirectiveModule,
    NzImageModule
  ],
  exports: [MessageComposerComponent]
})
export class MessageComposerModule { }

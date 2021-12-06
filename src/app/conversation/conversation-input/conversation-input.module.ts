import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationInputComponent } from './conversation-input.component';
import { NzMentionModule } from 'ng-zorro-antd/mention';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from 'src/app/shared/components/icon/icon.module';


@NgModule({
  declarations: [
    ConversationInputComponent
  ],
  imports: [
    CommonModule,
    NzMentionModule,
    FormsModule,
    AvatarModule,
    TranslateModule,
    IconModule
  ],
  exports: [ConversationInputComponent]
})
export class ConversationInputModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupNewConversationComponent } from './popup-new-conversation.component';
import { PopupModule } from 'src/app/shared/components/popup/popup.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';



@NgModule({
  declarations: [
    PopupNewConversationComponent
  ],
  imports: [
    CommonModule,
    PopupModule,
    NzInputModule,
    FormsModule,
    NzSelectModule,
    AvatarModule
  ],
  exports: [PopupNewConversationComponent]
})
export class PopupNewConversationModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationSelectUserComponent } from './conversation-select-user.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';
import { AutoFocusModule } from 'src/app/core/directives/auto-focus/auto-focus.module';



@NgModule({
  declarations: [
    ConversationSelectUserComponent
  ],
  imports: [
    CommonModule,
    NzSelectModule,
    FormsModule,
    TranslateModule,
    AvatarModule,
    AutoFocusModule
  ]
})
export class ConversationSelectUserModule {

  public static component = { Component: ConversationSelectUserComponent };
}

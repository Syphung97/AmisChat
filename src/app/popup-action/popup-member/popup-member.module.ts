import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupMemberComponent } from './popup-member.component';
import { PopupModule } from 'src/app/shared/components/popup/popup.module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';
import { IconModule } from 'src/app/shared/components/icon/icon.module';
import { PopupDeleteMemberModule } from '../popup-delete-member/popup-delete-member.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    PopupMemberComponent
  ],
  imports: [
    CommonModule,
    PopupModule,
    NzTabsModule,
    AvatarModule,
    IconModule,
    PopupDeleteMemberModule,
    TranslateModule
  ],
  exports: [PopupMemberComponent]
})
export class PopupMemberModule { }

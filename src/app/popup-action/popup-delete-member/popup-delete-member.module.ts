import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupDeleteMemberComponent } from './popup-delete-member.component';
import { PopupConfirmModule } from 'src/app/shared/components/popup-confirm/popup-confirm.module';
import { TranslateModule } from '@ngx-translate/core';
import { NzMessageModule } from 'ng-zorro-antd/message';




@NgModule({
  declarations: [
    PopupDeleteMemberComponent
  ],
  imports: [
    CommonModule,
    PopupConfirmModule,
    TranslateModule,
    NzMessageModule
  ],
  exports: [PopupDeleteMemberComponent]
})
export class PopupDeleteMemberModule { }

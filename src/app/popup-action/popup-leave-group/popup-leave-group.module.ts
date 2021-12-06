import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupLeaveGroupComponent } from './popup-leave-group.component';
import { PopupConfirmModule } from 'src/app/shared/components/popup-confirm/popup-confirm.module';
import { TranslateModule } from '@ngx-translate/core';
import { NzMessageModule } from 'ng-zorro-antd/message';




@NgModule({
  declarations: [
    PopupLeaveGroupComponent
  ],
  imports: [
    CommonModule,
    PopupConfirmModule,
    TranslateModule,
    NzMessageModule
  ],
  exports: [PopupLeaveGroupComponent]
})
export class PopupLeaveGroupModule { }

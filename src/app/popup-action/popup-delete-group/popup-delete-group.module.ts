import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupDeleteGroupComponent } from './popup-delete-group.component';
import { PopupConfirmModule } from 'src/app/shared/components/popup-confirm/popup-confirm.module';
import { TranslateModule } from '@ngx-translate/core';
import { NzMessageModule } from 'ng-zorro-antd/message';



@NgModule({
  declarations: [
    PopupDeleteGroupComponent
  ],
  imports: [
    CommonModule,
    PopupConfirmModule,
    TranslateModule,
    NzMessageModule
  ],
  exports: [PopupDeleteGroupComponent]
})
export class PopupDeleteGroupModule { }

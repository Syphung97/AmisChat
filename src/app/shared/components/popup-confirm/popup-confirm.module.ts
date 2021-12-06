import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupConfirmComponent } from './popup-confirm.component';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PopupConfirmComponent
  ],
  imports: [
    CommonModule,
    NzModalModule,
    TranslateModule
  ],
  exports: [PopupConfirmComponent]
})
export class PopupConfirmModule { }

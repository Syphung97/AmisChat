import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupRenameGroupComponent } from './popup-rename-group.component';
import { PopupModule } from 'src/app/shared/components/popup/popup.module';
import { FormsModule } from '@angular/forms';
import { AutoFocusModule } from 'src/app/core/directives/auto-focus/auto-focus.module';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    PopupRenameGroupComponent,

  ],
  imports: [
    CommonModule,
    PopupModule,
    FormsModule,
    AutoFocusModule,
    NzMessageModule,
    TranslateModule
  ],
  exports: [PopupRenameGroupComponent]
})
export class PopupRenameGroupModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupAddUserComponent } from './popup-add-user.component';
import { PopupModule } from 'src/app/shared/components/popup/popup.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AvatarModule } from 'src/app/shared/components/avatar/avatar.module';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { TranslateModule } from '@ngx-translate/core';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
@NgModule({
  declarations: [
    PopupAddUserComponent
  ],
  imports: [
    CommonModule,
    PopupModule,
    NzInputModule,
    FormsModule,
    NzSelectModule,
    AvatarModule,
    NzMessageModule,
    TranslateModule,
    NzTreeSelectModule

  ],
  exports: [PopupAddUserComponent]
})
export class PopupAddUserModule { }

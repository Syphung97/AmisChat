import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { LayoutModule } from '../layout.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule } from '@ngx-translate/core';

import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { PopupMemberModule } from 'src/app/popup-action/popup-member/popup-member.module';
import { PopupConfirmModule } from 'src/app/shared/components/popup-confirm/popup-confirm.module';
import { PopupDeleteMemberModule } from 'src/app/popup-action/popup-delete-member/popup-delete-member.module';
import { PopupRenameGroupModule } from 'src/app/popup-action/popup-rename-group/popup-rename-group.module';

@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    NzIconModule,
    TranslateModule,
    FormsModule,
    NzSwitchModule,
    PopupMemberModule,
    PopupDeleteMemberModule,
    PopupRenameGroupModule
    
  ],
  exports: [
    NavbarComponent
  ]
})
export class NavbarModule { }

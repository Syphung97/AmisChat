import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupImportMultiAvatarComponent } from './popup-import-multi-avatar.component';
import { TranslateModule } from '@ngx-translate/core';
import { DxTextBoxModule, DxDataGridModule, DxPopoverModule, DxScrollViewModule } from 'devextreme-angular';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisUploadDirectiveModule } from 'src/common/directive/upload-directive/upload-directive.module';
import { BaseModule } from 'src/common/components/base/base.module';



@NgModule({
  declarations: [PopupImportMultiAvatarComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    AmisButtonModule,
    TranslateModule,
    DxTextBoxModule,
    DxDataGridModule,
    AmisUploadDirectiveModule,
    BaseModule,
    DxPopoverModule,
    DxScrollViewModule
  ],
  exports:[
    PopupImportMultiAvatarComponent
  ]
})
export class PopupImportMultiAvatarModule { }

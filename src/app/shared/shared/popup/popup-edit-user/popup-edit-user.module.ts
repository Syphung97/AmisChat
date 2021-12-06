import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupEditUserComponent } from './popup-edit-user.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { AmisShortNameModule } from 'src/common/pipes/amis-name/amis-short-name.module';
import { DxSelectBoxModule, DxTagBoxModule, DxTreeViewModule, DxTooltipModule, DxDataGridModule } from 'devextreme-angular';
import { AmisControlFormGroupModule } from 'src/common/components/amis-control-form-group/amis-control-form-group.module';


@NgModule({
  declarations: [PopupEditUserComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    AmisButtonModule,
    TranslateModule,
    AmisShortNameModule,
    DxSelectBoxModule,
    DxTagBoxModule,
    DxTreeViewModule,
    DxTooltipModule,
    DxDataGridModule,
    AmisControlFormGroupModule
  ],
  exports: [PopupEditUserComponent]
})
export class PopupEditUserModule {}

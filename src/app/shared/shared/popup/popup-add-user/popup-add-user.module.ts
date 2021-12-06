import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupAddUserComponent } from './popup-add-user.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisControlComboboxModule } from 'src/common/components/amis-control-combobox/amis-control-combobox.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { DxCheckBoxModule, DxTextBoxModule } from 'devextreme-angular';
import { AmisControlGroupModule } from 'src/common/components/amis-control-group/amis-control-group.module';
import { FormsModule } from '@angular/forms';
import { HrmProfileToolbarModule } from 'src/app/components/hrm-profile/hrm-profile-view/hrm-profile-toolbar/hrm-profile-toolbar.module';
import { AmisPagingGridModule } from 'src/common/components/amis-grid/amis-paging-grid/amis-paging-grid.module';
import { DxSelectBoxModule, DxTagBoxModule, DxTreeViewModule, DxTooltipModule, DxDataGridModule } from 'devextreme-angular';
import { AmisControlFormGroupModule } from 'src/common/components/amis-control-form-group/amis-control-form-group.module';


@NgModule({
  declarations: [PopupAddUserComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    AmisControlComboboxModule,
    AmisButtonModule,
    TranslateModule,
    DxCheckBoxModule,
    AmisControlGroupModule,
    DxTextBoxModule,
    FormsModule,
    HrmProfileToolbarModule,
    AmisPagingGridModule,
    DxSelectBoxModule,
    DxTagBoxModule,
    DxTreeViewModule,
    DxTooltipModule,
    DxDataGridModule,
    AmisControlFormGroupModule
  ],
  exports: [PopupAddUserComponent]
})
export class PopupAddUserModule {}

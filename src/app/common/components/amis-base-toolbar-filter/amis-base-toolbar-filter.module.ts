import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DxSelectBoxModule, DxDropDownBoxModule, DxScrollViewModule,
  DxTreeViewModule, DxTextBoxModule, DxDateBoxModule, DxPopupModule, DxNumberBoxModule } from 'devextreme-angular';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisDropdownModule } from 'src/common/components/amis-dropdown/amis-dropdown.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AmisControlComboboxModule } from 'src/common/components/amis-control-combobox/amis-control-combobox.module';
import { AmisControlSelectHumanModule } from 'src/common/components/amis-control-select-human/amis-control-select-human.module';
import { AmisControlTreeBoxModule } from 'src/common/components/amis-control-treebox/amis-control-treebox.module';
import { PopupAcceptRemoveModule } from 'src/common/components/popup/popup-accept-remove/popup-accept-remove.module';

import { AmisBaseToolbarFilterComponent } from './amis-base-toolbar-filter.component';
import { AmisControlDateboxModule } from '../amis-control-datebox/amis-control-datebox.module';
import { AmisControlTagboxModule } from '../amis-control-tagbox/amis-control-tagbox.module';
import { AmisIconModule } from '../amis-icon/amis-icon.module';



@NgModule({
  declarations: [AmisBaseToolbarFilterComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    TranslateModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxDropDownBoxModule,
    DxTreeViewModule,
    AmisControlComboboxModule,
    AmisControlSelectHumanModule,
    AmisControlTreeBoxModule,
    DxTextBoxModule,
    AmisButtonModule,
    DxPopupModule,
    PopupAcceptRemoveModule,
    DxNumberBoxModule,
    AmisDropdownModule,
    AmisControlDateboxModule,
    AmisControlTagboxModule,
    DxScrollViewModule,
    AmisIconModule
  ],
  exports: [AmisBaseToolbarFilterComponent]
})
export class AmisBaseToolbarFilterModule { }

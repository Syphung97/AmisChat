import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupAddDeductIncomeComponent } from './popup-add-deduct-income.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { DxSelectBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import { AmisControlComboboxModule } from 'src/common/components/amis-control-combobox/amis-control-combobox.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { AmisControlGroupModule } from 'src/common/components/amis-control-group/amis-control-group.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [PopupAddDeductIncomeComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    DxSelectBoxModule,
    AmisControlComboboxModule,
    AmisButtonModule,
    TranslateModule,
    DxCheckBoxModule,
    AmisControlGroupModule,
    FormsModule
  ],
  exports:[PopupAddDeductIncomeComponent]
})
export class PopupAddDeductIncomeModule { }

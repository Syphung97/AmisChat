import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlCompareGroupRowComponent } from './amis-control-compare-group-row.component';
import { AmisButtonModule } from '../../amis-button/amis-button.module';
import { AmisPagingGridModule } from '../../amis-grid/amis-paging-grid/amis-paging-grid.module';
import { TranslateModule } from '@ngx-translate/core';
import { DxDataGridModule, DxPopoverModule } from 'devextreme-angular';
import { AmisIconModule } from '../../amis-icon/amis-icon.module';
import { AMISDateModule } from 'src/common/pipes/amis-date/amis-date.module';
import { AMISCurrencyModule } from 'src/common/pipes/amis-currency/amis-currency.module';
import { AmisAMISDecimalModule } from 'src/common/pipes/amis-decimal/amis-decimal.module';
import { AmisPopupModule } from '../../amis-popup/amis-popup.module';
import { PopupCompareUpdateFieldComponent } from './popup-compare-update-field/popup-compare-update-field.component';
import { AmisControlFieldModule } from '../../amis-control-field/amis-control-field.module';
import { AmisControlTextareaModule } from '../../amis-control-textarea/amis-control-textarea.module';
import { AmisFormDirectiveModule } from 'src/common/directive/form-directive/form-directive.module';
import { AmisControlFormGroupModule } from '../../amis-control-form-group/amis-control-form-group.module';


@NgModule({
  declarations: [AmisControlCompareGroupRowComponent, PopupCompareUpdateFieldComponent],
  imports: [
    CommonModule,
    AmisButtonModule,
    AmisPagingGridModule,
    TranslateModule,
    DxDataGridModule,
    AmisIconModule,
    AMISDateModule,
    AMISCurrencyModule,
    AmisAMISDecimalModule,
    DxPopoverModule,
    AmisPopupModule,
    AmisControlFieldModule,
    AmisControlTextareaModule,
    AmisFormDirectiveModule,
    AmisControlFormGroupModule
  ],
  exports: [AmisControlCompareGroupRowComponent]
})
export class AmisControlCompareGroupRowModule { }

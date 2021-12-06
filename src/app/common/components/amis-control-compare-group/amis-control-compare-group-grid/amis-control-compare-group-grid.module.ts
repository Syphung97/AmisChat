import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisControlCompareGroupGridComponent } from './amis-control-compare-group-grid.component';
import { AmisButtonModule } from '../../amis-button/amis-button.module';
import { AmisPagingGridModule } from '../../amis-grid/amis-paging-grid/amis-paging-grid.module';
import { AmisIconModule } from '../../amis-icon/amis-icon.module';
import { TranslateModule } from '@ngx-translate/core';
import { AmisControlTextareaModule } from '../../amis-control-textarea/amis-control-textarea.module';
import { AmisPopupModule } from '../../amis-popup/amis-popup.module';
import { AmisFormDirectiveModule } from 'src/common/directive/form-directive/form-directive.module';
import { DxPopoverModule } from 'devextreme-angular';

@NgModule({
  declarations: [AmisControlCompareGroupGridComponent],
  imports: [
    CommonModule,
    AmisButtonModule,
    AmisPagingGridModule,
    TranslateModule,
    AmisIconModule,
    AmisControlTextareaModule,
    AmisPopupModule,
    AmisFormDirectiveModule,
    DxPopoverModule
  ],
  exports: [AmisControlCompareGroupGridComponent]
})
export class AmisControlCompareGroupGridModule { }

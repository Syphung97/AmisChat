import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupAdvanceExportComponent } from './popup-advance-export.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisControlComboboxModule } from 'src/common/components/amis-control-combobox/amis-control-combobox.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { DxListModule } from 'devextreme-angular';
import { DxPopoverModule } from 'devextreme-angular';

@NgModule({
  declarations: [PopupAdvanceExportComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    AmisControlComboboxModule,
    AmisButtonModule,
    TranslateModule,
    DxListModule,
    DxPopoverModule
  ],
  exports: [PopupAdvanceExportComponent]
})
export class PopupAdvanceExportModule { }

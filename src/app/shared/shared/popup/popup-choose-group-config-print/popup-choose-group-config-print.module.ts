import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupChooseGroupConfigPrintComponent } from './popup-choose-group-config-print.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { DxCheckBoxModule } from 'devextreme-angular';
import { AmisLoadingModule } from 'src/common/components/amis-loading/amis-loading.module';

@NgModule({
  declarations: [PopupChooseGroupConfigPrintComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    AmisButtonModule,
    TranslateModule,
    AmisLoadingModule,
    DxCheckBoxModule
  ],
  exports: [PopupChooseGroupConfigPrintComponent]
})
export class PopupChooseGroupConfigPrintModule { }

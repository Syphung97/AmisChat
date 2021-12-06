import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupSetupDataComponent } from './popup-setup-data.component';
import { DxListModule, DxScrollViewModule } from 'devextreme-angular';
import { TranslateModule } from '@ngx-translate/core';
import { DxTextBoxModule } from 'devextreme-angular';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { DxPopoverModule } from 'devextreme-angular';
import { AmisLoadingModule } from 'src/common/components/amis-loading/amis-loading.module';


@NgModule({
  declarations: [PopupSetupDataComponent],
  imports: [
    CommonModule,
    DxListModule,
    TranslateModule,
    DxTextBoxModule,
    AmisPopupModule,
    AmisButtonModule,
    DxScrollViewModule,
    DxPopoverModule,
    AmisLoadingModule
  ],
  exports: [
    PopupSetupDataComponent
  ]
})
export class PopupSetupDataModule {
  static components = {
    popup: PopupSetupDataComponent
  };
}

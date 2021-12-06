import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupBaseSelectDataComponent } from './popup-base-select-data.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { DxTextBoxModule } from 'devextreme-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AmisPagingGridModule } from 'src/common/components/amis-grid/amis-paging-grid/amis-paging-grid.module';
import { PopupBaseAddDataModule } from '../popup-base-add-data/popup-base-add-data.module';


@NgModule({
  declarations: [PopupBaseSelectDataComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    AmisButtonModule,
    DxTextBoxModule,
    AmisPagingGridModule,
    TranslateModule,
    PopupBaseAddDataModule
  ],
  exports: [
    PopupBaseSelectDataComponent
  ]
})
export class PopupBaseSelectDataModule {
  static components = {
    popup: PopupBaseSelectDataComponent
  };
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupReorderItemsComponent } from './popup-reorder-items.component';
import { DxListModule, DxScrollViewModule } from 'devextreme-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisLoadingModule } from 'src/common/components/amis-loading/amis-loading.module';
import { DxPopoverModule } from 'devextreme-angular';



@NgModule({
  declarations: [PopupReorderItemsComponent],
  imports: [
    CommonModule,
    DxListModule,
    DxScrollViewModule,
    TranslateModule,
    AmisPopupModule,
    AmisButtonModule,
    AmisLoadingModule,
    DxPopoverModule
  ],
  exports: [PopupReorderItemsComponent]
})
export class PopupReorderItemsModule { }

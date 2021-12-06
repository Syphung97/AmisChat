import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisPagingGridModule } from 'src/common/components/amis-grid/amis-paging-grid/amis-paging-grid.module';
import { PopupNotifyValidateInfoComponent } from './popup-notify-validate-info.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PopupNotifyValidateInfoComponent],
  imports: [
    CommonModule,
    AmisPagingGridModule,
    AmisPopupModule,
    AmisButtonModule,
    TranslateModule
  ],
  exports:[
    PopupNotifyValidateInfoComponent
  ]
})
export class PopupNotifyValidateInfoModule { }

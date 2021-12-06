import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupResultTransferCandidateComponent } from './popup-result-transfer-candidate.component';
import { DxScrollViewModule } from 'devextreme-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisPagingGridModule } from 'src/common/components/amis-grid/amis-paging-grid/amis-paging-grid.module';


@NgModule({
  declarations: [PopupResultTransferCandidateComponent],
  imports: [
    CommonModule,
    DxScrollViewModule,
    TranslateModule,
    AmisPopupModule,
    AmisButtonModule,
    AmisPagingGridModule
  ],
  exports:[
    PopupResultTransferCandidateComponent
  ]
})
export class PopupResultTransferCandidateModule { }

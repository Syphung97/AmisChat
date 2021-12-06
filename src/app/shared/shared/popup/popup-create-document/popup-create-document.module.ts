import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupCreateDocumentComponent } from './popup-create-document.component';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { TranslateModule } from '@ngx-translate/core';
import { AmisControlTextboxModule } from 'src/common/components/amis-control-textbox/amis-control-textbox.module';
import { AmisControlComboboxModule } from 'src/common/components/amis-control-combobox/amis-control-combobox.module';
import {DxTextBoxModule, DxSelectBoxModule, DxRadioGroupModule} from 'devextreme-angular'
import { AmisPagingGridModule } from 'src/common/components/amis-grid/amis-paging-grid/amis-paging-grid.module';
import { AmisLoadingModule } from 'src/common/components/amis-loading/amis-loading.module';
import { PopupViewDocumentModule } from '../popup-view-document/popup-view-document.module';
import { ShareDirectiveModule } from '../../directive/share-directive/share-directive.module';
@NgModule({
  declarations: [PopupCreateDocumentComponent],
  imports: [
    CommonModule,
    AmisButtonModule,
    AmisPopupModule,
    TranslateModule,
    AmisControlTextboxModule,
    AmisControlComboboxModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    AmisPagingGridModule,
    AmisLoadingModule,
    DxRadioGroupModule,
    PopupViewDocumentModule,
    ShareDirectiveModule
  ],
  exports:[PopupCreateDocumentComponent]
})
export class PopupCreateDocumentModule { }

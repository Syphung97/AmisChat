import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DxTextBoxModule, DxDataGridModule } from 'devextreme-angular';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { PopupImportDocumentSampleComponent } from './popup-import-document-sample.component';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisPagingGridModule } from 'src/common/components/amis-grid/amis-paging-grid/amis-paging-grid.module';
import { PopupEditDocumentSampleModule } from '../popup-edit-document-sample/popup-edit-document-sample.module';
import { AmisUploadDirectiveModule } from 'src/common/directive/upload-directive/upload-directive.module';



@NgModule({
  declarations: [PopupImportDocumentSampleComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    AmisButtonModule,
    TranslateModule,
    DxTextBoxModule,
    DxDataGridModule,
    AmisPagingGridModule,
    PopupEditDocumentSampleModule,
    AmisUploadDirectiveModule
  ],
  exports:[
    PopupImportDocumentSampleComponent
  ]
})
export class PopupImportDocumentSampleModule {
  static components = {
    viewForm: PopupImportDocumentSampleComponent
  };
 }

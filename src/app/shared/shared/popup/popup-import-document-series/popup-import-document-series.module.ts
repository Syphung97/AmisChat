import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupImportDocumentSeriesComponent } from './popup-import-document-series.component';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { AmisPagingGridModule } from 'src/common/components/amis-grid/amis-paging-grid/amis-paging-grid.module';
import { PopupEditDocumentSampleModule } from '../popup-edit-document-sample/popup-edit-document-sample.module';
import { AmisUploadDirectiveModule } from 'src/common/directive/upload-directive/upload-directive.module';
import { TranslateModule } from '@ngx-translate/core';
import { DxTextBoxModule, DxDataGridModule, DxScrollViewModule, DxPopoverModule } from 'devextreme-angular';
import { FormsModule } from '@angular/forms';
import { ImportDocumentMappingComponent } from './import-document-mapping/import-document-mapping.component';


@NgModule({
  declarations: [PopupImportDocumentSeriesComponent, ImportDocumentMappingComponent],
  imports: [
    CommonModule,
    AmisPopupModule,
    AmisButtonModule,
    TranslateModule,
    DxTextBoxModule,
    DxDataGridModule,
    AmisPagingGridModule,
    PopupEditDocumentSampleModule,
    AmisUploadDirectiveModule,
    DxScrollViewModule,
    FormsModule,
    DxPopoverModule
  ],
  exports: [PopupImportDocumentSeriesComponent]
})
export class PopupImportDocumentSeriesModule { }

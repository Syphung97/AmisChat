import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupImportComponent } from './popup-import.component';
import { FormsModule } from '@angular/forms';
import { BaseModule } from 'src/common/components/base/base.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AmisButtonModule } from 'src/common/components/amis-button/amis-button.module';
import { DxPopupModule, DxTextBoxModule, DxSelectBoxModule, DxScrollViewModule, DxToastModule, DxButtonModule, DxNumberBoxModule, DxPopoverModule } from 'devextreme-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AmisPagingGridModule } from 'src/common/components/amis-grid/amis-paging-grid/amis-paging-grid.module';
import { AmisPopupModule } from 'src/common/components/amis-popup/amis-popup.module';
import { AmisLoadingModule } from 'src/common/components/amis-loading/amis-loading.module';
import { AmisUploadDirectiveModule } from 'src/common/directive/upload-directive/upload-directive.module';

@NgModule({
  declarations: [PopupImportComponent],
  imports: [
    CommonModule,
    DxPopupModule,
    DxTextBoxModule,
    DxScrollViewModule,
    FormsModule,
    TranslateModule,
    DxToastModule,
    BaseModule,
    DxButtonModule,
    DxNumberBoxModule,
    DxSelectBoxModule,
    AmisButtonModule,
    AmisPagingGridModule,
    NgbModule,
    AmisPopupModule,
    AmisLoadingModule,
    AmisUploadDirectiveModule,
    DxPopoverModule
  ],
  exports: [PopupImportComponent]
})
export class PopupImportModule {
  static components = {
    viewForm: PopupImportComponent
  };
}

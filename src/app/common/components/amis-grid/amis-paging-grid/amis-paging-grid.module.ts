import { NgModule } from '@angular/core';
import { AmisPagingGridComponent } from './amis-paging-grid.component';
import { CommonModule, registerLocaleData } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DxDataGridModule, DxTextBoxModule, DxCheckBoxModule, DxSelectBoxModule, DxContextMenuModule, DxPopoverModule } from 'devextreme-angular';
import { AmisColumnComponent } from './amis-column/amis-column.component';
import { PagingComponent } from './paging/paging.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AmisButtonModule } from '../../amis-button/amis-button.module';
import { AmisListDragDropModule } from '../../amis-list-drag-drop/amis-list-drag-drop.module';
import { AmisShortNameModule } from 'src/common/pipes/amis-name/amis-short-name.module';
import { AMISCurrencyModule } from 'src/common/pipes/amis-currency/amis-currency.module';
import localeVN from '@angular/common/locales/vi';
import { CutCaptionRequireModule } from 'src/app/shared/pipe/cup-caption-require/cut-caption-require.module';
import { AMISDateModule } from 'src/common/pipes/amis-date/amis-date.module';
import { AmisAMISDecimalModule } from 'src/common/pipes/amis-decimal/amis-decimal.module';
import { PopupPreviewMultipleAttachmentModule } from 'src/app/shared/popup/popup-preview-multiple-attachment/popup-preview-multiple-attachment.module';
import { ShareDirectiveModule } from 'src/app/shared/directive/share-directive/share-directive.module';
import { EmployeeViewDetailModule } from 'src/app/shared/components/detail/employee-view-detail/employee-view-detail.module';
import { AmisIconModule } from '../../amis-icon/amis-icon.module';
registerLocaleData(localeVN, 'vi-VN');

@NgModule({
  declarations: [AmisPagingGridComponent, AmisColumnComponent, PagingComponent],
  imports: [
    CommonModule,
    TranslateModule,
    DxDataGridModule,
    DxTextBoxModule,
    DxCheckBoxModule,
    NgbModule,
    AmisButtonModule,
    AmisListDragDropModule,
    DxSelectBoxModule,
    DxContextMenuModule,
    DxPopoverModule,
    AmisShortNameModule,
    AMISCurrencyModule,
    CutCaptionRequireModule,
    AMISDateModule,
    AmisAMISDecimalModule,
    PopupPreviewMultipleAttachmentModule,
    ShareDirectiveModule,
    EmployeeViewDetailModule,
    AmisIconModule
  ],
  exports: [AmisPagingGridComponent]
})
export class AmisPagingGridModule { }

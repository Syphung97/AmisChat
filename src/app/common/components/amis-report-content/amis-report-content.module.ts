import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmisReportContentComponent } from './amis-report-content.component';
import { DxScrollViewModule } from 'devextreme-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AmisPagingGridModule } from '../amis-grid/amis-paging-grid/amis-paging-grid.module';
import { AmisDoughnutCharModule } from '../amis-char/amis-doughnut-char/amis-doughnut-char.module';
import { AmisLoadingModule } from '../amis-loading/amis-loading.module';
import { PopupAdvanceExportModule } from 'src/app/shared/popup/popup-advance-export/popup-advance-export.module';
import { AmisIconModule } from '../amis-icon/amis-icon.module';


@NgModule({
  declarations: [AmisReportContentComponent],
  imports: [
    CommonModule,
    DxScrollViewModule,
    TranslateModule,
    AmisPagingGridModule,
    AmisDoughnutCharModule,
    AmisLoadingModule,
    PopupAdvanceExportModule,
    AmisIconModule
  ],
  exports: [
    AmisReportContentComponent
  ]
})
export class AmisReportContentModule { }
